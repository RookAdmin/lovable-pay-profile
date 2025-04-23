
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from './QRCode';
import CopyField from './CopyField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Banknote, QrCode, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentMethodsForm from './PaymentMethodsForm';
import { BankDetails, CardDetails, UpiDetails } from '@/types/payment';

interface PaymentSectionProps {
  upiId?: string;
  bankDetails?: BankDetails;
  cardDetails?: CardDetails;
  qrCodeUrl?: string;
  className?: string;
  onPaymentMethodUpdate?: () => void;
  upiMethodId?: string;
  bankMethodId?: string;
  cardMethodId?: string;
  isViewingMode?: boolean; // Added to force viewing mode
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  upiId = '',
  bankDetails,
  cardDetails,
  qrCodeUrl,
  className = '',
  onPaymentMethodUpdate,
  upiMethodId,
  bankMethodId,
  cardMethodId,
  isViewingMode = false // Default to false
}) => {
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    console.log("PaymentSection received qrCodeUrl:", qrCodeUrl);
    console.log("PaymentSection upiId:", upiId);
    console.log("PaymentSection received bank details:", bankDetails);
    console.log("PaymentSection received card details:", cardDetails);
    console.log("PaymentSection upiMethodId:", upiMethodId);
    console.log("PaymentSection isViewingMode:", isViewingMode);
  }, [qrCodeUrl, upiId, bankDetails, cardDetails, upiMethodId, isViewingMode]);
  
  const handleFormToggle = () => {
    setShowForm(!showForm);
    if (showForm && onPaymentMethodUpdate) {
      onPaymentMethodUpdate();
    }
  };
  
  // Check if we're in the profile view mode (no onPaymentMethodUpdate provided or isViewingMode is true)
  const isInViewMode = isViewingMode || !onPaymentMethodUpdate;
  
  // Determine the default tab based on available payment methods
  const getDefaultTab = () => {
    if (upiId) return "upi";
    if (bankDetails) return "bank";
    if (cardDetails) return "cards";
    return "upi"; // Default to UPI tab
  };
  
  return (
    <div className="space-y-6">
      <Card className={`shadow-md border-gray-100 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Payment Methods</CardTitle>
          {!isInViewMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFormToggle}
            >
              {showForm ? 'Hide Form' : (
                <>
                  <PlusCircle size={16} className="mr-2" />
                  {(!upiId && !bankDetails && !cardDetails) ? 'Add Payment Method' : 'Edit Payment Methods'}
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(showForm && !isInViewMode) ? (
            <PaymentMethodsForm 
              upiMethod={upiId ? { 
                id: upiMethodId || '', 
                details: { upiId, qrCodeUrl: qrCodeUrl },
                qr_code_url: qrCodeUrl 
              } : undefined}
              bankMethod={bankDetails && bankMethodId ? { id: bankMethodId, details: bankDetails } : undefined}
              cardMethod={cardDetails && cardMethodId ? { id: cardMethodId, details: cardDetails } : undefined}
              onUpdate={onPaymentMethodUpdate}
            />
          ) : (
            <Tabs defaultValue={getDefaultTab()} className="w-full">
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
                      logoUrl={qrCodeUrl}
                    />
                    <CopyField label="UPI ID" value={upiId} className="w-full" />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No UPI ID available.
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
                    No bank details available.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cards" className="space-y-4">
                {cardDetails ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white shadow-lg">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-lg font-bold">Payment Card</div>
                        <div className="text-sm">Secured</div>
                      </div>
                      <div className="mb-2 font-mono text-lg">
                        {cardDetails.cardNumber}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs opacity-80">CARD HOLDER</div>
                          <div>{cardDetails.nameOnCard.toUpperCase()}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">EXPIRES</div>
                          <div>{cardDetails.expiryMonth}/{cardDetails.expiryYear}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No card details available.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
