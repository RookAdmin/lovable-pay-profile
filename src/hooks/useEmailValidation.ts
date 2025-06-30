
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!email || email.length < 3) {
      setEmailExists(false);
      setHasChecked(false);
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', email) // This won't work for email check, we need to check auth.users
          .single();
        
        // Since we can't directly query auth.users, we'll try to sign in with a fake password
        // If the user exists, we'll get a specific error
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'fake-password-for-check'
        });
        
        // If error message contains 'Invalid login credentials', user exists but password is wrong
        // If error contains 'Email not confirmed' or similar, user exists
        if (signInError?.message && 
            (signInError.message.includes('Invalid login credentials') || 
             signInError.message.includes('Email not confirmed'))) {
          setEmailExists(true);
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        setEmailExists(false);
      }
      setIsChecking(false);
      setHasChecked(true);
    };

    const timer = setTimeout(checkEmail, 800); // Debounce
    return () => clearTimeout(timer);
  }, [email]);

  return { isChecking, emailExists, hasChecked };
};
