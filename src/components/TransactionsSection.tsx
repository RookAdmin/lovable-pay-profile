
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transaction";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const TransactionsSection: React.FC = () => {
  const { user } = useAuth();
  const [hasPaymentGateway, setHasPaymentGateway] = useState<boolean | null>(null);
  
  // Query to check if any payment gateway integrations exist
  useQuery({
    queryKey: ["payment_gateways", user?.id],
    queryFn: async () => {
      // This is a placeholder - in a real app, you'd check if the user has any payment gateways integrated
      // For now, we'll simulate this check
      const { data: integrations } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('profile_id', user?.id)
        .limit(1);

      // For demo purposes, assume any payment method means they have a gateway integrated
      const hasGateway = integrations && integrations.length > 0;
      setHasPaymentGateway(hasGateway);
      return hasGateway;
    },
    enabled: !!user?.id,
  });

  // Query transactions data
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', user?.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as Transaction[] || [];
    },
    enabled: !!user?.id && hasPaymentGateway === true,
  });

  const handleIntegratePaymentGateway = () => {
    // Redirect to Apps & Integrations section
    toast.info("Let's set up your payment gateway!");
    // This function would be implemented by the parent component
    if (window.goToAppsIntegrations) {
      window.goToAppsIntegrations();
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get appropriate badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
      case 'success':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show placeholder for loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  // If no payment gateway is integrated, show prompt
  if (hasPaymentGateway === false) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              No Payment Gateway Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Connect a payment gateway like Stripe or PayPal to start receiving payments and track your transactions.
            </p>
            <Button onClick={handleIntegratePaymentGateway} className="bg-dc2e3e hover:bg-dc2e3e/90">
              Connect Payment Gateway
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex justify-between items-center">
          <span>Recent Transactions</span>
          <Button variant="outline" size="sm" className="text-xs">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.currency} {transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{transaction.payment_gateway}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add this to the window object for navigation between tabs
declare global {
  interface Window {
    goToAppsIntegrations?: () => void;
  }
}

export default TransactionsSection;
