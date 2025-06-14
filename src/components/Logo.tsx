
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
          src="/lovable-uploads/48be0c8b-7024-4561-8197-b8fb18c8c01a.png"
          alt="Paym.me Logo"
          className="h-8 w-auto"
        />
      </div>
    </Link>
  );
};

export default Logo;
