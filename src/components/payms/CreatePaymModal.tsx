import React, { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { PaymFormData } from "@/types/payms";
import { z } from "zod";
import { safelyConvertToUpiDetails } from "@/types/payment";

interface CreatePaymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreatePaymModal: React.FC<CreatePaymModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PaymFormData>({
    title: "",
    amount: 0,
    currency: "₹",
    expiresAt: addDays(new Date(), 7),
    invoiceApp: undefined,
    invoiceId: "",
    reminderEnabled: true,
    recipientEmail: "",
    recipientPhone: "",
  });
  const [expirationEnabled, setExpirationEnabled] = useState(true);
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
      title: z.string().min(1, "Title is required"),
      amount: z.number().min(1, "Amount must be greater than 0"),
      currency: z.string(),
      recipientEmail: z
        .string()
        .email("Valid email is required")
        .optional()
        .or(z.literal("")),
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

  const sendInvoiceEmail = async (paymData: any, paymentLink: string) => {
    try {
      // Validate email exists and is not empty
      if (!formData.recipientEmail || !formData.recipientEmail.trim()) {
        console.log("No recipient email provided, skipping email send");
        return false;
      }

      const recipientEmail = formData.recipientEmail.trim();
      console.log("Sending invoice email via EmailJS to:", recipientEmail);

      // Get user profile for sender name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user?.id)
        .single();

      const expiryText = formData.expiresAt
        ? `This payment request expires on ${new Date(
            formData.expiresAt
          ).toLocaleDateString()}.`
        : "";

      const templateParams = {
        to_email: recipientEmail,
        from_name: profile?.display_name || "Someone",
        paym_title: formData.title,
        amount: `${formData.currency}${formData.amount}`,
        payment_link: paymentLink,
        expiry_text: expiryText,
        sender_name: profile?.display_name || "Someone",
      };

      console.log("EmailJS template params:", templateParams);

      // Load EmailJS if not already loaded
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
          window.emailjs.init('NCttFpe_PZtgHbL88');
        };
        document.head.appendChild(script);
        
        // Wait for script to load
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      } else {
        window.emailjs.init('NCttFpe_PZtgHbL88');
      }

      const result = await window.emailjs.send(
        'service_9dxsewl',
        'template_p6wkvnr',
        templateParams
      );

      console.log('EmailJS response:', result);
      return true;
    } catch (error) {
      console.error("Error sending email via EmailJS:", error);
      toast.error(`Failed to send email notification: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) {
      toast.error("You must be logged in to create a Paym");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Creating Paym with data:", formData);

      const paymData = {
        profile_id: user.id,
        title: formData.title,
        amount: formData.amount,
        currency: formData.currency,
        expires_at: expirationEnabled
          ? formData.expiresAt?.toISOString()
          : null,
        invoice_app: formData.invoiceApp || null,
        invoice_id: formData.invoiceId || null,
        reminder_enabled: formData.reminderEnabled,
        unique_link: "",
      };

      const { data, error } = await supabase
        .from("payms")
        .insert(paymData)
        .select()
        .single();

      if (error) {
        console.error("Paym creation error:", error);
        throw error;
      }

      console.log("Paym created successfully:", data);

      const paymentLink = `${window.location.origin}/payms/${data.unique_link}`;
      console.log("Generated payment link:", paymentLink);

      let emailSent = false;
      if (formData.recipientEmail && formData.recipientEmail.trim()) {
        console.log(
          "Attempting to send email via EmailJS to:",
          formData.recipientEmail.trim()
        );
        emailSent = await sendInvoiceEmail(data, paymentLink);
      } else {
        console.log("No recipient email provided, skipping EmailJS send");
      }

      if (
        formData.reminderEnabled &&
        (formData.recipientEmail || formData.recipientPhone)
      ) {
        if (formData.recipientEmail && formData.recipientEmail.trim()) {
          await supabase.from("paym_reminders").insert({
            paym_id: data.id,
            recipient: formData.recipientEmail.trim(),
            channel: "email",
            status: "pending",
            scheduled_at: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }

        if (formData.recipientPhone && formData.recipientPhone.trim()) {
          await supabase.from("paym_reminders").insert({
            paym_id: data.id,
            recipient: formData.recipientPhone.trim(),
            channel: "whatsapp",
            status: "pending",
            scheduled_at: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }
      }

      const successMessage = emailSent
        ? "Paym created successfully and email sent via EmailJS to recipient"
        : formData.recipientEmail && formData.recipientEmail.trim()
        ? "Paym created successfully, but email sending failed"
        : "Paym created successfully";

      toast.success(successMessage);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating Paym:", error);
      toast.error("Failed to create Paym. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] p-4 md:p-6 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">
            Create New Paym
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Create a custom payment link for your invoice
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-6 py-2 md:py-4"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="grid gap-1 md:gap-2">
              <Label htmlFor="title" className="text-sm md:text-base">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Invoice for Website Design"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="grid gap-1 md:gap-2">
                <Label htmlFor="amount" className="text-sm md:text-base">
                  Amount
                </Label>
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

              <div className="grid gap-1 md:gap-2">
                <Label htmlFor="currency" className="text-sm md:text-base">
                  Currency
                </Label>
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

            <div className="grid gap-1 md:gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <Label
                  htmlFor="expiration"
                  className="text-sm md:text-base mb-2 sm:mb-0"
                >
                  Expiration Date
                </Label>
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

            <div className="grid gap-1 md:gap-2">
              <Label htmlFor="invoiceApp" className="text-sm md:text-base">
                Invoice Application (Optional)
              </Label>
              <Select
                value={formData.invoiceApp}
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

            <div className="grid gap-1 md:gap-2">
              <Label htmlFor="invoiceId" className="text-sm md:text-base">
                Invoice ID (Optional)
              </Label>
              <Input
                id="invoiceId"
                name="invoiceId"
                placeholder="INV-12345"
                value={formData.invoiceId || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-1 md:gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <Label
                  htmlFor="reminder"
                  className="text-sm md:text-base mb-2 sm:mb-0"
                >
                  Payment Reminders
                </Label>
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

              {formData.reminderEnabled && (
                <div className="space-y-3 mt-2 md:mt-3">
                  <div className="grid gap-1 md:gap-2">
                    <Label
                      htmlFor="recipientEmail"
                      className="text-sm md:text-base"
                    >
                      Recipient Email *
                    </Label>
                    <Input
                      id="recipientEmail"
                      name="recipientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={formData.recipientEmail || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Invoice will be automatically sent to this email via EmailJS
                    </p>
                  </div>

                  <div className="grid gap-1 md:gap-2">
                    <Label
                      htmlFor="recipientPhone"
                      className="text-sm md:text-base"
                    >
                      WhatsApp Number
                    </Label>
                    <Input
                      id="recipientPhone"
                      name="recipientPhone"
                      placeholder="+91 9876543210"
                      value={formData.recipientPhone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymModal;
