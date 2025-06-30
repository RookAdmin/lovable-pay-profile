
import React from 'react';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback, isStrong } = usePasswordValidation(password);

  if (!password) return null;

  const getStrengthColor = () => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${isStrong ? 'text-green-600' : 'text-muted-foreground'}`}>
          {getStrengthText()}
        </span>
      </div>
      
      {feedback.length > 0 && (
        <ul className="space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
