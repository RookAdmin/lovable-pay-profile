
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
          src="/paym-logo.png"
          alt="Paym.me Logo"
          className="h-12 w-auto"
        />
      </div>
    </Link>
  );
};

export default Logo;
