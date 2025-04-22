
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
  const isLoggedIn = false; // We'll implement authentication later
  
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Logo withTagline />
        
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
