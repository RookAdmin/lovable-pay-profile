
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  withTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '',
  variant = 'default',
  withTagline = false 
}) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${variant === 'white' ? 'text-white' : 'gradient-text'}`}>
          paym<span className="text-brand-purple">.me</span>
        </span>
        {withTagline && (
          <span className="text-xs text-muted-foreground mt-0.5">Privacy-first payments</span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
