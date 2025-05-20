
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartPie } from 'lucide-react';

const NavbarLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
        Dashboard
      </Link>
      <Link to="/analytics" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
        <ChartPie size={16} />
        Analytics
      </Link>
      <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
        Pricing
      </Link>
      <Link to="/about" className="text-foreground hover:text-primary transition-colors">
        About
      </Link>
    </div>
  );
};

export default NavbarLinks;
