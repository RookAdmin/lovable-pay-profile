import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  BarChart3,
  Send,
  AlertTriangle,
  Check,
  X,
  Trash2,
  Share2,
  QrCode,
} from "lucide-react";
import { Paym, PaymReminder } from "@/types/payms";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PaymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const {
    data: paym,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["paym", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Transform the data to match our Paym interface
      return {
        id: data.id,
        profileId: data.profile_id,
        title: data.title,
        amount: Number(data.amount),
        currency: data.currency,
        uniqueLink: data.unique_link,
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isPaid: data.is_paid,
        invoiceApp: data.invoice_app,
        invoiceId: data.invoice_id,
        reminderEnabled: data.reminder_enabled,
        lastReminderSent: data.last_reminder_sent
          ? new Date(data.last_reminder_sent)
          : undefined,
        metadata: data.metadata,
      } as Paym;
    },
    enabled: !!id,
  });

  const { data: reminders } = useQuery({
    queryKey: ["paymReminders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paym_reminders")
        .select("*")
        .eq("paym_id", id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;

      // Transform the data to match our PaymReminder interface
      return data.map((reminder) => ({
        id: reminder.id,
        paymId: reminder.paym_id,
        recipient: reminder.recipient,
        channel: reminder.channel as "email" | "whatsapp",
        status: reminder.status as "pending" | "sent" | "failed",
        scheduledAt: new Date(reminder.scheduled_at),
        sentAt: reminder.sent_at ? new Date(reminder.sent_at) : undefined,
        createdAt: new Date(reminder.created_at),
      })) as PaymReminder[];
    },
    enabled: !!id,
  });

  const isExpired = (paym?: Paym) => {
    return paym?.expiresAt && isAfter(new Date(), paym.expiresAt);
  };

  const copyPaymLink = () => {
    if (!paym) return;
    const paymentLink = `${window.location.origin}/payms/${paym.uniqueLink}`;
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied to clipboard");
  };

  const copyPaymMessage = () => {
    if (!paym) return;
    const paymentLink = `${window.location.origin}/payms/${paym.uniqueLink}`;
    const message = `Hello,

Please complete your payment for: ${paym.title}
Amount: ${paym.currency}${paym.amount}
Payment link: ${paymentLink}

Thank you.`;

    navigator.clipboard.writeText(message);
    toast.success("Payment message copied to clipboard");
  };

  const sendReminder = async () => {
    if (!paym) return;
    toast.info("Sending reminder...", { duration: 2000 });

    try {
      const now = new Date();
      const { error } = await supabase
        .from("payms")
        .update({ last_reminder_sent: now.toISOString() })
        .eq("id", paym.id);

      if (error) throw error;

      // In a real app, you would also create a new reminder record
      // with the new scheduled reminder time

      toast.success("Reminder sent successfully");
      refetch();
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    }
  };

  const togglePaymentStatus = async () => {
    if (!paym) return;

    try {
      const { error } = await supabase
        .from("payms")
        .update({ is_paid: !paym.isPaid })
        .eq("id", paym.id);

      if (error) throw error;

      toast.success(`Payment marked as ${!paym.isPaid ? "paid" : "unpaid"}`);
      refetch();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const deletePaym = async () => {
    if (!paym) return;

    try {
      const { error } = await supabase.from("payms").delete().eq("id", paym.id);

      if (error) throw error;

      toast.success("Paym deleted successfully");
      navigate("/payms");
    } catch (error) {
      console.error("Error deleting Paym:", error);
      toast.error("Failed to delete Paym");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dc2e3e"></div>
        </div>
      </div>
    );
  }

  if (!paym) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Paym Not Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              The payment link you're looking for doesn't exist or you don't
              have permission to view it.
            </p>
            <Button onClick={() => navigate("/payms")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentLink = `${window.location.origin}/payms/${paym.uniqueLink}`;

  return (
    <>
      <Helmet>
        <title>Paym Details | Paym.me</title>
        <meta
          name="description"
          content="View and manage details for your Paym.me payment link."
        />
      </Helmet>
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/payms")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payms
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{paym.title}</h1>
              <p className="text-muted-foreground">
                Created on {format(paym.createdAt, "MMM d, yyyy")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={copyPaymLink}
                className="flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>

              <Button
                variant="outline"
                onClick={copyPaymMessage}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Copy Message
              </Button>

              <Button
                variant="outline"
                onClick={() => setQrDialogOpen(true)}
                className="flex items-center"
              >
                <QrCode className="mr-2 h-4 w-4" /> QR Code
              </Button>

              {!paym.isPaid && !isExpired(paym) && (
                <Button
                  onClick={sendReminder}
                  className="flex items-center bg-dc2e3e hover:bg-dc2e3e/90"
                >
                  <Send className="mr-2 h-4 w-4" /> Send Reminder
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                      Information about this payment request
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Amount
                        </h3>
                        <p className="text-2xl font-semibold">
                          {paym.currency}
                          {paym.amount}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Status
                        </h3>
                        <div>
                          {paym.isPaid ? (
                            <Badge className="bg-green-500">Paid</Badge>
                          ) : isExpired(paym) ? (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-600 border-yellow-200"
                            >
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200"
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Payment Link
                        </h3>
                        <p className="text-sm font-mono break-all">
                          {paymentLink}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Last Updated
                        </h3>
                        <p>{format(paym.updatedAt, "MMM d, yyyy h:mm a")}</p>
                      </div>

                      {paym.expiresAt && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Expiration
                          </h3>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <p>
                              {format(paym.expiresAt, "MMM d, yyyy h:mm a")}
                            </p>
                          </div>
                        </div>
                      )}

                      {paym.lastReminderSent && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Last Reminder
                          </h3>
                          <div className="flex items-center">
                            <Send className="h-4 w-4 mr-2" />
                            <p>
                              {format(
                                paym.lastReminderSent,
                                "MMM d, yyyy h:mm a"
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {paym.invoiceApp && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Invoice App
                          </h3>
                          <p className="capitalize">{paym.invoiceApp}</p>
                        </div>
                      )}

                      {paym.invoiceId && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Invoice ID
                          </h3>
                          <p>{paym.invoiceId}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      variant={paym.isPaid ? "outline" : "default"}
                      onClick={togglePaymentStatus}
                      className={
                        paym.isPaid ? "" : "bg-green-500 hover:bg-green-600"
                      }
                    >
                      {paym.isPaid ? (
                        <>
                          <X className="mr-2 h-4 w-4" /> Mark as Unpaid
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Mark as Paid
                        </>
                      )}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Paym
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="reminders">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Reminders</CardTitle>
                    <CardDescription>
                      History and status of payment reminders
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {reminders && reminders.length > 0 ? (
                      <div className="space-y-4">
                        {reminders.map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <div
                              className={`p-2 rounded-full mr-4 ${
                                reminder.status === "sent"
                                  ? "bg-green-100"
                                  : reminder.status === "failed"
                                  ? "bg-red-100"
                                  : "bg-yellow-100"
                              }`}
                            >
                              {reminder.channel === "email" ? (
                                <svg
                                  xmlns="http://www3.org/2000/svg"
                                  className={`h-5 w-5 ${
                                    reminder.status === "sent"
                                      ? "text-green-500"
                                      : reminder.status === "failed"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www3.org/2000/svg"
                                  className={`h-5 w-5 ${
                                    reminder.status === "sent"
                                      ? "text-green-500"
                                      : reminder.status === "failed"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium capitalize">
                                    {reminder.channel} Reminder
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    To: {reminder.recipient}
                                  </p>
                                </div>

                                <Badge
                                  variant="outline"
                                  className={`
                                  capitalize
                                  ${
                                    reminder.status === "sent"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : reminder.status === "failed"
                                      ? "bg-red-50 text-red-600 border-red-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                `}
                                >
                                  {reminder.status}
                                </Badge>
                              </div>

                              <div className="mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Scheduled:{" "}
                                  {format(
                                    reminder.scheduledAt,
                                    "MMM d, yyyy h:mm a"
                                  )}
                                </div>

                                {reminder.sentAt && (
                                  <div className="flex items-center mt-1">
                                    <Send className="h-3 w-3 mr-1" />
                                    Sent:{" "}
                                    {format(
                                      reminder.sentAt,
                                      "MMM d, yyyy h:mm a"
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Reminders
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          No reminders have been sent or scheduled yet
                        </p>
                        {!paym.isPaid && !isExpired(paym) && (
                          <Button
                            onClick={sendReminder}
                            className="bg-dc2e3e hover:bg-dc2e3e/90"
                          >
                            <Send className="mr-2 h-4 w-4" /> Send Reminder
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    {!paym.isPaid &&
                      !isExpired(paym) &&
                      reminders &&
                      reminders.length > 0 && (
                        <Button
                          onClick={sendReminder}
                          className="bg-dc2e3e hover:bg-dc2e3e/90"
                        >
                          <Send className="mr-2 h-4 w-4" /> Send Another
                          Reminder
                        </Button>
                      )}
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Analytics</CardTitle>
                    <CardDescription>
                      Tracking and statistics for this payment link
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">
                        Detailed analytics for individual payment links will be
                        available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Preview</CardTitle>
                <CardDescription>
                  How your payment link appears to recipients
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-medium">{paym.title}</h3>
                    {paym.isPaid ? (
                      <Badge className="bg-green-500">Paid</Badge>
                    ) : isExpired(paym) ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-600 border-yellow-200"
                      >
                        Expired
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200"
                      >
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Amount Due</p>
                    <p className="text-3xl font-bold">
                      {paym.currency}
                      {paym.amount}
                    </p>
                  </div>

                  {paym.expiresAt && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground mb-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      {isExpired(paym) ? (
                        <span>
                          Expired on {format(paym.expiresAt, "MMM d, yyyy")}
                        </span>
                      ) : (
                        <span>
                          Valid until {format(paym.expiresAt, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      disabled={isExpired(paym) || paym.isPaid}
                      className={`w-full ${
                        isExpired(paym) || paym.isPaid
                          ? "bg-gray-300"
                          : "bg-dc2e3e hover:bg-dc2e3e/90"
                      }`}
                    >
                      {paym.isPaid ? "Payment Complete" : "Pay Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-stretch gap-2">
                <Button
                  variant="outline"
                  onClick={() => setQrDialogOpen(true)}
                  className="w-full flex items-center justify-center"
                >
                  <QrCode className="mr-2 h-4 w-4" /> View QR Code
                </Button>

                <Button
                  variant="outline"
                  onClick={copyPaymLink}
                  className="w-full flex items-center justify-center"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>

                <Button
                  variant="outline"
                  onClick={copyPaymMessage}
                  className="w-full flex items-center justify-center"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Payment Link</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this payment link? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={deletePaym}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code to access the payment link
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={paymentLink} size={200} />
              </div>

              <p className="text-sm text-center break-all">{paymentLink}</p>
            </div>

            <DialogFooter>
              <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PaymDetail;
