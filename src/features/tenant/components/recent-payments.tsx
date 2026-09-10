import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { DownloadIcon, CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecentPayments({ payments }: any) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No recent payments found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-xs uppercase tracking-wider">Date</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider">Method</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider">Amount</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment: any) => (
            <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
              <TableCell className="text-sm font-medium">{formatDate(payment.paymentDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   <span className="text-xs font-bold uppercase tracking-tight">{payment.method}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-foreground">{formatCurrency(payment.amount)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-2",
                    payment.status === "COMPLETED"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-600"
                  )}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {payment.receipt ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" asChild title="Download Receipt">
                    <Link href={`/receipts/${payment.receipt.id}`}>
                      <DownloadIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled>
                    <DownloadIcon className="h-4 w-4 opacity-20" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
