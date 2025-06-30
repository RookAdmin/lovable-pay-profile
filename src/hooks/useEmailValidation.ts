
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || email.length < 3 || !email.includes('@')) {
        setEmailExists(false);
        setEmailError('');
        return;
      }

      setIsChecking(true);
      setEmailError('');

      try {
        // Check if email exists in auth.users table by attempting a password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://example.com' // Dummy URL, we just want to check if email exists
        });

        // If no error, email exists; if error contains "not found", email doesn't exist
        if (!error) {
          setEmailExists(true);
          setEmailError('Email already exists');
        } else if (error.message.includes('not found') || error.message.includes('Unable to validate email address')) {
          setEmailExists(false);
          setEmailError('');
        } else {
          setEmailExists(false);
          setEmailError('');
        }
      } catch (error) {
        setEmailExists(false);
        setEmailError('');
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [email]);

  return { isChecking, emailExists, emailError };
};
