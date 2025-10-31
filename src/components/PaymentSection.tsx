
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from './QRCode';
import CopyField from './CopyField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, QrCode, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentMethodsForm from './PaymentMethodsForm';
import { BankDetails, CardDetails, UpiDetails } from '@/types/payment';
import DynamicQRCode from './DynamicQRCode';
import { toast } from 'sonner';

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
  isViewingMode?: boolean;
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
  isViewingMode = false
}) => {
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    console.log("PaymentSection received qrCodeUrl:", qrCodeUrl);
    console.log("PaymentSection upiId:", upiId);
    console.log("PaymentSection received bank details:", bankDetails);
    console.log("PaymentSection isViewingMode:", isViewingMode);
  }, [qrCodeUrl, upiId, bankDetails, isViewingMode]);
  
  const handleFormToggle = () => {
    setShowForm(!showForm);
    if (showForm && onPaymentMethodUpdate) {
      onPaymentMethodUpdate();
    }
  };
  
  const handleConfigureClick = (service: string) => {
    toast.info(`${service} configuration will be available soon!`);
  };
  
  // Check if we're in the profile view mode (public profile view)
  const isInViewMode = isViewingMode || !onPaymentMethodUpdate;
  
  // Check if any payment method exists
  const hasPaymentMethods = upiId || bankDetails;
  
  // If in viewing mode and no payment methods, don't render anything
  if (isInViewMode && !hasPaymentMethods) {
    return null;
  }
  
  // Determine the default tab based on available payment methods
  const getDefaultTab = () => {
    if (upiId) return "upi";
    if (bankDetails) return "bank";
    return "upi"; // Default to UPI tab
  };
  
  return (
    <div className="space-y-6">
      <Card className={`border-border/40 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
          {!isInViewMode && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFormToggle}
              className="h-8 text-xs"
            >
              {showForm ? 'Cancel' : (
                <>
                  <PlusCircle size={14} className="mr-1.5" />
                  {(!upiId && !bankDetails) ? 'Add' : 'Edit'}
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {(showForm && !isInViewMode) ? (
            <PaymentMethodsForm 
              upiMethod={upiId ? { 
                id: upiMethodId || '', 
                details: { upiId, qrCodeUrl: qrCodeUrl },
                qr_code_url: qrCodeUrl 
              } : undefined}
              bankMethod={bankDetails && bankMethodId ? { id: bankMethodId, details: bankDetails } : undefined}
              onUpdate={onPaymentMethodUpdate}
            />
          ) : (
            <Tabs defaultValue={getDefaultTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3 h-9">
                <TabsTrigger value="upi" className="flex items-center gap-1.5 text-sm" disabled={!upiId && isInViewMode}>
                  <QrCode size={14} />
                  <span>UPI</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-1.5 text-sm" disabled={!bankDetails && isInViewMode}>
                  <Banknote size={14} />
                  <span>Bank</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upi" className="space-y-3">
                {upiId ? (
                  <div className="flex flex-col items-center space-y-3">
                    <DynamicQRCode 
                      value={upiId} 
                      type="upi" 
                      className="mb-2"
                    />
                    <CopyField label="UPI ID" value={upiId} className="w-full" />
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No UPI ID configured
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bank" className="space-y-3">
                {bankDetails ? (
                  <div className="space-y-2.5">
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
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No bank details configured
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Remove transaction payment integration cards from public view */}
      {!isInViewMode && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-[#333333]">Transaction Payment Integration</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-8 h-8 mr-2" />
                    <h4 className="text-[#333333] font-medium">Razorpay</h4>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureClick('Razorpay')}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-[#555555] mb-4">
                  Connect your Razorpay account to accept direct payments from your profile page.
                </p>
                <div className="text-xs text-[#666666]">
                  Status: <span className="text-yellow-600 font-medium">Not Configured</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="https://stripe.com/favicon.ico" alt="Stripe" className="w-8 h-8 mr-2" />
                    <h4 className="text-[#333333] font-medium">Stripe</h4>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureClick('Stripe')}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-[#555555] mb-4">
                  Connect your Stripe account to accept international payments from your profile.
                </p>
                <div className="text-xs text-[#666666]">
                  Status: <span className="text-yellow-600 font-medium">Not Configured</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
