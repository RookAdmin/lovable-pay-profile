
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { validateUpiId } from '@/utils/validation';
import { AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface UpiVerificationFieldProps {
  upiId: string;
  onChange: (upiId: string) => void;
  onValidate: (isValid: boolean) => void;
  onGenerate?: (upiData: { upiId: string; amount?: number; payeeName?: string; note?: string }) => void;
  className?: string;
  showAmountField?: boolean;
  showPayeeNameField?: boolean;
  showNoteField?: boolean;
}

const UpiVerificationField: React.FC<UpiVerificationFieldProps> = ({
  upiId,
  onChange,
  onValidate,
  onGenerate,
  className = '',
  showAmountField = false,
  showPayeeNameField = false,
  showNoteField = false
}) => {
  const [touched, setTouched] = useState(false);
  const [amount, setAmount] = useState<number | undefined>();
  const [payeeName, setPayeeName] = useState('');
  const [note, setNote] = useState('');
  
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
  
  const handleGenerateQR = () => {
    if (!isValid) {
      toast.error('Please enter a valid UPI ID first');
      return;
    }
    
    const upiData = {
      upiId,
      ...(amount && amount > 0 && { amount }),
      ...(payeeName.trim() && { payeeName: payeeName.trim() }),
      ...(note.trim() && { note: note.trim() })
    };
    
    console.log('Generating QR with data:', upiData);
    onGenerate?.(upiData);
    toast.success('QR code generated with payment details');
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="upi-id" className="text-sm font-medium">
            UPI ID
          </Label>
          {touched && isValid && (
            <span className="text-xs text-green-600 flex items-center">
              ✓ Valid UPI ID
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-grow">
            <Input
              id="upi-id"
              value={upiId}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="yourname@upi (e.g., john@paytm)"
              className={showError ? "border-red-500 focus:border-red-500" : ""}
            />
            {showError && (
              <div className="flex items-center mt-1 text-xs text-red-600">
                <AlertCircle size={12} className="mr-1" />
                Please enter a valid UPI ID (e.g., name@bank)
              </div>
            )}
          </div>
          
          {onGenerate && isValid && (
            <Button onClick={handleGenerateQR} type="button" variant="outline" size="sm">
              <QrCode size={16} className="mr-1" />
              Generate QR
            </Button>
          )}
        </div>
      </div>
      
      {/* Additional fields for payment QR generation */}
      {(showAmountField || showPayeeNameField || showNoteField) && isValid && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700">Payment Details (Optional)</h4>
          
          {showAmountField && (
            <div className="space-y-1">
              <Label htmlFor="payment-amount" className="text-xs text-gray-600">
                Amount (₹)
              </Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Enter amount"
                className="text-sm"
              />
            </div>
          )}
          
          {showPayeeNameField && (
            <div className="space-y-1">
              <Label htmlFor="payee-name" className="text-xs text-gray-600">
                Payee Name
              </Label>
              <Input
                id="payee-name"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Recipient name"
                className="text-sm"
              />
            </div>
          )}
          
          {showNoteField && (
            <div className="space-y-1">
              <Label htmlFor="payment-note" className="text-xs text-gray-600">
                Transaction Note
              </Label>
              <Input
                id="payment-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Payment description"
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpiVerificationField;
