import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format, formatDistance, isAfter } from "date-fns";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Calendar,
  Bell,
  Copy,
  ExternalLink,
  Clock,
  Check,
  X,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { Paym } from "@/types/payms";
import CreatePaymModal from "@/components/payms/CreatePaymModal";
import EditPaymModal from "@/components/payms/EditPaymModal";
import DeletePaymModal from "@/components/payms/DeletePaymModal";

const Payms = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPaym, setEditingPaym] = useState<Paym | null>(null);
  const [deletingPaym, setDeletingPaym] = useState<Paym | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "amount">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: payms,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["payms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payms")
        .select("*")
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (error) throw error;

      // Transform the data to match our Paym interface
      return data.map((paym) => ({
        id: paym.id,
        profileId: paym.profile_id,
        title: paym.title,
        amount: Number(paym.amount),
        currency: paym.currency,
        uniqueLink: paym.unique_link,
        expiresAt: paym.expires_at ? new Date(paym.expires_at) : undefined,
        createdAt: new Date(paym.created_at),
        updatedAt: new Date(paym.updated_at),
        isPaid: paym.is_paid,
        invoiceApp: paym.invoice_app,
        invoiceId: paym.invoice_id,
        reminderEnabled: paym.reminder_enabled,
        lastReminderSent: paym.last_reminder_sent
          ? new Date(paym.last_reminder_sent)
          : undefined,
        metadata: paym.metadata,
      })) as Paym[];
    },
    enabled: !!user?.id,
  });

  // Filter payms based on search query
  const filteredPayms = payms?.filter(
    (paym) =>
      paym.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paym.uniqueLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paym.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyPaymMessage = (paym: Paym) => {
    const paymentLink = `${window.location.origin}/payms/${paym.uniqueLink}`;
    const message = `Hello,

Please complete your payment for: ${paym.title}
Amount: ${paym.currency}${paym.amount}
Payment link: ${paymentLink}

Thank you.`;

    navigator.clipboard.writeText(message);
    toast.success("Payment message copied to clipboard");
  };

  const copyPaymLink = (paym: Paym) => {
    const paymentLink = `${window.location.origin}/payms/${paym.uniqueLink}`;
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied to clipboard");
  };

  const sendReminder = async (paym: Paym) => {
    toast.info("Sending reminder...", { duration: 2000 });
    // In a real app, you would send a request to your backend to send the reminder
    // For now, we'll just update the lastReminderSent field
    try {
      const now = new Date();
      const { error } = await supabase
        .from("payms")
        .update({ last_reminder_sent: now.toISOString() })
        .eq("id", paym.id);

      if (error) throw error;

      toast.success("Reminder sent successfully");
      refetch();
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    }
  };

  const togglePaymStatus = async (paym: Paym) => {
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

  const isExpired = (paym: Paym) => {
    return paym.expiresAt && isAfter(new Date(), paym.expiresAt);
  };

  return (
    <>
      <Helmet>
        <title>Payms | Paym.me</title>
        <meta
          name="description"
          content="Create and manage your private Paym.me payment links for invoices and requests."
        />
      </Helmet>
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Payms</h2>
            <p className="text-muted-foreground">
              Create and manage private payment links for invoices
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-dc2e3e hover:bg-dc2e3e/90 text-black"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Paym
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div className="relative w-full md:w-1/3">
            <Input
              placeholder="Search payms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={sortBy === "created_at" ? "default" : "outline"}
              onClick={() => {
                if (sortBy === "created_at") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("created_at");
                  setSortOrder("desc");
                }
              }}
              size="sm"
            >
              Date{" "}
              {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              variant={sortBy === "amount" ? "default" : "outline"}
              onClick={() => {
                if (sortBy === "amount") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("amount");
                  setSortOrder("desc");
                }
              }}
              size="sm"
            >
              Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dc2e3e"></div>
          </div>
        ) : filteredPayms && filteredPayms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPayms.map((paym) => (
              <Card
                key={paym.id}
                className={`shadow-sm hover:shadow-md transition-shadow ${
                  paym.isPaid
                    ? "border-green-200"
                    : isExpired(paym)
                    ? "border-yellow-200"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{paym.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {format(paym.createdAt, "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {paym.isPaid ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          Paid
                        </Badge>
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
                      {paym.invoiceApp && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-600 border-purple-200 capitalize"
                        >
                          {paym.invoiceApp}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-semibold">
                        {paym.currency}
                        {paym.amount}
                      </p>
                      {paym.expiresAt && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {isExpired(paym) ? (
                            <span>
                              Expired{" "}
                              {formatDistance(paym.expiresAt, new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          ) : (
                            <span>
                              Expires{" "}
                              {formatDistance(paym.expiresAt, new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyPaymLink(paym)}
                        title="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyPaymMessage(paym)}
                        title="Copy message"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {!paym.isPaid && !isExpired(paym) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendReminder(paym)}
                          title="Send reminder"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPaym(paym)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingPaym(paym)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p>
                      <span className="text-muted-foreground">Paym link: </span>
                      <span className="font-mono text-xs">
                        /payms/{paym.uniqueLink}
                      </span>
                    </p>

                    {paym.invoiceId && (
                      <p className="mt-1">
                        <span className="text-muted-foreground">
                          Invoice ID:{" "}
                        </span>
                        <span className="font-mono text-xs">
                          {paym.invoiceId}
                        </span>
                      </p>
                    )}

                    {paym.lastReminderSent && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        <Bell className="h-3 w-3 inline mr-1" />
                        Last reminder:{" "}
                        {format(paym.lastReminderSent, "MMM d, h:mm a")}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => togglePaymStatus(paym)}
                  >
                    {paym.isPaid ? (
                      <>
                        <X className="h-3 w-3 mr-1" /> Mark Unpaid
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" /> Mark Paid
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" asChild className="text-xs">
                    <Link to={`/payms/${paym.id}`}>
                      Details <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Send className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Payms Found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery
                  ? "No results match your search criteria. Try a different search term."
                  : "You haven't created any Payms yet. Create your first one to get started."}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-dc2e3e hover:bg-dc2e3e/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Paym
              </Button>
            </CardContent>
          </Card>
        )}

        {isCreateModalOpen && (
          <CreatePaymModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSuccess={refetch}
          />
        )}

        {editingPaym && (
          <EditPaymModal
            open={!!editingPaym}
            onOpenChange={(open) => !open && setEditingPaym(null)}
            onSuccess={refetch}
            paym={editingPaym}
          />
        )}

        {deletingPaym && (
          <DeletePaymModal
            open={!!deletingPaym}
            onOpenChange={(open) => !open && setDeletingPaym(null)}
            onSuccess={refetch}
            paym={deletingPaym}
          />
        )}
      </div>
    </>
  );
};

export default Payms;
