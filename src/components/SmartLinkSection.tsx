
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Coffee, Zap, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface SmartLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  icon: 'heart' | 'coffee' | 'zap' | 'card';
  gradient?: boolean;
}

interface SmartLinkSectionProps {
  links: SmartLink[];
  className?: string;
}

const SmartLinkSection: React.FC<SmartLinkSectionProps> = ({
  links,
  className = ''
}) => {
  const getIcon = (icon: string, size = 20) => {
    switch (icon) {
      case 'heart': return <Heart size={size} />;
      case 'coffee': return <Coffee size={size} />;
      case 'zap': return <Zap size={size} />;
      case 'card': return <CreditCard size={size} />;
      default: return <Heart size={size} />;
    }
  };
  
  const handleLinkClick = (link: SmartLink) => {
    // In a real implementation, we would handle the payment process
    toast.success(`Processing ₹${link.amount} payment`);
  };
  
  return (
    <Card className={`shadow-md border-gray-100 ${className}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">Quick Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link)}
            className={`w-full payment-link group ${link.gradient ? 'gradient-border' : ''}`}
          >
            <div className={`rounded-full p-2.5 ${link.gradient ? 'bg-gradient-primary text-white' : 'bg-gray-100'}`}>
              {getIcon(link.icon)}
            </div>
            <div className="flex-grow text-left">
              <p className="font-medium">{link.title}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {link.currency}{link.amount}
              </p>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SmartLinkSection;
