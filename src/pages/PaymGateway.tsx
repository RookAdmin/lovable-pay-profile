
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Calendar, AlertTriangle, Check } from "lucide-react";
import { Paym } from "@/types/payms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PaymGateway = () => {
  const { uniqueLink } = useParams<{ uniqueLink: string }>();
  const navigate = useNavigate();
  const [paym, setPaym] = useState<Paym | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPaym = async () => {
      try {
        // First, get the paym data
        const { data: paymData, error: paymError } = await supabase
          .from("payms")
          .select("*, profiles(*)")
          .eq("unique_link", uniqueLink)
          .single();

        if (paymError) throw paymError;

        // Transform paym data
        const paymObj: Paym = {
          id: paymData.id,
          profileId: paymData.profile_id,
          title: paymData.title,
          amount: Number(paymData.amount),
          currency: paymData.currency,
          uniqueLink: paymData.unique_link,
          expiresAt: paymData.expires_at ? new Date(paymData.expires_at) : undefined,
          createdAt: new Date(paymData.created_at),
          updatedAt: new Date(paymData.updated_at),
          isPaid: paymData.is_paid,
          invoiceApp: paymData.invoice_app,
          invoiceId: paymData.invoice_id,
          reminderEnabled: paymData.reminder_enabled,
          lastReminderSent: paymData.last_reminder_sent ? new Date(paymData.last_reminder_sent) : undefined,
          metadata: paymData.metadata
        };
        
        setPaym(paymObj);
        setProfile(paymData.profiles);
        
      } catch (error) {
        console.error("Error fetching paym:", error);
        toast.error("Error loading payment details");
      } finally {
        setIsLoading(false);
      }
    };

    if (uniqueLink) {
      fetchPaym();
    }
  }, [uniqueLink]);

  const isExpired = (paym: Paym) => {
    return paym.expiresAt && isAfter(new Date(), paym.expiresAt);
  };

  const handlePayment = async () => {
    if (!paym) return;
    setIsProcessing(true);
    
    // In a real implementation, you would integrate with a payment gateway here
    // For demo purposes, we'll just simulate a successful payment
    
    setTimeout(async () => {
      try {
        // Update paym status to paid
        const { error } = await supabase
          .from("payms")
          .update({ is_paid: true })
          .eq("id", paym.id);
          
        if (error) throw error;
        
        // Update local state
        setPaym({ ...paym, isPaid: true });
        toast.success("Payment successful!");
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dc2e3e"></div>
        </div>
      </div>
    );
  }

  if (!paym) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-lg">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Link Not Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              The payment link you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-lg">
      <Card className="shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile?.avatar_url}
                alt={profile?.display_name}
              />
              <AvatarFallback className="bg-gray-200">
                {profile?.display_name?.charAt(0) || "P"}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">{paym.title}</CardTitle>
          <CardDescription>
            Payment request from {profile?.display_name || "User"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {paym.isPaid ? (
              <Badge className="bg-green-500 px-3 py-1 text-base">Paid</Badge>
            ) : isExpired(paym) ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 px-3 py-1 text-base">Expired</Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1 text-base">Payment Pending</Badge>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount Due</p>
            <p className="text-4xl font-bold">{paym.currency}{paym.amount}</p>
          </div>
          
          {paym.expiresAt && (
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {isExpired(paym) ? (
                <span>This payment link expired on {format(paym.expiresAt, "MMM d, yyyy")}</span>
              ) : (
                <span>Valid until {format(paym.expiresAt, "MMM d, yyyy")}</span>
              )}
            </div>
          )}
          
          {paym.invoiceId && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Invoice: </span>
              <span className="font-medium">{paym.invoiceId}</span>
            </div>
          )}
          
          {paym.isPaid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-green-700">Payment Complete</h3>
              <p className="text-sm text-green-600">
                Thank you for your payment. A receipt has been sent to your email.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          {!paym.isPaid && (
            <>
              {isExpired(paym) ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center w-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-yellow-700">Payment Link Expired</h3>
                  <p className="text-sm text-yellow-600">
                    Please contact {profile?.display_name || "the sender"} for an updated payment link.
                  </p>
                </div>
              ) : (
                <Button 
                  className="w-full bg-dc2e3e hover:bg-dc2e3e/90 py-6 text-lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ${paym.currency}${paym.amount}`
                  )}
                </Button>
              )}
            </>
          )}
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Secured by paym.me</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymGateway;
