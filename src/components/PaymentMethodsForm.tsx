
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
  upiMethod?: { id: string; details: UpiDetails; qr_code_url?: string };
  bankMethod?: { id: string; details: BankFormData };
  onUpdate?: () => void;
}

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({ 
  upiMethod, 
  bankMethod,
  onUpdate
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>(
    upiMethod?.details?.qrCodeUrl || 
    upiMethod?.qr_code_url || 
    ""
  );

  console.log("Initial QR Code URL:", qrCodeUrl);
  console.log("UPI method:", upiMethod);
  console.log("UPI method ID:", upiMethod?.id);

  const upiForm = useForm<UpiFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: upiMethod?.details.upiId || ''
    }
  });

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

      console.log("Saving UPI with QR code URL:", qrCodeUrl);

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

      console.log("Full payload for UPI save:", payload);
      console.log("UPI method ID for update:", upiMethod?.id);

      if (upiMethod?.id && upiMethod.id.length > 5) {
        const { data: updateData, error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', upiMethod.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("UPI update result:", updateData);
        toast.success('UPI details updated successfully');
      } else {
        const { data: insertData, error } = await supabase
          .from('payment_methods')
          .insert(payload)
          .select();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        console.log("UPI insert result:", insertData);
        toast.success('UPI details saved successfully');
      }
      
      await queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
      
      if (onUpdate) {
        onUpdate();
      }
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
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details');
    }
  };

  const saveQrToSupabase = async (qrUrl: string) => {
    if (!user) return false;
    let result;
    
    console.log("Saving QR to Supabase:", qrUrl);
    console.log("UPI method ID for QR save:", upiMethod?.id);
    
    try {
      if (upiMethod?.id && upiMethod.id.length > 5) {
        result = await supabase
          .from('payment_methods')
          .update({
            details: { 
              ...(upiMethod.details || {}),
              qrCodeUrl: qrUrl 
            },
            qr_code_url: qrUrl
          })
          .eq('id', upiMethod.id)
          .select();

        console.log("QR update result:", result);
      } else {
        const upiId = upiForm.getValues().upiId;
        if (upiId) {
          result = await supabase
            .from('payment_methods')
            .insert({
              profile_id: user.id,
              type: 'upi',
              details: { 
                upiId: upiId,
                qrCodeUrl: qrUrl 
              },
              qr_code_url: qrUrl,
              is_active: true,
              is_primary: true
            })
            .select();

          console.log("QR insert result:", result);
        } else {
          toast.error("Please enter a UPI ID before saving QR code");
          return false;
        }
      }

      if (result?.error) {
        console.error("Failed to save QR public URL:", result.error);
        toast.error("Failed to save QR code image.");
        return false;
      } else {
        toast.success("QR code saved!");
        await queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
        
        if (onUpdate) {
          onUpdate();
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error saving QR to Supabase:", error);
      toast.error("Failed to save QR code image.");
      return false;
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
          </TabsList>
          
          <TabsContent value="upi">
            <div className="mb-3">
              <QRUploader
                initialUrl={qrCodeUrl}
                onUpload={(url) => {
                  console.log("QR code uploaded:", url);
                  setQrCodeUrl(url);
                }}
                onDelete={() => {
                  setQrCodeUrl("");
                  if (user && upiMethod?.id) {
                    supabase
                      .from('payment_methods')
                      .update({
                        details: { 
                          ...(upiMethod.details || {}),
                          qrCodeUrl: ""
                        },
                        qr_code_url: null
                      })
                      .eq('id', upiMethod.id)
                      .then(({ error }) => {
                        if (error) {
                          toast.error("Failed to remove QR code");
                        } else {
                          queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
                          if (onUpdate) {
                            onUpdate();
                          }
                          toast.success("QR code removed");
                        }
                      });
                  }
                }}
                onSave={(url) => {
                  return saveQrToSupabase(url);
                }}
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsForm;
