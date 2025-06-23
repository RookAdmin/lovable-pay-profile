
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coffee, Heart, Zap, CreditCard, PlusCircle, Edit, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SmartLink } from "@/types/profile";
import SmartLinksForm from "./SmartLinksForm";
import SmartLinkPaymentGateway from "./SmartLinkPaymentGateway";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface SmartLinkSectionProps {
  links: SmartLink[];
  className?: string;
  isViewingMode?: boolean;
  profileOwnerUpiId?: string; // Add UPI ID prop
  profileOwnerDisplayName?: string; // Add display name for payment
}

const SmartLinkSection = ({ 
  links = [], 
  className, 
  isViewingMode = false,
  profileOwnerUpiId,
  profileOwnerDisplayName
}: SmartLinkSectionProps) => {
  // Check if user has a payment gateway integrated
  const [hasPaymentGateway, setHasPaymentGateway] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SmartLink | null>(null);

  // Check for payment gateway integration
  const { data: paymentGateways } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      // For now, we'll simulate this check - in a real app, 
      // this would query for actual payment gateway integrations
      return { hasIntegration: false };
    },
  });

  useEffect(() => {
    // Update state when data changes
    if (paymentGateways) {
      setHasPaymentGateway(paymentGateways.hasIntegration);
    }
  }, [paymentGateways]);

  const handleEdit = (link: SmartLink) => {
    setEditingLink(link);
    setOpenModal(true);
  };

  const handleDelete = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('smart_links')
        .delete()
        .eq('id', linkId);

      if (error) {
        throw error;
      }

      toast.success("Link deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete link: " + error.message);
    }
  };

  const copyLinkToClipboard = (linkId: string) => {
    const link = `${window.location.origin}/link/${linkId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handlePayment = (link: SmartLink) => {
    // Check if we have the profile owner's UPI ID
    if (!profileOwnerUpiId) {
      toast.error('Payment method not available for this profile');
      return;
    }

    console.log("Processing payment for smart link:", {
      linkTitle: link.title,
      amount: link.amount,
      currency: link.currency,
      upiId: profileOwnerUpiId,
      payeeName: profileOwnerDisplayName
    });

    // Create UPI payment URL with actual user's UPI ID
    let upiUrl = `upi://pay?pa=${encodeURIComponent(profileOwnerUpiId)}`;
    
    // Add payee name if available
    if (profileOwnerDisplayName) {
      upiUrl += `&pn=${encodeURIComponent(profileOwnerDisplayName)}`;
    }
    
    // Add amount
    upiUrl += `&am=${link.amount}`;
    
    // Add currency
    upiUrl += `&cu=INR`;
    
    // Add transaction note with smart link title
    const transactionNote = `Payment for ${link.title}`;
    upiUrl += `&tn=${encodeURIComponent(transactionNote)}`;
    
    // Add transaction reference
    const txnRef = `SL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    upiUrl += `&tr=${txnRef}`;

    console.log("Generated UPI payment URL:", upiUrl);
    
    try {
      // Check if on mobile device
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // On mobile, try to open UPI app directly
        window.location.href = upiUrl;
        toast.success(`Opening payment app for ${link.currency}${link.amount}...`);
        
        // Fallback guidance after delay
        setTimeout(() => {
          if (document.hasFocus()) {
            toast.info('If the app didn\'t open, try using a different UPI app.');
          }
        }, 3000);
      } else {
        // Desktop: copy payment details and inform user
        navigator.clipboard.writeText(upiUrl);
        toast.info(`Payment details copied! Amount: ${link.currency}${link.amount}. Use on mobile device with UPI app.`);
      }
    } catch (error) {
      console.error('Error opening payment app:', error);
      // Fallback: copy payment details
      navigator.clipboard.writeText(`Pay ${link.currency}${link.amount} for ${link.title} to UPI ID: ${profileOwnerUpiId}`);
      toast.error('Could not open payment app. Payment details copied to clipboard.');
    }
  };

  const getIconComponent = (icon: SmartLink['icon']) => {
    switch (icon) {
      case 'heart':
        return <Heart className="w-full h-full" />;
      case 'coffee':
        return <Coffee className="w-full h-full" />;
      case 'zap':
        return <Zap className="w-full h-full" />;
      case 'card':
        return <CreditCard className="w-full h-full" />;
      default:
        return <Heart className="w-full h-full" />;
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Payment Gateway Integration Notice - Only show in edit mode */}
      {!isViewingMode && !hasPaymentGateway && <SmartLinkPaymentGateway />}
      
      {/* Smart Links Section */}
      <Card className="shadow-md border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {isViewingMode ? 'Support Options' : 'Smart Links'}
          </CardTitle>
          {/* Only show Add button in edit mode */}
          {!isViewingMode && (
            <Button 
              onClick={() => {
                setEditingLink(null);
                setOpenModal(true);
              }}
              size="sm"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Smart Link
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isViewingMode ? 'No support options available.' : 'No smart links yet. Create your first link!'}
              </p>
            </div>
          ) : (
            <div className="my-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {links.map((link) => (
                    <CarouselItem key={link.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="rounded-xl overflow-hidden aspect-square shadow-lg bg-white border border-gray-200">
                          {/* Clean Card Display */}
                          <div className="flex flex-col h-full">
                            {/* Header with title and amount */}
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-lg text-gray-900">
                                  {link.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {link.currency} {link.amount}
                                </p>
                              </div>
                              {/* Only show Active badge in edit mode */}
                              {!isViewingMode && (
                                <Badge variant={link.isActive ? "secondary" : "outline"}>
                                  {link.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Center Content - Image or Icon */}
                            <div className="flex-1 flex items-center justify-center p-4">
                              {link.imageUrl ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-inner">
                                  <img 
                                    src={link.imageUrl} 
                                    alt={link.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                                  {getIconComponent(link.icon)}
                                </div>
                              )}
                            </div>
                            
                            {/* Footer with actions */}
                            <div className="p-3 flex justify-between items-center mt-auto">
                              {isViewingMode ? (
                                // View mode: Show Pay button
                                <div className="w-full flex justify-center">
                                  <Button
                                    onClick={() => handlePayment(link)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    disabled={!profileOwnerUpiId}
                                  >
                                    {profileOwnerUpiId ? `Pay ${link.currency}${link.amount}` : 'Payment Unavailable'}
                                  </Button>
                                </div>
                              ) : (
                                // Edit mode: Show management buttons
                                <>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => copyLinkToClipboard(link.id)}
                                    >
                                      <Copy size={18} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEdit(link)}
                                    >
                                      <Edit size={18} />
                                    </Button>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(link.id)}
                                  >
                                    <Trash2 size={18} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center mt-4">
                  <CarouselPrevious className="static transform-none mx-2" />
                  <CarouselNext className="static transform-none mx-2" />
                </div>
              </Carousel>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* SmartLink Form Dialog - Only show in edit mode */}
      {!isViewingMode && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl mb-4">
                {editingLink ? "Edit Smart Link" : "Create New Smart Link"}
              </DialogTitle>
            </DialogHeader>
            <SmartLinksForm 
              initialData={editingLink} 
              onSubmitSuccess={() => {
                setOpenModal(false);
                toast.success(editingLink ? "Link updated" : "Link created");
              }}
              onCancel={() => setOpenModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SmartLinkSection;
