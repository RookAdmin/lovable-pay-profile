
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeProps {
  value: string;
  size?: number;
  logoUrl?: string;
  type?: 'upi' | 'payment';
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 180,
  logoUrl,
  type = 'upi',
  className = '' 
}) => {
  // In a real implementation, we would generate a real QR code
  // For now we're using a placeholder image with styling to simulate it
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard!');
  };
  
  const handleDownload = () => {
    // In a real implementation, we would generate and download the QR code
    toast.success('QR code downloaded');
  };
  
  const handleOpenUPI = () => {
    // In a real implementation, we would open the UPI deep link
    toast.success('Opening UPI app');
  };
  
  return (
    <Card className={`border-0 shadow-none ${className}`}>
      <CardContent className="p-0 flex flex-col items-center">
        <div 
          className="relative rounded-2xl bg-white border-2 border-gray-100 overflow-hidden mb-3"
          style={{ width: size, height: size }}
        >
          <div className="absolute inset-0 p-4 grid grid-cols-7 grid-rows-7 gap-1">
            {/* Simulated QR code pattern */}
            {Array.from({ length: 49 }).map((_, i) => (
              <div 
                key={i}
                className={`
                  ${Math.random() > 0.7 ? 'bg-black' : 'bg-transparent'} 
                  ${(i < 7 || i > 41 || i % 7 === 0 || i % 7 === 6) ? 'opacity-30' : ''}
                  rounded-sm
                `}
              />
            ))}
            
            {/* Center logo if provided */}
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-1 rounded-md">
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="w-10 h-10 object-contain" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            className="text-xs h-8"
          >
            <Copy size={14} className="mr-1" /> Copy
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            className="text-xs h-8"
          >
            <Download size={14} className="mr-1" /> Save
          </Button>
          
          {type === 'upi' && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleOpenUPI} 
              className="text-xs h-8"
            >
              <Smartphone size={14} className="mr-1" /> Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCode;
