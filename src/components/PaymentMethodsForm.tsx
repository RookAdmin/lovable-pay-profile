
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
import { UpiDetails } from '@/types/payment';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { globalBanks, formatBankDisplay, searchBanks } from '@/data/globalBanks';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const upiSchema = z.object({
  upiId: z.string().optional().or(z.literal(''))
});

const bankSchema = z.object({
  accountNumber: z.string().min(5, 'Account number must be at least 5 characters'),
  ifsc: z.string().min(5, 'IFSC/SWIFT code must be at least 5 characters'),
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters').max(30, 'Bank name must be less than 30 characters'),
  swiftCode: z.string().min(8, 'SWIFT code must be at least 8 characters').max(11, 'SWIFT code must be 8-11 characters')
});

type UpiFormData = z.infer<typeof upiSchema>;
type BankFormData = z.infer<typeof bankSchema>;

interface BankMethodDetails extends BankFormData {
  swiftCode?: string;
}

interface PaymentMethodsFormProps {
  upiMethod?: { id: string; details: UpiDetails; qr_code_url?: string };
  bankMethod?: { id: string; details: BankMethodDetails };
  onUpdate?: () => void;
}

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({ 
  upiMethod, 
  bankMethod,
  onUpdate
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bankSearchOpen, setBankSearchOpen] = React.useState(false);

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
      bankName: bankMethod?.details?.bankName || '',
      swiftCode: bankMethod?.details?.swiftCode || ''
    }
  });

  const handleUpiSubmit = async (data: UpiFormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to save payment methods');
        return;
      }

      // If UPI ID is empty or undefined, delete the payment method
      if (!data.upiId || data.upiId.trim() === '') {
        if (upiMethod?.id) {
          const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', upiMethod.id);

          if (error) throw error;
          toast.success('UPI details removed');
        }
        
        await queryClient.invalidateQueries({ queryKey: ['payment_methods', user.id] });
        
        if (onUpdate) {
          onUpdate();
        }
        return;
      }

      const payload = {
        profile_id: user.id,
        type: 'upi',
        details: { 
          upiId: data.upiId
        },
        is_active: true,
        is_primary: true
      };

      if (upiMethod?.id) {
        const { error } = await supabase
          .from('payment_methods')
          .update(payload)
          .eq('id', upiMethod.id);

        if (error) throw error;
        toast.success('UPI details updated');
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert(payload);

        if (error) throw error;
        toast.success('UPI details saved');
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


  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3 space-y-1">
        <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Configure how you receive payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
            <TabsTrigger value="upi" className="text-sm">UPI</TabsTrigger>
            <TabsTrigger value="bank" className="text-sm">Bank Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi" className="space-y-3 mt-0">
            <Form {...upiForm}>
              <form onSubmit={upiForm.handleSubmit(handleUpiSubmit)} className="space-y-3">
                <FormField
                  control={upiForm.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">UPI ID (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="yourname@upi" 
                          {...field}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Leave empty to remove UPI from your profile</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-9 text-sm">
                  {upiMethod?.id ? 'Update' : 'Save'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-3 mt-0">
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-3">
                <FormField
                  control={bankForm.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Bank Name</FormLabel>
                      <Popover open={bankSearchOpen} onOpenChange={setBankSearchOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={bankSearchOpen}
                              className={cn(
                                "w-full justify-between h-9 font-normal text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">{field.value || "Search or enter custom bank..."}</span>
                              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Type to search or enter custom bank..." className="h-9 text-sm" />
                            <CommandList>
                              <CommandEmpty className="py-3">
                                <div className="text-center space-y-2">
                                  <p className="text-sm text-muted-foreground">No bank found.</p>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                                      if (input?.value) {
                                        field.onChange(input.value);
                                        setBankSearchOpen(false);
                                      }
                                    }}
                                    className="text-xs"
                                  >
                                    Use custom bank name
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup className="max-h-72 overflow-auto">
                                {globalBanks.map((bank) => (
                                  <CommandItem
                                    key={`${bank.name}-${bank.country}`}
                                    value={formatBankDisplay(bank)}
                                    onSelect={() => {
                                      field.onChange(formatBankDisplay(bank));
                                      setBankSearchOpen(false);
                                    }}
                                    className="text-sm"
                                  >
                                    <span className="flex-1">{formatBankDisplay(bank)}</span>
                                    <Check
                                      className={cn(
                                        "ml-2 h-4 w-4",
                                        field.value === formatBankDisplay(bank)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">Select from list or enter custom bank (max 30 chars)</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Account Holder Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name as per bank records" 
                          {...field}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Account number" 
                          {...field}
                          className="h-9 text-sm"
                        />
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
                      <FormLabel className="text-sm font-medium">IFSC / Routing Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="IFSC, Routing, or Sort Code" 
                          {...field}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={bankForm.control}
                  name="swiftCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">SWIFT/BIC Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SWIFT or BIC code (8-11 characters)" 
                          {...field}
                          className="h-9 text-sm uppercase"
                          maxLength={11}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Required for international transfers</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full h-9 text-sm">
                  {bankMethod?.id ? 'Update' : 'Save'}
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
