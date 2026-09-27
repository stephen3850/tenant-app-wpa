"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SearchIcon, FileTextIcon, EyeIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";
import { InvoiceStatus } from "@prisma/client";
import { tenantRoutes } from "@/lib/routes";

export function InvoiceList({ initialInvoices }: { initialInvoices: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = initialInvoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold border-emerald-200">Paid</Badge>;
      case "PARTIALLY_PAID":
        return <Badge variant="warning" className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold border-amber-200">Partial</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive" className="font-bold">Overdue</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary" className="font-bold">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="font-bold">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search invoice number..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-11 bg-white border-slate-200 rounded-xl font-medium">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="POSTED">Issued</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Invoice #</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Billing Period</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Due Date</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Total</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Balance</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 text-xs uppercase tracking-wider py-4 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileTextIcon className="h-8 w-8 text-slate-300" />
                        <p>No invoices match your search query.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const hasBalance = Number(invoice.balanceDue) > 0;

                    return (
                      <TableRow key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-bold text-slate-900 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                              <FileTextIcon className="h-4 w-4" />
                            </div>
                            <span>{invoice.invoiceNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {new Date(invoice.billingYear, invoice.billingMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell className="font-bold text-slate-900">{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell className={`font-bold ${hasBalance ? "text-rose-600" : "text-emerald-600"}`}>
                          {formatCurrency(invoice.balanceDue)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right py-4 pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-slate-200 hover:bg-slate-100 font-bold text-xs" asChild>
                              <Link href={tenantRoutes.invoice(invoice.id)}>
                                <EyeIcon className="h-3.5 w-3.5 mr-1 text-slate-500" /> View
                              </Link>
                            </Button>
                            {hasBalance && invoice.status !== "CANCELLED" && (
                              <Button size="sm" className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs" asChild>
                                <Link href={tenantRoutes.payInvoice(invoice.id)}>
                                  <CreditCardIcon className="h-3.5 w-3.5 mr-1" /> Pay
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
