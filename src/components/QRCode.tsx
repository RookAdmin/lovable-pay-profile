
import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  amount?: number;
  payeeName?: string;
  transactionNote?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 180,
  logoUrl,
  type = 'upi',
  className = '',
  amount,
  payeeName,
  transactionNote
}) => {
  const [qrValue, setQrValue] = React.useState('');

  useEffect(() => {
    console.log("QRCode component received values:", { value, amount, payeeName, transactionNote });
    
    if (type === 'upi' && value) {
      // Create proper UPI URL format for payments
      let upiUrl = `upi://pay?pa=${encodeURIComponent(value)}`;
      
      if (payeeName && payeeName.trim()) {
        upiUrl += `&pn=${encodeURIComponent(payeeName.trim())}`;
      }
      
      if (amount && amount > 0) {
        // Format amount to 2 decimal places
        upiUrl += `&am=${parseFloat(amount.toString()).toFixed(2)}`;
      }
      
      if (transactionNote && transactionNote.trim()) {
        upiUrl += `&tn=${encodeURIComponent(transactionNote.trim())}`;
      }
      
      // Add currency (INR is default for UPI)
      upiUrl += '&cu=INR';
      
      // Add transaction reference for tracking
      const txnRef = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      upiUrl += `&tr=${txnRef}`;
      
      console.log("Generated UPI URL:", upiUrl);
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
      const svg = document.querySelector('#qr-code-svg') as SVGElement;
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
        downloadLink.download = 'upi-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
        
        toast.success('QR code downloaded successfully');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };
  
  const handleOpenUPI = () => {
    if (!qrValue) {
      toast.error('No payment details available');
      return;
    }

    console.log("Opening UPI with URL:", qrValue);
    
    try {
      // For mobile browsers, use window.open with _self to trigger app
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // First try direct assignment
        window.location.href = qrValue;
        
        // Show success message immediately
        toast.success('Opening payment app...');
        
        // Fallback message after delay
        setTimeout(() => {
          if (document.hasFocus()) {
            toast.info('If the app didn\'t open, try scanning the QR code directly with your payment app.');
          }
        }, 2000);
      } else {
        // On desktop, copy the URL and inform user
        navigator.clipboard.writeText(qrValue);
        toast.info('Payment link copied! Open on your mobile device or scan the QR code with your UPI app.');
      }
    } catch (error) {
      console.error('Error opening UPI app:', error);
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrValue);
      toast.error('Could not open payment app. Link copied to clipboard - paste in your UPI app or scan the QR code.');
    }
  };
  
  return (
    <Card className={`border-0 shadow-none ${className}`}>
      <CardContent className="p-0 flex flex-col items-center">
        <div 
          className="relative rounded-2xl bg-white border-2 border-gray-100 overflow-hidden mb-3 p-4"
          style={{ width: size + 32, height: size + 32 }}
        >
          {qrValue ? (
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue}
              size={size}
              level="H"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Smartphone className="h-8 w-8 mb-2" />
              <span className="text-xs">No payment data</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            className="text-xs h-8"
            disabled={!qrValue}
          >
            <Copy size={14} className="mr-1" /> Copy
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            className="text-xs h-8"
            disabled={!qrValue}
          >
            <Download size={14} className="mr-1" /> Save
          </Button>
          
          {type === 'upi' && qrValue && (
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
      </CardContent>
    </Card>
  );
};

export default QRCode;
