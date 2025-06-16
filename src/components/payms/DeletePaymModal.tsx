
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Paym } from "@/types/payms";
import { AlertTriangle } from "lucide-react";

interface DeletePaymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  paym: Paym;
}

const DeletePaymModal: React.FC<DeletePaymModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  paym,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("payms")
        .delete()
        .eq("id", paym.id);
        
      if (error) throw error;
      
      toast.success("Paym deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting Paym:", error);
      toast.error("Failed to delete Paym. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Paym
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold">{paym.title}</p>
            <p className="text-sm text-muted-foreground">
              {paym.currency}{paym.amount}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Link: /payms/{paym.uniqueLink}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              "Delete Paym"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePaymModal;
