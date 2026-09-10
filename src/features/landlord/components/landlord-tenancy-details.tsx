"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  KeyIcon,
  ChevronLeftIcon,
  CalendarIcon,
  BuildingIcon,
  HomeIcon,
  UserIcon,
  WalletIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  PhoneIcon,
  MailIcon,
  FileTextIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

export function LandlordTenancyDetails({ lease }: { lease: any }) {
  if (!lease) return null;

  const totalArrears = lease.invoices.reduce((acc: Prisma.Decimal, inv: any) => acc.plus(inv.balanceDue), new Prisma.Decimal(0));
  const hasArrears = totalArrears.gt(0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tenancies" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Tenancies
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lease {lease.leaseNumber}</h1>
             <Badge className="bg-emerald-500 font-black uppercase tracking-widest">{lease.status}</Badge>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <BuildingIcon className="h-4 w-4" /> {lease.property.propertyName} • Unit {lease.unit.unitNumber}
          </p>
        </div>
        <Button variant="outline" className="font-bold border-2" asChild>
           <Link href="/landlord/financials/arrears">
              <AlertTriangleIcon className="h-4 w-4 mr-2 text-orange-500" /> View Standing
           </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-xl font-black">Lease Summary</CardTitle>
                       <CardDescription className="text-xs font-bold uppercase">Contractual terms and duration</CardDescription>
                    </div>
                    <FileTextIcon className="h-6 w-6 text-slate-300" />
                 </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <div className="bg-blue-50 p-2.5 rounded-xl"><CalendarIcon className="h-5 w-5 text-blue-600" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                             <p className="font-bold text-slate-900">
                                {format(new Date(lease.startDate), "MMMM dd, yyyy")} - {lease.endDate ? format(new Date(lease.endDate), "MMMM dd, yyyy") : "Present"}
                             </p>
                             <p className="text-xs font-bold text-slate-500 mt-0.5">Renewed 2 times</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="bg-indigo-50 p-2.5 rounded-xl"><WalletIcon className="h-5 w-5 text-indigo-600" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                             <p className="text-xl font-black text-slate-900">KES {Number(lease.monthlyRent).toLocaleString()}</p>
                             <p className="text-xs font-bold text-slate-500 mt-0.5">Includes service charge</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <div className="bg-emerald-50 p-2.5 rounded-xl"><ShieldCheckIcon className="h-5 w-5 text-emerald-600" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Deposit</p>
                             <p className="font-bold text-slate-900">KES {Number(lease.securityDeposit).toLocaleString()}</p>
                             <p className="text-xs font-bold text-emerald-600 mt-0.5">Held in Escrow</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="bg-slate-50 p-2.5 rounded-xl"><HomeIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Classification</p>
                             <p className="font-bold text-slate-900">{lease.unit.unitType}</p>
                             <p className="text-xs font-bold text-slate-500 mt-0.5">{lease.property.address}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <Separator className="bg-slate-100" />

                 <div className={hasArrears ? "bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm" : "bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm"}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={hasArrears ? "bg-white p-3 rounded-full shadow-sm text-red-600" : "bg-white p-3 rounded-full shadow-sm text-emerald-600"}>
                             {hasArrears ? <AlertTriangleIcon className="h-6 w-6" /> : <ShieldCheckIcon className="h-6 w-6" />}
                          </div>
                          <div>
                             <p className={hasArrears ? "text-[10px] font-black text-red-600 uppercase tracking-widest" : "text-[10px] font-black text-emerald-600 uppercase tracking-widest"}>
                                {hasArrears ? "Payment Warning" : "Excellent Standing"}
                             </p>
                             <p className="text-lg font-black text-slate-900 tracking-tight">
                                {hasArrears ? `Arrears of KES ${totalArrears.toLocaleString()}` : "Tenant is fully current"}
                             </p>
                          </div>
                       </div>
                       {!hasArrears && <Badge className="bg-emerald-500 font-black uppercase">CURRENT</Badge>}
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-slate-200 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-slate-400" /> Tenant Profile
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="flex flex-col items-center text-center pb-2">
                    <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 mb-4 border-2 border-white shadow-md">
                       {lease.tenant.firstName[0]}{lease.tenant.lastName[0]}
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{lease.tenant.firstName} {lease.tenant.lastName}</h3>
                    <Badge variant="outline" className="mt-1 font-bold border-slate-300 text-slate-500 uppercase">{lease.tenant.status}</Badge>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                       <MailIcon className="h-4 w-4 text-slate-400" />
                       <p className="text-sm font-bold text-slate-700">{lease.tenant.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <PhoneIcon className="h-4 w-4 text-slate-400" />
                       <p className="text-sm font-bold text-slate-700">{lease.tenant.phone}</p>
                    </div>
                 </div>

                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Privacy Notice</p>
                    <p className="text-[11px] font-medium text-blue-900/70 leading-relaxed">
                       Personal identification and sensitive documents are restricted to management only for data protection compliance.
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
