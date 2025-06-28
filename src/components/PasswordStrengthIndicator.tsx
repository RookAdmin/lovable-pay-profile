
import React from 'react';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { requirements, message, isValid } = usePasswordValidation(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </div>
      <div className="space-y-1">
        {Object.entries(requirements).map(([key, met]) => (
          <div key={key} className={`text-xs flex items-center ${met ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">{met ? '✓' : '○'}</span>
            <span>
              {key === 'length' && '8+ characters'}
              {key === 'uppercase' && 'Uppercase letter'}
              {key === 'lowercase' && 'Lowercase letter'}
              {key === 'number' && 'Number'}
              {key === 'special' && 'Special character'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
