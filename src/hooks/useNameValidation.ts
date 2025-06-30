
import { useState, useEffect } from 'react';

interface NameValidation {
  isValid: boolean;
  error: string;
  cleanedValue: string;
}

export const useNameValidation = (name: string, maxLength: number = 20) => {
  const [validation, setValidation] = useState<NameValidation>({
    isValid: true,
    error: '',
    cleanedValue: name
  });

  useEffect(() => {
    // Remove numbers from name
    const cleanedName = name.replace(/[0-9]/g, '');
    
    let isValid = true;
    let error = '';

    if (name.length > maxLength) {
      isValid = false;
      error = 'Character length is too long';
    } else if (name !== cleanedName) {
      isValid = false;
      error = 'Numbers are not allowed';
    }

    setValidation({
      isValid,
      error,
      cleanedValue: cleanedName
    });
  }, [name, maxLength]);

  return validation;
};
