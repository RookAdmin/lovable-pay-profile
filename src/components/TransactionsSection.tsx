
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionsTable } from "./TransactionsTable";
import { Link } from "react-router-dom";
import { Transaction } from "@/types/payment";
import { ArrowRight, CreditCard, Link2, Puzzle } from "lucide-react";

interface TransactionsSectionProps {
  transactions: Transaction[] | null;
  isLoading: boolean;
  hasPaymentGateway: boolean;
}

export default function TransactionsSection({
  transactions,
  isLoading,
  hasPaymentGateway,
}: TransactionsSectionProps) {
  if (!hasPaymentGateway) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" /> Transactions
          </CardTitle>
          <CardDescription>
            Connect a payment gateway to view your transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Puzzle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">
              No payment gateway connected
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Connect a payment gateway like Stripe or PayPal to start receiving
              payments and view transaction history.
            </p>
            <Button
              className="mt-4"
              asChild
            >
              <Link to="/dashboard?activeTab=apps-integrations">
                Connect a Payment Gateway
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" /> Transactions
            </CardTitle>
            <CardDescription>View your recent transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard?activeTab=transactions">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <TransactionsTable
            transactions={transactions || []}
          />
        )}
      </CardContent>
    </Card>
  );
}
