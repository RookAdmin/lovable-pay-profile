
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from './QRCode';
import CopyField from './CopyField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Banknote, QrCode } from 'lucide-react';

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
  return (
    <Card className={`shadow-md border-gray-100 ${className}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
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
            {upiId && (
              <div className="flex flex-col items-center">
                <QRCode 
                  value={upiId} 
                  type="upi" 
                  className="mb-4"
                />
                <CopyField label="UPI ID" value={upiId} className="w-full" />
              </div>
            )}
            {!upiId && (
              <div className="text-center py-8 text-muted-foreground">
                No UPI ID available
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
                No bank details available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              No card payment methods set up
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
