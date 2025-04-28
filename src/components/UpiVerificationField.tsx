
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { validateUpiId } from '@/utils/validation';
import { AlertCircle, QrCode } from 'lucide-react';

interface UpiVerificationFieldProps {
  upiId: string;
  onChange: (upiId: string) => void;
  onValidate: (isValid: boolean) => void;
  onGenerate?: () => void;
  className?: string;
}

const UpiVerificationField: React.FC<UpiVerificationFieldProps> = ({
  upiId,
  onChange,
  onValidate,
  onGenerate,
  className = ''
}) => {
  const [touched, setTouched] = useState(false);
  const isValid = validateUpiId(upiId);
  const showError = touched && !isValid;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (touched) {
      onValidate(validateUpiId(e.target.value));
    }
  };
  
  const handleBlur = () => {
    setTouched(true);
    onValidate(isValid);
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between">
        <Label htmlFor="upi-id" className="text-sm font-medium">
          UPI ID
        </Label>
        {touched && isValid && (
          <span className="text-xs text-green-600">✓ Valid UPI ID</span>
        )}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-grow">
          <Input
            id="upi-id"
            value={upiId}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="yourname@upi"
            className={showError ? "border-red-500" : ""}
          />
          {showError && (
            <div className="flex items-center mt-1 text-xs text-red-600">
              <AlertCircle size={12} className="mr-1" />
              Please enter a valid UPI ID (e.g., name@bank)
            </div>
          )}
        </div>
        
        {onGenerate && isValid && (
          <Button onClick={onGenerate} type="button" variant="outline">
            <QrCode size={16} className="mr-1" />
            Generate QR
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpiVerificationField;
