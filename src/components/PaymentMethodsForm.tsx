
import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import QRUploader from "./QRUploader";
import { UpiDetails } from '@/types/payment';

// Define validation schemas
const upiSchema = z.object({
  upiId: z.string().min(5, 'UPI ID must be at least 5 characters')
});

const bankSchema = z.object({
  accountNumber: z.string().min(5, 'Account number must be at least 5 characters'),
  ifsc: z.string().min(5, 'IFSC code must be at least 5 characters'),
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters')
});

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits').max(19),
  nameOnCard: z.string().min(2, 'Name on card must be at least 2 characters'),
  expiryMonth: z.string().min(1).max(2).regex(/^(0?[1-9]|1[0-2])$/, 'Invalid month'),
  expiryYear: z.string().min(2).regex(/^\d{2}$/, 'Must be 2 digits')
});

type UpiFormData = z.infer<typeof upiSchema>;
type BankFormData = z.infer<typeof bankSchema>;
type CardFormData = z.infer<typeof cardSchema>;

interface PaymentMethodsFormProps {
  upiMethod?: { id: string; details: UpiDetails };
  bankMethod?: { id: string; details: BankFormData };
  cardMethod?: { id: string; details: CardFormData };
}

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({ 
  upiMethod, 
  bankMethod,
  cardMethod
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // UPI QR management
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>(upiMethod?.details?.qrCodeUrl || "");

  // Initialize UPI form
  const upiForm = useForm<UpiFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: upiMethod?.details.upiId || ''
    }
  });

  // Initialize Bank form
  const bankForm = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountNumber: bankMethod?.details?.accountNumber || '',
      ifsc: bankMethod?.details?.ifsc || '',
      accountName: bankMethod?.details?.accountName || '',
      bankName: bankMethod?.details?.bankName || ''
    }
  });

  // Initialize Card form
  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: cardMethod?.details?.cardNumber || '',
      nameOnCard: cardMethod?.details?.nameOnCard || '',
      expiryMonth: cardMethod?.details?.expiryMonth || '',
      expiryYear: cardMethod?.details?.expiryYear || ''
    }
  });

  const handleUpiSubmit = async (data: UpiFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save payment methods');
        return;
      }

      const payload = {
        profile_id: user.id,
        type: 'upi',
        details: { 
          upiId: data.upiId,
          qrCodeUrl: qrCodeUrl 
        },
        qr_code_url: qrCodeUrl || null,
        is_active: true,
        is_primary: true
      };

      console.log("Saving UPI with payload:", payload);

      if (upiMethod?.id) {
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', upiMethod.id);

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        toast.success('UPI details updated successfully');
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        toast.success('UPI details saved successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
    } catch (error) {
      console.error('Error saving UPI details:', error);
      toast.error('Failed to save UPI details');
    }
  };

  const handleBankSubmit = async (data: BankFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save payment methods');
        return;
      }

      const payload = {
        profile_id: user.id,
        type: 'bank',
        details: data,
        is_active: true,
        is_primary: false
      };

      if (bankMethod?.id) {
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', bankMethod.id);

        if (error) throw error;
        toast.success('Bank details updated successfully');
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) throw error;
        toast.success('Bank details saved successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details');
    }
  };

  const handleCardSubmit = async (data: CardFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save payment methods');
        return;
      }

      // Mask card number for security
      const maskedCardNumber = data.cardNumber.replace(/^\d{12}/, '************');
      const maskedData = {
        ...data,
        cardNumber: maskedCardNumber
      };

      const payload = {
        profile_id: user.id,
        type: 'card',
        details: maskedData,
        is_active: true,
        is_primary: false
      };

      if (cardMethod?.id) {
        // Update existing
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', cardMethod.id);

        if (error) throw error;
        toast.success('Card details updated successfully');
      } else {
        // Insert new
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) throw error;
        toast.success('Card details saved successfully');
      }

      // Refresh payment methods data
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
      cardForm.reset(); // Clear form for security
    } catch (error) {
      console.error('Error saving card details:', error);
      toast.error('Failed to save card details');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Methods</CardTitle>
        <CardDescription>
          Set up how people can pay you. Upload your QR for UPI if available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upi">
          <TabsList className="mb-4">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi">
            <div className="mb-3">
              <QRUploader
                initialUrl={qrCodeUrl}
                onUpload={url => setQrCodeUrl(url)}
                onDelete={() => setQrCodeUrl("")}
              />
              <div className="text-xs text-muted-foreground text-center mt-1">
                Upload your own UPI QR (for Google Pay, PhonePe, Paytm, etc).
              </div>
            </div>
            <Form {...upiForm}>
              <form onSubmit={upiForm.handleSubmit(handleUpiSubmit)} className="space-y-4">
                <FormField
                  control={upiForm.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@upi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {upiMethod?.id ? 'Update UPI Details' : 'Save UPI Details'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="bank">
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-4">
                <FormField
                  control={bankForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="ifsc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IFSC code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account holder name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  {bankMethod?.id ? 'Update Bank Details' : 'Save Bank Details'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="card">
            <Form {...cardForm}>
              <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-4">
                <FormField
                  control={cardForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          maxLength={19}
                          onChange={(e) => {
                            // Format card number with spaces for readability
                            const value = e.target.value.replace(/\s/g, '');
                            const formattedValue = value
                              .replace(/\D/g, '')
                              .replace(/(.{4})/g, '$1 ')
                              .trim();
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={cardForm.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name as on card" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cardForm.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Month</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM" 
                            {...field}
                            maxLength={2}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={cardForm.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Year</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="YY" 
                            {...field} 
                            maxLength={2}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {cardMethod?.id ? 'Update Card Details' : 'Save Card Details'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsForm;
