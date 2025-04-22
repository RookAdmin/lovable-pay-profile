
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Coffee, Zap, CreditCard, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SmartLinksForm from './SmartLinksForm';

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
  const [showForm, setShowForm] = useState(false);
  
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
    toast.success(`Processing ${link.currency}${link.amount} payment`);
  };
  
  return (
    <Card className={`shadow-md border-gray-100 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Smart Links</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : (
            <>
              <PlusCircle size={16} className="mr-2" />
              {links.length === 0 ? 'Create Smart Link' : 'Manage Smart Links'}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <SmartLinksForm existingLinks={links} />
        ) : (
          <>
            {links.length > 0 ? (
              <div className="space-y-3">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className="w-full flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50 transition group"
                  >
                    <div className={`rounded-full p-2.5 ${link.gradient ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100'}`}>
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
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No smart links created yet. Create your first payment link to get started!
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartLinkSection;
