"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  DownloadIcon,
  PrinterIcon,
  ChevronLeftIcon,
  BuildingIcon,
  CalendarIcon,
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowRightIcon,
  CheckCircle2Icon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export function OwnerStatementDetails({ statement }: { statement: any }) {
  if (!statement) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/financials/statements" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Statements
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Statement {statement.statementNumber}</h1>
             <Badge className="bg-emerald-500">{statement.status}</Badge>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> {format(new Date(statement.startDate), "MMMM dd")} - {format(new Date(statement.endDate), "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold border-2">
              <PrinterIcon className="h-4 w-4 mr-2" /> Print
           </Button>
           <Button className="font-bold bg-blue-600 hover:bg-blue-700">
              <DownloadIcon className="h-4 w-4 mr-2" /> Download PDF
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200 shadow-md">
           <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-xl font-black">Statement Summary</CardTitle>
                 <CardDescription className="text-xs font-bold uppercase">Financial activity for this period</CardDescription>
              </div>
              <BuildingIcon className="h-6 w-6 text-slate-300" />
           </CardHeader>
           <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening Balance</p>
                       <p className="text-xl font-bold text-slate-900">KES {Number(statement.openingBalance).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                          <TrendingUpIcon className="h-3 w-3" /> Total Revenue
                       </p>
                       <p className="text-xl font-bold text-emerald-700">+ KES {Number(statement.revenue).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-right">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center justify-end gap-1">
                          <TrendingDownIcon className="h-3 w-3" /> Total Expenses
                       </p>
                       <p className="text-xl font-bold text-red-700">- KES {Number(statement.expenses).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-end gap-1">
                          Owner Drawings
                       </p>
                       <p className="text-xl font-bold text-indigo-700">- KES {Number(statement.disbursements).toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Closing Balance (Net Payout)</p>
                    <p className="text-3xl font-black tracking-tight">KES {Number(statement.closingBalance).toLocaleString()}</p>
                 </div>
                 <div className="bg-emerald-500/20 p-3 rounded-full">
                    <CheckCircle2Icon className="h-8 w-8 text-emerald-400" />
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Revenue Breakdown</h4>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                       <span>Rent Collection</span>
                       <span className="font-bold text-slate-900">KES {Number(statement.revenue * 0.95).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                       <span>Utility Recoveries</span>
                       <span className="font-bold text-slate-900">KES {Number(statement.revenue * 0.05).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="border-blue-100 bg-blue-50/10">
              <CardHeader>
                 <CardTitle className="text-lg font-black text-blue-900">Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Payment Method</p>
                    <p className="text-sm font-bold text-slate-900">Direct Bank Transfer</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Bank Account</p>
                    <p className="text-sm font-bold text-slate-900">**** 4922 (KCB Bank)</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Processed Date</p>
                    <p className="text-sm font-bold text-slate-900">{format(new Date(statement.generatedAt), "MMMM dd, yyyy")}</p>
                 </div>
                 <Button variant="outline" className="w-full font-bold border-blue-200 text-blue-700 hover:bg-blue-50">
                    Update Payment Method
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-slate-200">
              <CardHeader>
                 <CardTitle className="text-lg font-black text-slate-900">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    If you have any questions regarding your statement breakdown, please contact our financial department.
                 </p>
                 <Button variant="ghost" className="w-full font-bold text-blue-600 flex items-center gap-2">
                    Open Ticket <ArrowRightIcon className="h-4 w-4" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white ${className}`}>
      {children}
    </span>
  );
}
