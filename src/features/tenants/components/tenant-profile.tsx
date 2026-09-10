"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Key,
  Calendar,
  DollarSign,
  Phone,
  ArrowRight,
  ArrowLeft,
  Receipt,
  UserCircle,
  MoreHorizontal,
  Eye,
  Plus,
  List,
  LayoutDashboard,
  Upload,
  FileText,
  TrendingUp,
  AlertCircle,
  FileMinus,
  FolderOpen,
  Pencil,
  Trash2
} from "lucide-react";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Area,
  ComposedChart,
} from "recharts";
import Link from "next/link";
import { UploadDocumentDialog } from "./upload-document-dialog";
import { AddPaymentDialog } from "@/features/finance/components/add-payment-dialog";
import { AddLeaseDialog } from "@/features/leases/components/add-lease-dialog";
import { AssignUnitDialog } from "@/features/finance/components/assign-unit-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TenantProfileProps {
  tenant: any;
}

export function TenantProfile({ tenant }: TenantProfileProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [isLeaseOpen, setIsLeaseOpen] = React.useState(false);
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  if (!tenant) return null;

  // 1. Data Collection Refinement
  const activeLease = tenant.leases?.find((l: any) => l.status === "ACTIVE") ||
                     tenant.leases?.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())?.[0];

  const unit = activeLease?.unit;
  const property = unit?.property;

  const allInvoices = tenant.leases?.flatMap((l: any) => l.invoices || []) || [];

  const totalDue = allInvoices
    .filter((inv: any) => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .reduce((sum: number, inv: any) => sum + Number(inv.balanceDue || 0), 0);

  const rentDue = allInvoices
    .filter((inv: any) => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .reduce((sum: number, inv: any) => {
      const rentLineItems = inv.lineItems?.filter((li: any) =>
        li.description?.toLowerCase().includes("rent") ||
        li.description?.toLowerCase().includes("service charge")
      ) || [];
      const invoiceRentTotal = rentLineItems.reduce((s: number, li: any) => s + Number(li.amount || 0), 0);
      return sum + invoiceRentTotal;
    }, 0);

  const utilitiesDue = Math.max(0, totalDue - rentDue);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const paymentsThisMonth = allInvoices
    .flatMap((inv: any) => inv.payments || [])
    .filter((p: any) => p.status === "COMPLETED" && new Date(p.paymentDate) >= firstDayOfMonth)
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const nextDueInvoice = allInvoices
    .filter((inv: any) => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const chartData = [
    { month: "Aug 2025", rentPaid: 0, balance: 0 },
    { month: "Sep 2025", rentPaid: 0, balance: 0 },
    { month: "Oct 2025", rentPaid: 0, balance: 0 },
    { month: "Nov 2025", rentPaid: 0, balance: 0 },
    { month: "Dec 2025", rentPaid: 0, balance: 0 },
    { month: "Jan 2026", rentPaid: 0, balance: 0 },
    { month: "Feb 2026", rentPaid: 0, balance: 0 },
    { month: "Mar 2026", rentPaid: 0, balance: 0 },
    { month: "Apr 2026", rentPaid: 0, balance: 0 },
    { month: "May 2026", rentPaid: 0, balance: 0 },
    { month: "Jun 2026", rentPaid: 0, balance: 0 },
    { month: "Jul 2026", rentPaid: paymentsThisMonth, balance: totalDue },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8 px-4">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Column */}
          <div className="flex-1 space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#002e22] flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md ring-2 ring-emerald-50">
                {tenant.firstName?.[0]}{tenant.lastName?.[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Tenant Profile</p>
                  <Badge className={cn(
                    "border-none px-1.5 py-0 h-4 text-[8px] font-bold uppercase",
                    tenant.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                  )}>
                    {tenant.status}
                  </Badge>
                </div>
                <h1 className="text-xl font-extrabold text-slate-950 tracking-tight leading-none">
                  {tenant.firstName} {tenant.lastName}
                </h1>
                <p className="text-[10px] text-slate-600 font-semibold leading-tight max-w-[240px] pt-0.5">
                  Account, lease, contact, and billing health in one controlled view.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex flex-col border-l-2 border-slate-100 pl-2">
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Property Code</span>
                    <Link href={`/properties/${property?.id || ""}`} className="text-[11px] font-black text-slate-900 hover:text-emerald-700 hover:underline transition-colors leading-none pt-0.5">
                      {property?.propertyCode || "N/A"}
                    </Link>
                  </div>
                  <div className="flex flex-col border-l-2 border-slate-100 pl-2">
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Unit Number</span>
                    <Link href={`/units/${unit?.id || ""}`} className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 hover:underline transition-colors leading-none pt-0.5">
                      {unit?.unitNumber || "N/A"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Pillar Boxes */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: Key, label: "LEASE", value: activeLease?.status === "ACTIVE" ? "Active" : "None", iconColor: "text-emerald-600" },
                { icon: Calendar, label: "NEXT DUE", value: nextDueInvoice ? formatDate(nextDueInvoice.dueDate) : "N/A", iconColor: "text-blue-600" },
                { icon: Receipt, label: "RENT", value: formatCurrency(activeLease?.monthlyRent || 0), iconColor: "text-indigo-600" },
                { icon: Phone, label: "PHONE", value: tenant.phone, iconColor: "text-slate-600" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-1.5 border border-slate-200 rounded-lg bg-slate-50/50 min-w-[75px] h-[65px] space-y-1 hover:bg-white hover:border-slate-300 transition-all cursor-default shadow-sm">
                  <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                  <div className="text-center">
                    <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">{stat.label}</p>
                    <p className="text-[10px] font-black text-slate-800 leading-tight break-all max-w-[65px]">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments Column */}
          <Card className="shadow-none border border-slate-200 bg-emerald-50/10 flex-1 min-w-[210px]">
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Payments (This Month)</p>
                <h2 className="text-2xl font-black text-slate-950 mt-1">{formatCurrency(paymentsThisMonth)}</h2>
              </div>
              <p className="text-[9px] text-slate-600 font-bold leading-tight">
                Actual cash collected and approved this month.
              </p>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="bg-white text-[9px] h-7 px-3 font-black border-slate-200 text-emerald-700 hover:bg-emerald-50 shadow-sm">
                  <List className="h-3 w-3 mr-1.5" /> View payments
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-[9px] h-7 px-3 font-black border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
                  <UserCircle className="h-3 w-3 mr-1.5" /> Login as
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Total Due Column */}
          <Card className="shadow-none border border-slate-200 bg-red-50/10 flex-1 min-w-[230px]">
            <CardContent className="p-4 relative">
              <Button variant="outline" size="sm" className="absolute top-4 right-4 text-[9px] h-6 px-2 font-black bg-white border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50" asChild>
                <Link href={`/reports-tenant-statements?tenantId=${tenant.id}`}>
                  Statement <ArrowRight className="ml-1 h-2 w-2" />
                </Link>
              </Button>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Due</p>
                <h2 className="text-2xl font-black text-red-600 tracking-tight">{formatCurrency(totalDue)}</h2>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2 border border-red-100 rounded-lg bg-white shadow-sm ring-1 ring-red-50/50">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Rent Due</p>
                   <p className="text-[12px] font-black text-red-600 leading-none">{formatCurrency(rentDue)}</p>
                </div>
                <div className="p-2 border border-red-100 rounded-lg bg-white shadow-sm ring-1 ring-red-50/50">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Utility Due</p>
                   <p className="text-[12px] font-black text-red-600 leading-none">{formatCurrency(utilitiesDue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
        <Button variant="outline" className="h-8 px-4 text-[10px] font-black text-slate-700 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm transition-colors" asChild>
          <Link href="/tenants"><ArrowLeft className="mr-1.5 h-3 w-3" /> Back</Link>
        </Button>
        <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden md:block" />

        <Button
          onClick={() => setIsPaymentOpen(true)}
          className="bg-[#059669] hover:bg-[#047857] h-8 pl-1 pr-3 text-[10px] font-black rounded-lg shadow-md transition-all active:scale-95 gap-2 border-none text-white"
        >
          <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
          ADD PAYMENT
        </Button>

        <Button
          onClick={() => setIsLeaseOpen(true)}
          className="bg-[#059669] hover:bg-[#047857] h-8 pl-1 pr-3 text-[10px] font-black rounded-lg shadow-md transition-all active:scale-95 gap-2 border-none text-white"
        >
          <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center">
            <Key className="h-3.5 w-3.5" />
          </div>
          ADD LEASE
        </Button>

        <Button className="bg-[#059669] hover:bg-[#047857] h-8 pl-1 pr-3 text-[10px] font-black rounded-lg shadow-md transition-all active:scale-95 gap-2 border-none text-white" asChild>
          <Link href={`/invoices/new?tenantId=${tenant.id}`}>
            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center">
              <Receipt className="h-3.5 w-3.5" />
            </div>
            INVOICE
          </Link>
        </Button>

        <div className="flex-1" />

        <Button variant="outline" className="h-8 px-4 text-[10px] font-black rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors" asChild>
          <Link href={`/tenants/${tenant.id}/edit`}>
            <Eye className="mr-1.5 h-3 w-3 text-slate-400" /> Tenant details
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-black text-[10px] min-w-[180px] p-1.5 rounded-xl border-slate-100 shadow-2xl">
            <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 rounded-lg group">
              <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                <Receipt className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600" />
              </div>
              <span className="text-emerald-800 uppercase tracking-tighter">Credit Note</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 rounded-lg group" asChild>
              <Link href={`/reports-tenant-statements?tenantId=${tenant.id}`}>
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
                </div>
                <span className="text-slate-900 uppercase tracking-tighter font-black">Statement</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 rounded-lg group" asChild>
              <Link href={`/documents?tenantId=${tenant.id}`}>
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <FolderOpen className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
                </div>
                <span className="text-slate-900 uppercase tracking-tighter font-black">Documents</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 rounded-lg group" asChild>
              <Link href={`/tenants/${tenant.id}/edit`}>
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <Pencil className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
                </div>
                <span className="text-slate-900 uppercase tracking-tighter font-black">Edit</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer hover:bg-red-50 rounded-lg group">
              <div className="h-7 w-7 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-red-100">
                <Trash2 className="h-3.5 w-3.5 text-red-400 group-hover:text-red-600" />
              </div>
              <span className="text-red-600 uppercase tracking-tighter font-black">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Compact Content Sections */}
      <div className="space-y-6">
        {/* Leases Section */}
        <section className="space-y-1.5">
          <h3 className="text-[11px] font-black text-slate-900 px-1 uppercase tracking-tight">Leases</h3>
          <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none h-8">
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0 px-3">#</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0">Property</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0">Unit</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0">Status</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0">Frequency</TableHead>
                  <TableHead className="text-[8px] font-black uppercase tracking-wider text-slate-500 py-0">Amount</TableHead>
                  <TableHead className="text-right text-[8px] font-black uppercase tracking-wider text-slate-500 py-0 px-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenant.leases?.map((lease: any, index: number) => (
                  <TableRow key={lease.id} className="border-slate-100 h-10 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-1 px-3 text-[9px] font-bold text-slate-400">{index + 1}</TableCell>
                    <TableCell className="py-1 text-[10px] font-black text-slate-800">{lease.unit.property.propertyName}</TableCell>
                    <TableCell className="py-1 text-[10px] font-black text-emerald-700">{lease.unit.unitNumber}</TableCell>
                    <TableCell className="py-1">
                      <Badge className={cn(
                        "rounded-full px-1.5 py-0 h-3.5 border-none text-[7px] font-black uppercase",
                        lease.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                      )}>
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 text-[10px] text-slate-700 font-bold">Monthly</TableCell>
                    <TableCell className="py-1 text-[10px] font-black text-slate-900">{formatCurrency(lease.monthlyRent)}</TableCell>
                    <TableCell className="py-1 px-3 text-right">
                       <Button variant="ghost" className="h-6 px-2 text-[8px] font-black text-slate-500 hover:text-slate-950 hover:bg-slate-100 uppercase">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Deposit Account Section */}
        <section className="space-y-1.5">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b border-slate-100 bg-slate-50/30">
               <div>
                  <CardTitle className="text-[12px] font-black text-slate-900">Deposit Account</CardTitle>
                  <p className="text-[9px] text-slate-600 font-bold mt-0.5">Approved tenant deposits separated from rent payments.</p>
               </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg min-w-[100px] shadow-sm">
                     <p className="text-[7px] font-black text-emerald-700 uppercase mb-0.5">On Account</p>
                     <p className="text-sm font-black text-emerald-900">0.00</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-lg min-w-[120px] shadow-sm">
                     <p className="text-[7px] font-black text-orange-700 uppercase mb-0.5">Expected</p>
                     <p className="text-sm font-black text-orange-900">243,445.00</p>
                     <p className="text-[7px] text-orange-800 font-black mt-0.5">Shortfall: 243,445.00</p>
                  </div>
                  <div className="flex-1" />
                  <div className="flex gap-1.5">
                     <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-black text-emerald-800 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100">
                        <LayoutDashboard className="h-3 w-3 mr-1.5" /> Deposit report
                     </Button>
                     <Button size="sm" className="h-7 px-3 text-[9px] font-black bg-[#4c9e00] hover:bg-[#3d7d00] rounded-lg shadow-md text-white">
                        <Plus className="h-3 w-3 mr-1.5" /> Add Deposit
                     </Button>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <Table>
                     <TableHeader>
                        <TableRow className="bg-slate-50/50 border-none h-7">
                           <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0 px-3">Date</TableHead>
                           <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Deposit type</TableHead>
                           <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Unit</TableHead>
                           <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">reference</TableHead>
                           <TableHead className="text-right text-[7px] font-black uppercase text-slate-500 py-0 px-3">Amount</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        <TableRow className="h-12">
                           <TableCell colSpan={5} className="text-center py-6 text-[10px] text-slate-500 font-bold italic">
                              No approved deposits recorded.
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
          </Card>
        </section>

        {/* Invoices Section */}
        <section className="space-y-1.5">
           <Card className="shadow-sm border-slate-200">
              <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/30">
                 <CardTitle className="text-[12px] font-black text-slate-900">Invoices</CardTitle>
                 <p className="text-[9px] text-slate-600 font-bold mt-0.5">Showing current & previous month invoices.</p>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader>
                       <TableRow className="bg-slate-50/50 border-none h-8">
                          <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0 px-4">Date</TableHead>
                          <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Title</TableHead>
                          <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Status</TableHead>
                          <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Total</TableHead>
                          <TableHead className="text-[7px] font-black uppercase text-slate-500 py-0">Unit</TableHead>
                          <TableHead className="text-right text-[7px] font-black uppercase text-slate-500 py-0 px-4">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {allInvoices.slice(0, 5).map((inv: any) => (
                          <TableRow key={inv.id} className="h-10 border-slate-100 hover:bg-slate-50/50 transition-colors">
                             <TableCell className="py-1 px-4 text-[10px] text-slate-700 font-bold">{formatDate(inv.createdAt)}</TableCell>
                             <TableCell className="py-1 text-[10px] font-black text-[#4c6ef5] hover:underline cursor-pointer">{inv.invoiceNumber}</TableCell>
                             <TableCell className="py-1">
                                <Badge className={cn(
                                   "rounded-full px-2 py-0 h-4 border-none text-[7px] font-black uppercase",
                                   inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"
                                )}>
                                   {inv.status}
                                </Badge>
                             </TableCell>
                             <TableCell className="py-1 text-[10px] font-black text-slate-900">{formatCurrency(inv.totalAmount)}</TableCell>
                             <TableCell className="py-1 text-[10px] font-black text-slate-700">{unit?.unitNumber}</TableCell>
                             <TableCell className="py-1 px-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                   <Button variant="outline" size="sm" className="h-6 px-2 text-[8px] font-black rounded-lg border-slate-200 hover:bg-slate-100" asChild>
                                      <Link href={`/invoices/${inv.id}`}>View</Link>
                                   </Button>
                                   <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                         setSelectedInvoice(inv);
                                         setIsAssignOpen(true);
                                      }}
                                      className="h-6 px-2 text-[8px] font-black rounded-lg border-slate-200 hover:bg-slate-100"
                                   >
                                      Assign unit
                                   </Button>
                                </div>
                             </TableCell>
                          </TableRow>
                       ))}
                       {allInvoices.length === 0 && (
                          <TableRow className="h-12">
                             <TableCell colSpan={6} className="text-center py-8 text-[10px] text-slate-500 font-bold italic">
                                No invoices found.
                             </TableCell>
                          </TableRow>
                       )}
                    </TableBody>
                 </Table>
                 <div className="p-3 border-t border-slate-100">
                    <p className="text-[9px] text-slate-500 font-bold italic">Showing latest {allInvoices.length} invoices.</p>
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Intelligence Section */}
        <section className="space-y-3">
           <div className="flex items-center justify-between px-1">
              <div className="space-y-0.5">
                 <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest leading-none">Intelligence</p>
                 <h2 className="text-xl font-black text-slate-950 tracking-tight">Early awareness, not reaction.</h2>
                 <p className="text-[10px] text-slate-600 font-bold">Rent-risk alerts and decline signals for this tenant.</p>
              </div>
              <p className="text-[9px] text-slate-500 font-black uppercase">As of {formatDate(new Date())}</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden">
                 <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30">
                    <div>
                       <CardTitle className="text-[11px] font-black text-slate-900">Risk trend</CardTitle>
                       <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">Rent paid (bars) vs statement balance (curve)</p>
                    </div>
                    <TrendingUp className="h-3.5 w-3.5 text-slate-300" />
                 </CardHeader>
                 <CardContent className="p-4 pt-4">
                    <div className="h-[180px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 8, fill: '#64748b', fontWeight: 800}}
                                dy={10}
                             />
                             <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 8, fill: '#64748b', fontWeight: 800}}
                             />
                             <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                             />
                             <Bar yAxisId="left" dataKey="rentPaid" fill="#059669" radius={[2, 2, 0, 0]} barSize={14} />
                             <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="balance"
                                stroke="#dc2626"
                                fill="url(#colorBalance)"
                                strokeWidth={2}
                             />
                             <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15}/>
                                   <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                          </ComposedChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                 <CardHeader className="py-3 px-4 border-b border-slate-50 bg-slate-50/30">
                    <CardTitle className="text-[11px] font-black text-slate-900">Alerts</CardTitle>
                    <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase">Early risk detection</p>
                 </CardHeader>
                 <CardContent className="px-4 py-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                       <AlertCircle className="h-5 w-5 text-emerald-500 mb-2" />
                       <p className="text-[10px] font-black text-emerald-800 text-center">No early risk signs detected.</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </section>

        {/* Tenant Files Section */}
        <section className="space-y-3">
           <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-950 tracking-tight px-1">Tenant Files</h2>
              <p className="text-[10px] text-slate-600 font-bold leading-tight px-1">Screening IDs, agreements, and matching historical records.</p>
           </div>

           <div className="flex gap-1.5 px-1 mb-1">
              <Button variant="outline" className="h-7 px-3 text-[9px] font-black border-slate-200 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50" asChild>
                 <Link href={`/documents?tenantId=${tenant.id}`}>
                    <FileText className="h-3 w-3 mr-1.5 text-blue-600" /> View all files
                 </Link>
              </Button>
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="bg-[#00a84e] hover:bg-[#008f3b] h-7 px-3 text-[9px] font-black rounded-lg shadow-md text-white border-none"
              >
                 <Upload className="h-3 w-3 mr-1.5" /> Upload document
              </Button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden">
                 <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 border-b border-slate-100 bg-slate-50/30">
                    <CardTitle className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Recent Documents</CardTitle>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">0 total</span>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="flex items-center justify-center py-14">
                       <p className="text-[10px] font-bold text-slate-400 italic">No documents are linked to this tenant profile yet.</p>
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                 <CardHeader className="py-2.5 px-4 border-b border-slate-100 bg-slate-50/30">
                    <CardTitle className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Quick Glance</CardTitle>
                    <p className="text-[8px] text-slate-500 font-black mt-0.5 uppercase">File status</p>
                 </CardHeader>
                 <CardContent className="p-3.5 space-y-2.5">
                    {[
                       { label: "TOTAL DOCUMENTS", value: "0", color: "text-slate-950" },
                       { label: "SCREENING / ID", value: "0", color: "text-emerald-700" },
                    ].map((item, i) => (
                       <div key={i} className="p-3 border border-slate-100 rounded-lg space-y-0.5 bg-white shadow-sm ring-1 ring-slate-50">
                          <p className="text-[7px] font-black text-slate-400 uppercase leading-none">{item.label}</p>
                          <p className={cn("text-xl font-black leading-none", item.color)}>{item.value}</p>
                       </div>
                    ))}
                    <div className="p-3 border border-slate-100 rounded-lg space-y-1 bg-white shadow-sm ring-1 ring-slate-50">
                       <p className="text-[7px] font-black text-slate-400 uppercase leading-none">LATEST UPLOAD</p>
                       <p className="text-[9px] font-bold text-slate-500 italic leading-none pt-1">No uploads yet</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </section>
      </div>

      <UploadDocumentDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        tenant={tenant}
      />

      <AddPaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        tenant={tenant}
        outstandingBalance={totalDue}
      />

      <AddLeaseDialog
        isOpen={isLeaseOpen}
        onClose={() => setIsLeaseOpen(false)}
        tenant={tenant}
      />

      <AssignUnitDialog
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        invoice={selectedInvoice}
        units={tenant.leases?.map((l: any) => ({ ...l.unit, property: l.unit.property })) || []}
      />
    </div>
  );
}
