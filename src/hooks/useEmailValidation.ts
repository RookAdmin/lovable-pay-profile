
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail } from '@/utils/validation';

export const useEmailValidation = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isValidFormat, setIsValidFormat] = useState(true);

  useEffect(() => {
    // First check if email format is valid
    if (!email) {
      setEmailExists(false);
      setHasChecked(false);
      setIsValidFormat(true);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidFormat(false);
      setHasChecked(false);
      setEmailExists(false);
      return;
    }

    setIsValidFormat(true);

    const checkEmail = async () => {
      setIsChecking(true);
      setHasChecked(false);
      
      try {
        // Try to sign up with the email to check if it exists
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'TempCheck123!@#$%^&*()',
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (signUpError) {
          // Check if error message indicates user already exists
          const errorMessage = signUpError.message.toLowerCase();
          if (
            errorMessage.includes('already') ||
            errorMessage.includes('registered') ||
            errorMessage.includes('exists')
          ) {
            setEmailExists(true);
          } else {
            setEmailExists(false);
          }
        } else if (signUpData.user) {
          // Check if user was actually created or already exists
          if (signUpData.user.identities && signUpData.user.identities.length === 0) {
            // User already exists - identities array is empty
            setEmailExists(true);
          } else {
            // New user was created, clean it up
            setEmailExists(false);
            if (signUpData.session) {
              await supabase.auth.signOut();
            }
          }
        } else {
          setEmailExists(false);
        }
      } catch (error: any) {
        console.log('Email check error:', error);
        setEmailExists(false);
      }
      
      setIsChecking(false);
      setHasChecked(true);
    };

    const timer = setTimeout(checkEmail, 1000);
    return () => clearTimeout(timer);
  }, [email]);

  return { isChecking, emailExists, hasChecked, isValidFormat };
};
