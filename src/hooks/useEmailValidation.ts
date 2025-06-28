
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!email || email.length < 3) {
      setEmailExists(null);
      setValidationMessage('');
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);
      try {
        // Check if email exists in auth.users table by attempting a sign in with invalid password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'invalid_password_for_checking'
        });
        
        if (error?.message === 'Invalid login credentials') {
          setEmailExists(false);
          setValidationMessage('✓ Email available');
        } else if (error?.message?.includes('Email not confirmed')) {
          setEmailExists(true);
          setValidationMessage('✗ Email already exists');
        } else if (error?.message?.includes('too many requests')) {
          setValidationMessage('Too many requests, please wait');
        } else {
          setEmailExists(true);
          setValidationMessage('✗ Email already exists');
        }
      } catch (error) {
        console.error('Email validation error:', error);
        setValidationMessage('Error checking email');
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // Debounce for 500ms
    return () => clearTimeout(timeoutId);
  }, [email]);

  return { isChecking, emailExists, validationMessage };
};
