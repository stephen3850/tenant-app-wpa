import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DownloadIcon, CreditCardIcon } from "lucide-react";

export function BillingInvoiceList({ invoices }: { invoices: any[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Billing Period</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No billing history found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {format(new Date(invoice.periodStart), "MMM d")} - {format(new Date(invoice.periodEnd), "MMM d, yyyy")}
                </TableCell>
                <TableCell>KES {invoice.total.toString()}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "PAID" ? "success" as any : "secondary"}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                  {invoice.status !== "PAID" && (
                    <Button size="sm" variant="outline">
                        <CreditCardIcon className="h-4 w-4 mr-2" /> Pay
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
