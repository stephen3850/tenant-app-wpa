"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DownloadIcon, PrinterIcon, ChevronLeftIcon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { logReceiptDownload } from "@/actions/tenant-receipts";

export function ReceiptDetails({ receipt }: { receipt: any }) {
  const { payment } = receipt;
  const { tenant, allocations } = payment;

  // Assuming the first allocation's lease/unit info is representative of the payment
  const primaryLease = allocations[0]?.invoice?.lease;
  const propertyName = primaryLease?.unit?.property?.propertyName || "N/A";
  const unitNumber = primaryLease?.unit?.unitNumber || "N/A";

  const handleDownload = async () => {
    try {
      await logReceiptDownload(receipt.id);
      window.print();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 no-print">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/receipts">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Receipts
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-slate-50 border-b pb-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-600 font-bold text-xl uppercase tracking-tighter">
                <CheckCircle2Icon className="h-6 w-6" />
                Official Receipt
              </div>
              <p className="text-3xl font-black text-slate-900">
                {payment.receiptNumber || `RCP-${receipt.id.slice(0, 8).toUpperCase()}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">TMS Property Solutions</p>
              <p className="text-sm text-muted-foreground">PO Box 1234-00100</p>
              <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Received From</h3>
                <p className="font-bold text-lg">{tenant.firstName} {tenant.lastName}</p>
                <p className="text-sm text-muted-foreground">{tenant.email}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Property Details</h3>
                <p className="font-semibold">{propertyName}</p>
                <p className="text-sm text-muted-foreground">Unit: {unitNumber}</p>
              </div>
            </div>
            <div className="space-y-4 text-right">
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Payment Date</h3>
                <p className="font-semibold">{formatDate(payment.paymentDate)}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Payment Method</h3>
                <p className="font-semibold uppercase">{payment.method}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference</h3>
                <p className="font-mono text-sm font-semibold">{payment.transactionRef || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Payment Allocations</h3>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-bold">Invoice #</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Period</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold">Amount Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-sm text-muted-foreground">
                      Applied as general credit
                    </TableCell>
                  </TableRow>
                ) : (
                  allocations.map((alloc: any) => (
                    <TableRow key={alloc.id}>
                      <TableCell className="font-medium">{alloc.invoice.invoiceNumber}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(alloc.invoice.billingYear, alloc.invoice.billingMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(alloc.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4">
            <div className="bg-slate-900 text-white p-6 rounded-lg w-full md:w-80 space-y-2">
               <div className="flex justify-between text-xs text-slate-400">
                 <span>Total Received</span>
                 <span className="line-through">{formatCurrency(payment.amount)}</span>
               </div>
               <div className="flex justify-between items-end border-t border-slate-700 pt-2">
                 <span className="text-sm font-bold">Total Applied</span>
                 <span className="text-2xl font-black">{formatCurrency(payment.amount)}</span>
               </div>
               <p className="text-[10px] text-center text-slate-500 pt-4 italic">
                 This is a computer generated receipt and does not require a signature.
               </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6 flex justify-between no-print">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <DownloadIcon className="h-4 w-4 mr-2" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4 mr-2" /> Print Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
