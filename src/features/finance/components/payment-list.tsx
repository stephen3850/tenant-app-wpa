"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PaymentStatus } from "@prisma/client";

export function PaymentList({ payments }: { payments: any[] }) {
  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED": return "default";
      case "REVERSED": return "destructive";
      case "PENDING": return "outline";
      case "FAILED": return "secondary";
      default: return "secondary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ref</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs">{payment.receiptNumber}</TableCell>
                <TableCell>{format(new Date(payment.paymentDate), "dd MMM yyyy")}</TableCell>
                <TableCell>{payment.tenant?.firstName} {payment.tenant?.lastName}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell className="font-bold">{formatCurrency(Number(payment.amount))}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{payment.transactionRef || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
