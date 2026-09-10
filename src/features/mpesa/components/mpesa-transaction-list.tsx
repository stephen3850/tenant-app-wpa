"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function MpesaTransactionList({ transactions }: { transactions: any[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Receipt / Request ID</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No transactions found</TableCell>
              </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(tx.createdAt), "dd MMM yyyy HH:mm")}</TableCell>
                <TableCell className="font-mono text-[10px] max-w-[120px] truncate">
                    {tx.mpesaReceiptNumber || tx.checkoutRequestId}
                </TableCell>
                <TableCell>{tx.tenant ? `${tx.tenant.firstName} ${tx.tenant.lastName}` : "-"}</TableCell>
                <TableCell>{tx.phoneNumber}</TableCell>
                <TableCell className="font-bold">KES {Number(tx.amount || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={tx.status === "SUCCESS" ? "default" : tx.status === "FAILED" ? "destructive" : "outline"}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">{tx.transactionType}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
