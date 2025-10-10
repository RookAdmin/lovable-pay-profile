import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { Paym } from "@/types/payms";
import { z } from "zod";

interface EditPaymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  paym: Paym;
}

const EditPaymModal: React.FC<EditPaymModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  paym,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: paym.title,
    amount: paym.amount,
    currency: paym.currency,
    expiresAt: paym.expiresAt,
    invoiceApp: paym.invoiceApp,
    invoiceId: paym.invoiceId,
    reminderEnabled: paym.reminderEnabled,
  });
  const [expirationEnabled, setExpirationEnabled] = useState(!!paym.expiresAt);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const currencyOptions = [
    { value: "₹", label: "₹ INR" },
    { value: "$", label: "$ USD" },
    { value: "€", label: "€ EUR" },
    { value: "£", label: "£ GBP" },
  ];

  const invoiceAppOptions = [
    { value: "zoho", label: "Zoho Books" },
    { value: "freshbooks", label: "FreshBooks" },
    { value: "xero", label: "Xero" },
    { value: "quickbooks", label: "QuickBooks" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const schema = z.object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(35, "Title must be 35 characters or less"),
      amount: z.number().min(1, "Amount must be greater than 0"),
      currency: z.string(),
    });

    try {
      schema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const updateData = {
        title: formData.title,
        amount: formData.amount,
        currency: formData.currency,
        expires_at: expirationEnabled
          ? formData.expiresAt?.toISOString()
          : null,
        invoice_app: formData.invoiceApp || null,
        invoice_id: formData.invoiceId || null,
        reminder_enabled: formData.reminderEnabled,
      };

      const { error } = await supabase
        .from("payms")
        .update(updateData)
        .eq("id", paym.id);

      if (error) throw error;

      toast.success("Paym updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating Paym:", error);
      toast.error("Failed to update Paym. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Paym</DialogTitle>
          <DialogDescription>
            Update your payment link details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">Title</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.title.length}/35
                </span>
              </div>
              <Input
                id="title"
                name="title"
                placeholder="Invoice for Website Design"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={35}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleSelectChange("currency", value)
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiration">Expiration Date</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="expiration-toggle"
                    checked={expirationEnabled}
                    onCheckedChange={setExpirationEnabled}
                  />
                  <Label
                    htmlFor="expiration-toggle"
                    className="text-sm text-muted-foreground"
                  >
                    Enable
                  </Label>
                </div>
              </div>

              {expirationEnabled && (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiresAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiresAt
                        ? format(formData.expiresAt, "PPP")
                        : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiresAt}
                      onSelect={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          expiresAt: date || undefined,
                        }));
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="invoiceApp">Invoice Application (Optional)</Label>
              <Select
                value={formData.invoiceApp || ""}
                onValueChange={(value) =>
                  handleSelectChange("invoiceApp", value)
                }
              >
                <SelectTrigger id="invoiceApp">
                  <SelectValue placeholder="Select invoice app" />
                </SelectTrigger>
                <SelectContent>
                  {invoiceAppOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="invoiceId">Invoice ID (Optional)</Label>
              <Input
                id="invoiceId"
                name="invoiceId"
                placeholder="INV-12345"
                value={formData.invoiceId || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminder">Payment Reminders</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminder-toggle"
                    checked={formData.reminderEnabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        reminderEnabled: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="reminder-toggle"
                    className="text-sm text-muted-foreground"
                  >
                    Enable
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-dc2e3e hover:bg-dc2e3e/90"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                "Update Paym"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymModal;
