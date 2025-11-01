import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from '../_shared/cors.ts';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5;
const attemptTracker = new Map<string, { count: number; resetTime: number }>();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { username, pin } = await req.json();
    
    if (!username || !pin) {
      return new Response(
        JSON.stringify({ error: 'Username and PIN are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate PIN format (6 uppercase alphanumeric)
    const pinRegex = /^[A-Z0-9]{6}$/;
    if (!pinRegex.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'Invalid PIN format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting per IP + username
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `${clientIp}:${username}`;
    const now = Date.now();
    
    const attempts = attemptTracker.get(rateLimitKey);
    if (attempts) {
      if (now < attempts.resetTime) {
        if (attempts.count >= MAX_ATTEMPTS) {
          console.log(`Rate limit exceeded for ${rateLimitKey}`);
          return new Response(
            JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        attempts.count++;
      } else {
        attempts.count = 1;
        attempts.resetTime = now + RATE_LIMIT_WINDOW;
      }
    } else {
      attemptTracker.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Get profile with case-insensitive username lookup
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, profile_pin_hash, profile_pin_enabled')
      .ilike('username', username)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', username);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If PIN protection is disabled, allow access
    if (!profile.profile_pin_enabled) {
      console.log(`PIN protection disabled for ${username}`);
      
      // Get payment methods
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('is_active', true);

      return new Response(
        JSON.stringify({ 
          success: true, 
          pinRequired: false,
          paymentMethods: paymentMethods || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate PIN using simple hash comparison
    // In production, use bcrypt or argon2
    const pinHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(pin + 'paym_salt_2024')
    );
    const pinHashHex = Array.from(new Uint8Array(pinHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = pinHashHex === profile.profile_pin_hash;

    // Log audit trail
    await supabase
      .from('profile_pin_audit')
      .insert({
        profile_id: profile.id,
        attempt_success: isValid,
        attempt_ip: clientIp,
        attempt_user_agent: req.headers.get('user-agent')
      });

    if (!isValid) {
      console.log(`Invalid PIN attempt for ${username}`);
      return new Response(
        JSON.stringify({ error: 'Invalid Profile PIN. Try again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PIN is valid - return payment methods
    const { data: paymentMethods } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true);

    console.log(`Successful PIN validation for ${username}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        pinRequired: true,
        paymentMethods: paymentMethods || []
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-profile-pin:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});