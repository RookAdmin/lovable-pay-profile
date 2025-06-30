
import { useState, useEffect } from 'react';

interface PasswordValidation {
  isValid: boolean;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  message: string;
}

export const usePasswordValidation = (password: string): PasswordValidation => {
  const [validation, setValidation] = useState<PasswordValidation>({
    isValid: false,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    message: '',
  });

  useEffect(() => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(requirements).every(req => req);
    
    let message = '';
    if (password.length > 0) {
      if (isValid) {
        message = '✓ Strong password';
      } else {
        const missing = [];
        if (!requirements.length) missing.push('8+ characters');
        if (!requirements.uppercase) missing.push('uppercase letter');
        if (!requirements.lowercase) missing.push('lowercase letter');
        if (!requirements.number) missing.push('number');
        if (!requirements.special) missing.push('special character');
        message = `Missing: ${missing.join(', ')}`;
      }
    }

    setValidation({
      isValid,
      requirements,
      message,
    });
  }, [password]);

  return validation;
};
