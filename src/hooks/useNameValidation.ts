
import { useState, useEffect } from 'react';

export const useNameValidation = (name: string, fieldName: string) => {
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (name.length === 0) {
      setIsValid(true);
      setMessage('');
      return;
    }

    // Check for numbers
    const hasNumbers = /\d/.test(name);
    if (hasNumbers) {
      setIsValid(false);
      setMessage(`${fieldName} cannot contain numbers`);
      return;
    }

    // Check length
    if (name.length > 20) {
      setIsValid(false);
      setMessage(`${fieldName} is too long (max 20 characters)`);
      return;
    }

    setIsValid(true);
    setMessage(`✓ ${fieldName} looks good`);
  }, [name, fieldName]);

  return { isValid, message };
};
