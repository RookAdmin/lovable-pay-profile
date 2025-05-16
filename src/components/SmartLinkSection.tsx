
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

// Add this function at the beginning of your file, or use the existing one if present
const SmartLinkSection = ({ links = [] }: { links: SmartLink[] }) => {
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
        return Heart;
      case 'coffee':
        return Coffee;
      case 'zap':
        return Zap;
      case 'card':
        return CreditCard;
      default:
        return Heart;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Gateway Integration Notice */}
      {!hasPaymentGateway && <SmartLinkPaymentGateway />}
      
      {/* The rest of your SmartLinkSection component */}
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map(link => {
              const Icon = getIconComponent(link.icon);
              return (
                <Card key={link.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-gray-500" />
                          <h3 className="text-sm font-semibold">{link.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400">
                          {link.currency} {link.amount}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {link.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyLinkToClipboard(link.id)}
                      >
                        <Copy size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* SmartLink Form Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
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
