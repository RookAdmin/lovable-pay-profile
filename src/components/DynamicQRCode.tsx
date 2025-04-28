
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DynamicQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  type?: 'upi' | 'payment';
}

const DynamicQRCode: React.FC<DynamicQRCodeProps> = ({ 
  value, 
  size = 180,
  type = 'upi',
  className = '' 
}) => {
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    if (!value) return;
    
    if (type === 'upi') {
      // Format UPI URL with proper encoding
      const upiUrl = `upi://pay?pa=${encodeURIComponent(value)}`;
      setQrValue(upiUrl);
    } else {
      setQrValue(value);
    }
  }, [value, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard!');
  };
  
  const handleDownload = () => {
    const svg = document.querySelector('#qr-code svg') as HTMLElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR code downloaded');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  const handleOpenUPI = () => {
    if (!qrValue) return;
    window.location.href = qrValue;
    toast.success('Opening UPI app');
  };
  
  return (
    <Card className={`border-0 shadow-none ${className}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <motion.div 
          className="relative p-4 bg-white rounded-2xl shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          id="qr-code"
        >
          <QRCodeSVG
            value={qrValue || 'empty'}
            size={size}
            level="H"
            includeMargin
            imageSettings={{
              src: "/lovable-uploads/c34235af-7981-4a49-9a23-5176a93e9a81.png",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </motion.div>
        
        <motion.div 
          className="flex gap-2 mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DynamicQRCode;
