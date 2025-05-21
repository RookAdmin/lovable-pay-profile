import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/">
            <Logo withTagline />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/features"
            className="text-black hover:text-secondary transition-colors"
          >
            Features
          </Link>
          <Link
            to="/solutions"
            className="text-black hover:text-secondary transition-colors"
          >
            Solutions
          </Link>
          <Link
            to="/resources"
            className="text-black hover:text-secondary transition-colors"
          >
            Free Resources
          </Link>
          <Link
            to="/trends"
            className="text-black hover:text-secondary transition-colors"
          >
            Latest Trends
          </Link>
          <Link
            to="/pricing"
            className="text-black hover:text-secondary transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            className="text-black hover:text-secondary transition-colors"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 font-medium"
                >
                  ▶ DEMO
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="font-medium">
                  LOGIN
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800 font-medium"
                >
                  CREATE FREE ACCOUNT
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
