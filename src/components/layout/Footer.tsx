
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
            <p className="text-sm text-[#555555] mt-2">
              Privacy-first payment identities for creators
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-[#333333]">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-[#555555] hover:text-[#333333]">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-[#555555] hover:text-[#333333]">Pricing</Link></li>
                <li><Link to="/blog" className="text-sm text-[#555555] hover:text-[#333333]">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-[#333333]">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-[#555555] hover:text-[#333333]">About</Link></li>
                <li><Link to="/contact" className="text-sm text-[#555555] hover:text-[#333333]">Contact</Link></li>
                <li><Link to="/blog" className="text-sm text-[#555555] hover:text-[#333333]">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-[#333333]">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-sm text-[#555555] hover:text-[#333333]">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm text-[#555555] hover:text-[#333333]">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-[#555555]">
            © {new Date().getFullYear()} Paym.me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
