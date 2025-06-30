
import { useState, useEffect } from 'react';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
}

export const usePasswordStrength = (password: string): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isStrong: false
  });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, feedback: [], isStrong: false });
      return;
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character');
    }

    const isStrong = score >= 4;

    setStrength({ score, feedback, isStrong });
  }, [password]);

  return strength;
};
