import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // Show navigation links only on homepage and other public pages
  const showNavLinks =
    location.pathname === "/" ||
    location.pathname === "/features" ||
    location.pathname === "/solutions" ||
    location.pathname === "/resources" ||
    location.pathname === "/trends" ||
    location.pathname === "/pricing" ||
    location.pathname === "/blog";

  const NavLinks = () => (
    <>
      <Link
        to="/features"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Features
      </Link>
      <Link
        to="/solutions"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Solutions
      </Link>
      <Link
        to="/resources"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Free Resources
      </Link>
      <Link
        to="/trends"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Latest Trends
      </Link>
      <Link
        to="/pricing"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Pricing
      </Link>
      <Link
        to="/blog"
        className="text-black hover:text-secondary transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Blog
      </Link>
    </>
  );

  const AuthButtons = () => (
    <>
      {user ? (
        <>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full md:w-auto"
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Link to="/demo" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 font-medium w-full md:w-auto"
            >
              ▶ DEMO
            </Button>
          </Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <Button
              variant="outline"
              size="sm"
              className="font-medium w-full md:w-auto"
            >
              LOGIN
            </Button>
          </Link>
          <Link to="/signup" onClick={() => setIsOpen(false)}>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 font-medium w-full md:w-auto"
            >
              CREATE FREE ACCOUNT
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/">
            <Logo withTagline />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {showNavLinks && (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        )}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <AuthButtons />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <Logo withTagline />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                {showNavLinks && (
                  <nav className="flex flex-col space-y-4 py-6 border-b">
                    <NavLinks />
                  </nav>
                )}

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-6 mt-auto">
                  <AuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
