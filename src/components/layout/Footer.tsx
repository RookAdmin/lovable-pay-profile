
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import { BadgeCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 py-8 mt-auto">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <Logo withTagline />
            <p className="text-sm text-[#555555] mt-2">
            Your Payment Receivables Identity
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 text-left">
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
                <li className="flex items-center">
                  <Link to="/verification" className="text-sm text-[#555555] hover:text-[#333333] mr-1">Verification</Link>
                  <BadgeCheck className="h-4 w-4 text-green-500" />
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-[#333333]">Happenings</h3>
              <ul className="space-y-2">
                <li><Link to="/perspective" className="text-sm text-[#555555] hover:text-[#333333]">Perspectives</Link></li>
                <li><Link to="/press-release" className="text-sm text-[#555555] hover:text-[#333333]">Press Release</Link></li>
                <li><Link to="/media-coverage" className="text-sm text-[#555555] hover:text-[#333333]">Media Coverage</Link></li>
                <li><Link to="/letter-from-the-ceo" className="text-sm text-[#555555] hover:text-[#333333]">Letter from the CEO</Link></li>
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
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center md:text-left">
          <p className="text-sm text-[#555555]">
            © {new Date().getFullYear()} Rook Platforms. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
