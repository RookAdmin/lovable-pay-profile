
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { BadgeCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 py-8 mt-auto">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <Logo withTagline />
            <p className="text-sm text-black mt-2">
              Your Payment Receivables Identity
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 text-left">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-black">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-secondary">Support</Link></li>
                <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-secondary">Pricing</Link></li>
                <li><Link to="/blog" className="text-sm text-gray-600 hover:text-secondary">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-black">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-secondary">About</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-secondary">Contact</Link></li>
                <li className="flex items-center">
                  <Link to="/verification" className="text-sm text-gray-600 hover:text-secondary mr-1">Verification</Link>
                  <BadgeCheck className="h-4 w-4 text-green" />
                </li>
                <li><Link to="/brand-kit" className="text-sm text-gray-600 hover:text-secondary">Brand Kit</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-black">Happenings</h3>
              <ul className="space-y-2">
                <li><a href="https://rookhq.com/perspectives" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-secondary">Perspectives</a></li>
                <li><a href="https://rookhq.com/press-release" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-secondary">Press Release</a></li>
                <li><a href="https://rookhq.com/media-coverage" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-secondary">Media Coverage</a></li>
                <li><a href="https://rookhq.com/letter-from-the-ceo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-secondary">Letter from the CEO</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-black">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-secondary">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-secondary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center md:text-left">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Rook Platforms. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
