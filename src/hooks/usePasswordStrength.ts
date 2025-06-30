
import { useState, useEffect } from 'react';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
  suggestion?: string;
}

export const usePasswordStrength = (password: string): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isStrong: false
  });

  // Generate a strong password suggestion
  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    let suggestion = '';
    
    // Ensure at least one from each category
    suggestion += lowercase[Math.floor(Math.random() * lowercase.length)];
    suggestion += uppercase[Math.floor(Math.random() * uppercase.length)];
    suggestion += numbers[Math.floor(Math.random() * numbers.length)];
    suggestion += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly to make it 12 characters
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      suggestion += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return suggestion.split('').sort(() => Math.random() - 0.5).join('');
  };

  useEffect(() => {
    if (!password) {
      setStrength({ 
        score: 0, 
        feedback: [], 
        isStrong: false,
        suggestion: generateStrongPassword()
      });
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
    const suggestion = !isStrong ? generateStrongPassword() : undefined;

    setStrength({ score, feedback, isStrong, suggestion });
  }, [password]);

  return strength;
};
