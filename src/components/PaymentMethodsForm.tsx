
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

type UpiFormData = z.infer<typeof upiSchema>;
type BankFormData = z.infer<typeof bankSchema>;

interface PaymentMethodsFormProps {
  upiMethod?: { id: string; details: UpiFormData };
  bankMethod?: { id: string; details: BankFormData };
}

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({ 
  upiMethod, 
  bankMethod 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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

  const handleUpiSubmit = async (data: UpiFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save payment methods');
        return;
      }

      const payload = {
        profile_id: user.id,
        type: 'upi',
        details: data,
        is_active: true,
        is_primary: true
      };

      if (upiMethod?.id) {
        // Update existing
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', upiMethod.id);

        if (error) throw error;
        toast.success('UPI details updated successfully');
      } else {
        // Insert new
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) throw error;
        toast.success('UPI details saved successfully');
      }

      // Refresh payment methods data
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
        // Update existing
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', bankMethod.id);

        if (error) throw error;
        toast.success('Bank details updated successfully');
      } else {
        // Insert new
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) throw error;
        toast.success('Bank details saved successfully');
      }

      // Refresh payment methods data
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Methods</CardTitle>
        <CardDescription>
          Set up how people can pay you. Your details will be shown on your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upi">
          <TabsList className="mb-4">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi">
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsForm;
