
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

const SmartLinkSection = ({ links = [], className }: { links: SmartLink[], className?: string }) => {
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

  // Create a grouping of links (2 per slide for mobile, more for desktop)
  const groupLinks = (links: SmartLink[], itemsPerSlide: number = 1) => {
    return links.reduce((resultArray: SmartLink[][], item, index) => {
      const chunkIndex = Math.floor(index / itemsPerSlide);
      
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Payment Gateway Integration Notice */}
      {!hasPaymentGateway && <SmartLinkPaymentGateway />}
      
      {/* Smart Links Section */}
      <Card className="shadow-md border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Smart Links</CardTitle>
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
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No smart links yet. Create your first link!</p>
            </div>
          ) : (
            <div className="my-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {links.map((link) => (
                    <CarouselItem key={link.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className={`rounded-xl overflow-hidden aspect-square shadow-lg ${
                          link.gradient 
                            ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' 
                            : 'bg-white border border-gray-200'
                        }`}>
                          {/* Instagram Story-like Display */}
                          <div className="flex flex-col h-full">
                            {/* Header with avatar and title */}
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <p className={`font-bold text-lg ${link.gradient ? 'text-white' : 'text-gray-900'}`}>
                                  {link.title}
                                </p>
                                <p className={`text-sm ${link.gradient ? 'text-white/80' : 'text-gray-500'}`}>
                                  {link.currency} {link.amount}
                                </p>
                              </div>
                              <Badge variant={link.isActive ? "secondary" : "outline"}>
                                {link.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            
                            {/* Center Content - Image or Icon */}
                            <div className="flex-1 flex items-center justify-center p-4">
                              {link.imageUrl ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-inner">
                                  <img 
                                    src={link.imageUrl} 
                                    alt={link.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className={`w-24 h-24 flex items-center justify-center rounded-full ${
                                  link.gradient 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {getIconComponent(link.icon)}
                                </div>
                              )}
                            </div>
                            
                            {/* Footer with actions */}
                            <div className="p-3 flex justify-between items-center mt-auto">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`${link.gradient ? 'text-white hover:bg-white/10' : ''}`}
                                  onClick={() => copyLinkToClipboard(link.id)}
                                >
                                  <Copy size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`${link.gradient ? 'text-white hover:bg-white/10' : ''}`}
                                  onClick={() => handleEdit(link)}
                                >
                                  <Edit size={18} />
                                </Button>
                              </div>
                              <Button
                                variant={link.gradient ? "ghost" : "destructive"}
                                size="icon"
                                className={link.gradient ? 'text-white hover:bg-white/10' : ''}
                                onClick={() => handleDelete(link.id)}
                              >
                                <Trash2 size={18} />
                              </Button>
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
      
      {/* SmartLink Form Dialog */}
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
    </div>
  );
};

export default SmartLinkSection;
