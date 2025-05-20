
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/">
            <Logo withTagline />
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link to="/pricing" className="text-black hover:text-secondary transition-colors">Pricing</Link>
            <Link to="/blog" className="text-black hover:text-secondary transition-colors">Blog</Link>
            <Link to="/about" className="text-black hover:text-secondary transition-colors">About</Link>
            <Link to="/contact" className="text-black hover:text-secondary transition-colors">Contact</Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="text-secondary">
                  <User size={20} />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            </>
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
