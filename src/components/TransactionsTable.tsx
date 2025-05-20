
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkIcon, ExternalLink } from "lucide-react";
import { Transaction } from "@/types/payment";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (!transactions.length) {
    return (
      <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
        No transactions found.
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </Badge>
        );
      case "pending":
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        );
      case "failed":
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Gateway</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-xs">
                {transaction.id.substring(0, 12)}...
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: transaction.currency || "USD",
                }).format(transaction.amount / 100)}
              </TableCell>
              <TableCell>
                {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell className="capitalize">{transaction.gateway}</TableCell>
              <TableCell className="text-right">
                {transaction.receiptUrl && (
                  <a
                    href={transaction.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Receipt
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
