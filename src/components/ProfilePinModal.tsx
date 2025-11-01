import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePinModalProps {
  open: boolean;
  onValidPin: (paymentMethods: any[]) => void;
  username: string;
}

export const ProfilePinModal: React.FC<ProfilePinModalProps> = ({ open, onValidPin, username }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 6) {
      setError('PIN must be exactly 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://yluhgcbluxsnzlyhyabr.supabase.co/functions/v1/validate-profile-pin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, pin }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('PIN verified successfully');
        onValidPin(data.paymentMethods);
        setPin('');
      } else {
        setError(data.error || 'Invalid PIN');
        toast.error(data.error || 'Invalid PIN');
      }
    } catch (err) {
      console.error('PIN validation error:', err);
      setError('Connection error. Please try again.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/95 border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle>Enter Profile PIN</DialogTitle>
          </div>
          <DialogDescription>
            This profile requires a PIN to view payment details. Enter the 6-character PIN to continue.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={pin}
              onChange={handlePinChange}
              placeholder="Enter 6-character PIN"
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono uppercase"
              autoFocus
              disabled={loading}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={pin.length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify PIN'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Protected by Profile PIN security
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};