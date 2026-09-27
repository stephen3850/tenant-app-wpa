"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DownloadIcon, PrinterIcon, CreditCardIcon, ChevronLeftIcon, HelpCircleIcon, ReceiptIcon } from "lucide-react";
import Link from "next/link";
import { logInvoiceDownload } from "@/actions/tenant-invoices";
import { tenantRoutes } from "@/lib/routes";

export function InvoiceDetails({ invoice }: { invoice: any }) {
  const handleDownload = async () => {
    try {
      await logInvoiceDownload(invoice.id);
      window.print();
    } catch (error) {
      console.error(error);
    }
  };

  const isPaid = invoice.status === "PAID";
  const hasBalance = Number(invoice.balanceDue) > 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-emerald-700 font-bold p-0" asChild>
          <Link href={tenantRoutes.invoices()}>
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Invoices
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-bold" asChild>
          <Link href={tenantRoutes.newTicket(`Inquiry regarding Invoice ${invoice.invoiceNumber}`)}>
            <HelpCircleIcon className="h-4 w-4 mr-1.5 text-slate-500" /> Contact Management
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-md rounded-2xl bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-wider">Invoice Details</p>
              <h1 className="text-3xl font-black text-slate-900 mt-1">{invoice.invoiceNumber}</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Billing Period: {new Date(invoice.billingYear, invoice.billingMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <Badge variant={isPaid ? "success" as any : "destructive"} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                {invoice.status}
              </Badge>
              <p className="text-xs font-semibold text-slate-500">Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8 p-6 rounded-xl bg-slate-50/50 border border-slate-100">
            <div>
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest mb-2">Property & Unit</h3>
              <p className="font-extrabold text-base text-slate-900">{invoice.lease?.unit?.property?.propertyName || "N/A"}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Unit: {invoice.lease?.unit?.unitNumber || "N/A"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{invoice.lease?.unit?.property?.address || ""}</p>
            </div>
            <div className="md:text-right">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest mb-2">Tenant Information</h3>
              <p className="font-extrabold text-base text-slate-900">{invoice.lease?.tenant?.firstName} {invoice.lease?.tenant?.lastName}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{invoice.lease?.tenant?.email}</p>
              <p className="text-xs text-slate-500 mt-0.5">{invoice.lease?.tenant?.phone}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="font-bold text-xs uppercase text-slate-700 py-3.5">Description</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase text-slate-700 py-3.5">Quantity</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase text-slate-700 py-3.5">Unit Price</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase text-slate-700 py-3.5">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-slate-800 text-sm">{item.description}</TableCell>
                    <TableCell className="text-right text-slate-600 text-sm font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-right text-slate-600 text-sm font-medium">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900 text-sm">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="w-full md:w-72 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Tax</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-600">
                <span>Amount Paid</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-rose-600 border-t-2 border-double border-slate-300 pt-2">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Payment History</h3>
              <div className="space-y-2">
                {invoice.payments.map((pmt: any) => (
                  <div key={pmt.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{formatDate(pmt.paymentDate)} • {pmt.method}</p>
                      <p className="text-slate-500 font-mono mt-0.5">Ref: {pmt.transactionRef || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-emerald-600 text-sm">{formatCurrency(pmt.amount)}</span>
                      {pmt.receipt && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-700 font-bold" asChild>
                          <Link href={tenantRoutes.receipt(pmt.receipt.id)}>
                            <ReceiptIcon className="h-3.5 w-3.5 mr-1" /> Receipt
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50/80 border-t border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold text-xs" onClick={handleDownload}>
              <DownloadIcon className="h-4 w-4 mr-2" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold text-xs" onClick={() => window.print()}>
              <PrinterIcon className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
          {hasBalance && invoice.status !== "CANCELLED" && (
            <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-11 px-6 rounded-xl shadow-xs" asChild>
              <Link href={tenantRoutes.payInvoice(invoice.id)}>
                <CreditCardIcon className="h-4 w-4 mr-2" /> Pay Outstanding Balance
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
