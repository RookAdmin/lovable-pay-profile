
import { useState, useEffect } from 'react';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
}

export const usePasswordValidation = (password: string) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isStrong: false
  });

  useEffect(() => {
    const validatePassword = () => {
      const feedback: string[] = [];
      let score = 0;

      if (password.length === 0) {
        setStrength({ score: 0, feedback: [], isStrong: false });
        return;
      }

      // Length check
      if (password.length < 8) {
        feedback.push('At least 8 characters required');
      } else {
        score += 1;
      }

      // Uppercase check
      if (!/[A-Z]/.test(password)) {
        feedback.push('Add uppercase letter');
      } else {
        score += 1;
      }

      // Lowercase check
      if (!/[a-z]/.test(password)) {
        feedback.push('Add lowercase letter');
      } else {
        score += 1;
      }

      // Number check
      if (!/\d/.test(password)) {
        feedback.push('Add number');
      } else {
        score += 1;
      }

      // Special character check
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.push('Add special character');
      } else {
        score += 1;
      }

      const isStrong = score >= 4 && password.length >= 8;

      setStrength({
        score,
        feedback,
        isStrong
      });
    };

    validatePassword();
  }, [password]);

  return strength;
};
