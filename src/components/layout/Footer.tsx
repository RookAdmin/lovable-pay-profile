
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 py-8 mt-auto">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo withTagline />
            <p className="text-sm text-muted-foreground mt-2">
              Privacy-first payment identities for creators
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paym.me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
