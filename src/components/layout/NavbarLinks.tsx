
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavbarLinks = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Check if we're in a dashboard-related page
  const isDashboardPath = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/analytics') ||
    location.pathname.includes('/settings') ||
    location.pathname.includes('/profile');
  
  // If inside dashboard, show minimal navigation
  if (isDashboardPath && user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rook-red"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile">Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#" target="_blank">View Live Profile</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Regular navigation for landing pages
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/pricing" className="text-foreground hover:text-rook-red transition-colors">
        Pricing
      </Link>
      <Link to="/blog" className="text-foreground hover:text-rook-red transition-colors">
        Blog
      </Link>
      <Link to="/about" className="text-foreground hover:text-rook-red transition-colors">
        About
      </Link>
      <Link to="/contact" className="text-foreground hover:text-rook-red transition-colors">
        Contact
      </Link>
      
      {user ? (
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavbarLinks;
