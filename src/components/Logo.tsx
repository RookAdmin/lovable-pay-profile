
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
        <img 
          src="/lovable-uploads/c34235af-7981-4a49-9a23-5176a93e9a81.png"
          alt="Paym.me Logo"
          className="h-8 w-auto"
        />
        {withTagline && (
          <span className="text-xs text-muted-foreground mt-0.5">Privacy-first payments</span>
        )}
      </div>
    </Link>
  );
};

export default Logo;

