
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
  amount?: number;
  payeeName?: string;
  transactionNote?: string;
}

const DynamicQRCode: React.FC<DynamicQRCodeProps> = ({ 
  value, 
  size = 180,
  type = 'upi',
  className = '',
  amount,
  payeeName,
  transactionNote
}) => {
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    if (!value) return;
    
    console.log("DynamicQRCode received:", { value, amount, payeeName, transactionNote });
    
    if (type === 'upi') {
      // Create comprehensive UPI URL for payments
      let upiUrl = `upi://pay?pa=${encodeURIComponent(value)}`;
      
      // Add payee name if provided
      if (payeeName && payeeName.trim()) {
        upiUrl += `&pn=${encodeURIComponent(payeeName.trim())}`;
      }
      
      // Add amount if provided - format to 2 decimal places
      if (amount && amount > 0) {
        upiUrl += `&am=${parseFloat(amount.toString()).toFixed(2)}`;
      }
      
      // Add transaction note if provided  
      if (transactionNote && transactionNote.trim()) {
        upiUrl += `&tn=${encodeURIComponent(transactionNote.trim())}`;
      }
      
      // Add currency (INR for UPI)
      upiUrl += '&cu=INR';
      
      // Add transaction reference for better tracking
      const txnRef = `PAY${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      upiUrl += `&tr=${txnRef}`;
      
      console.log("Generated comprehensive UPI URL:", upiUrl);
      setQrValue(upiUrl);
    } else {
      setQrValue(value);
    }
  }, [value, type, amount, payeeName, transactionNote]);

  const handleCopy = () => {
    const textToCopy = qrValue || value;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Payment details copied to clipboard!');
  };
  
  const handleDownload = () => {
    try {
      const svg = document.querySelector('#dynamic-qr-code svg') as HTMLElement;
      if (!svg) {
        toast.error('QR code not found');
        return;
      }
      
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
        downloadLink.download = 'upi-payment-qr.png';
        downloadLink.href = pngFile;
        downloadLink.click();
        
        toast.success('QR code downloaded successfully');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download QR code');
    }
  };
  
  const handleOpenUPI = () => {
    if (!qrValue) {
      toast.error('No payment data available');
      return;
    }

    console.log("Opening UPI with URL:", qrValue);
    
    try {
      // For mobile devices, use direct window.location.href
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Direct assignment works best for UPI apps
        window.location.href = qrValue;
        
        // Show immediate success message
        toast.success('Opening payment app...');
        
        // Fallback guidance after delay
        setTimeout(() => {
          if (document.hasFocus()) {
            toast.info('If the app didn\'t open, try scanning the QR code directly.');
          }
        }, 2000);
      } else {
        // Desktop: inform user to use mobile or scan QR
        navigator.clipboard.writeText(qrValue);
        toast.info('Payment link copied! Use on mobile device or scan QR code with UPI app.');
      }
    } catch (error) {
      console.error('Error opening UPI app:', error);
      // Fallback: copy link
      navigator.clipboard.writeText(qrValue);
      toast.error('Could not open payment app. Link copied - paste in UPI app or scan QR code.');
    }
  };
  
  if (!qrValue) {
    return (
      <Card className={`border-0 shadow-none ${className}`}>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="w-48 h-48 flex items-center justify-center text-gray-400 border rounded-2xl">
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">No payment data</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`border-0 shadow-none ${className}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <motion.div 
          className="relative p-4 bg-white rounded-2xl shadow-lg border border-gray-100"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          id="dynamic-qr-code"
        >
          <QRCodeSVG
            value={qrValue}
            size={size}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
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
              className="text-xs h-8 bg-primary hover:bg-primary/90"
            >
              <Smartphone size={14} className="mr-1" /> Pay
            </Button>
          )}
        </div>
        
        {amount && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">Amount: ₹{parseFloat(amount.toString()).toFixed(2)}</p>
            {payeeName && <p className="text-xs text-gray-500">To: {payeeName}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicQRCode;
