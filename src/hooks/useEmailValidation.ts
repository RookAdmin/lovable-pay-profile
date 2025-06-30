
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!email || email.length < 3 || !email.includes('@')) {
      setEmailExists(false);
      setHasChecked(false);
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);
      try {
        // Try to sign up with the email to check if it exists
        // This is the most reliable way to check email existence
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'temp-password-for-check-123!@#', // Temporary password
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });
        
        // If there's an error about email already registered, user exists
        if (error && error.message.toLowerCase().includes('already registered')) {
          setEmailExists(true);
        } else if (error && error.message.toLowerCase().includes('user already registered')) {
          setEmailExists(true);
        } else if (data.user && !data.user.email_confirmed_at) {
          // If signup succeeded but email not confirmed, it means email is available
          setEmailExists(false);
          // Clean up the test user registration immediately
          if (data.session) {
            await supabase.auth.signOut();
          }
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        console.log('Email check error:', error);
        setEmailExists(false);
      }
      setIsChecking(false);
      setHasChecked(true);
    };

    const timer = setTimeout(checkEmail, 1000); // Increased debounce time
    return () => clearTimeout(timer);
  }, [email]);

  return { isChecking, emailExists, hasChecked };
};
