"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DownloadIcon, PrinterIcon, CreditCardIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { logInvoiceDownload } from "@/actions/tenant-invoices";

export function InvoiceDetails({ invoice }: { invoice: any }) {
  const handleDownload = async () => {
    try {
      await logInvoiceDownload(invoice.id);
      window.print(); // Simple print as fallback for PDF
    } catch (error) {
      console.error(error);
    }
  };

  const isPaid = invoice.status === "PAID";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/invoices">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Invoices
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Invoice Details</p>
              <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
              <p className="text-sm text-muted-foreground">
                Billing Period: {new Date(invoice.billingYear, invoice.billingMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={isPaid ? "success" as any : "destructive"} className="px-4 py-1 text-sm">
                {invoice.status}
              </Badge>
              <p className="text-sm text-muted-foreground">Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Property & Unit</h3>
              <p className="font-bold text-lg">{invoice.lease.unit.property.propertyName}</p>
              <p className="text-muted-foreground">Unit: {invoice.lease.unit.unitNumber}</p>
              <p className="text-muted-foreground">{invoice.lease.unit.property.address}</p>
            </div>
            <div className="md:text-right">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Tenant</h3>
              <p className="font-bold text-lg">{invoice.lease.tenant.firstName} {invoice.lease.tenant.lastName}</p>
              <p className="text-muted-foreground">{invoice.lease.tenant.email}</p>
              <p className="text-muted-foreground">{invoice.lease.tenant.phone}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Amount Paid</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-destructive border-t-2 border-double pt-2">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <DownloadIcon className="h-4 w-4 mr-2" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <PrinterIcon className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
          {!isPaid && (
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
              <CreditCardIcon className="h-4 w-4 mr-2" /> Pay Outstanding Balance
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
