
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChartPie, CreditCard, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const NavbarLinks = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if we're in a dashboard-related page
  const isDashboardPath = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/analytics') ||
    location.pathname.includes('/settings');
  
  // If inside dashboard, show minimal navigation
  if (isDashboardPath && user) {
    return (
      <div className="hidden md:flex items-center space-x-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <User size={18} />
            <span>{user.email}</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Regular navigation for landing pages
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/pricing" className="text-foreground hover:text-rook-red transition-colors">
        Pricing
      </Link>
      <Link to="/analytics" className="text-foreground hover:text-rook-red transition-colors flex items-center gap-2">
        <ChartPie size={16} />
        Analytics
      </Link>
      <Link to="/about" className="text-foreground hover:text-rook-red transition-colors">
        About
      </Link>
      {user ? (
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <CreditCard size={16} />
            Dashboard
          </Link>
        </Button>
      ) : (
        <Button size="sm" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      )}
    </div>
  );
};

export default NavbarLinks;
