
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyFieldProps {
  label: string;
  value: string;
  className?: string;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, className = '' }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied to clipboard!`);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center">
        <div className="bg-muted rounded-l-lg py-2 px-3 flex-grow">
          <p className="text-sm font-medium truncate">{value}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-l-none"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CopyField;
