
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from './QRCode';
import CopyField from './CopyField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Banknote, QrCode, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentMethodsForm from './PaymentMethodsForm';

interface BankDetails {
  accountNumber: string;
  ifsc: string;
  accountName: string;
  bankName: string;
}

interface PaymentSectionProps {
  upiId?: string;
  bankDetails?: BankDetails;
  className?: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  upiId = '',
  bankDetails,
  className = ''
}) => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className={`shadow-md border-gray-100 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Payment Methods</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Hide Form' : (
              <>
                <PlusCircle size={16} className="mr-2" />
                {(!upiId && !bankDetails) ? 'Add Payment Method' : 'Edit Payment Methods'}
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <PaymentMethodsForm 
              upiMethod={upiId ? { id: 'upi', details: { upiId } } : undefined}
              bankMethod={bankDetails ? { id: 'bank', details: bankDetails } : undefined}
            />
          ) : (
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="upi" className="flex items-center gap-2">
                  <QrCode size={16} />
                  <span>UPI</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-2">
                  <Banknote size={16} />
                  <span>Bank</span>
                </TabsTrigger>
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Cards</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upi" className="space-y-4">
                {upiId ? (
                  <div className="flex flex-col items-center">
                    <QRCode 
                      value={upiId} 
                      type="upi" 
                      className="mb-4"
                    />
                    <CopyField label="UPI ID" value={upiId} className="w-full" />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No UPI ID available. Add a UPI payment method to display here.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bank" className="space-y-4">
                {bankDetails ? (
                  <>
                    <CopyField 
                      label="Account Number" 
                      value={bankDetails.accountNumber} 
                    />
                    <CopyField 
                      label="IFSC Code" 
                      value={bankDetails.ifsc} 
                    />
                    <CopyField 
                      label="Account Holder" 
                      value={bankDetails.accountName} 
                    />
                    <CopyField 
                      label="Bank Name" 
                      value={bankDetails.bankName} 
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No bank details available. Add a bank account to display here.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cards" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  Credit card payment methods coming soon!
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
