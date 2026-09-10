"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart3Icon,
  DownloadIcon,
  ChevronLeftIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function LandlordCashFlowReport({ data }: { data: any[] }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/financials" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Financials
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cash Flow Trends</h1>
          <p className="text-slate-500 font-medium">Monthly analysis of inflows, outflows, and net positions.</p>
        </div>
        <Button className="font-bold bg-blue-600 hover:bg-blue-700">
           <DownloadIcon className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black">Monthly Performance</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase">Cash Inflow vs Outflow</CardDescription>
               </div>
               <BarChart3Icon className="h-6 w-6 text-slate-300" />
            </CardHeader>
            <CardContent className="h-[400px] bg-white p-8 flex items-end justify-around gap-4">
               {data.map((month: any, idx: number) => {
                  const maxVal = Math.max(...data.map((m: any) => Math.max(Number(m.inflow), Number(m.outflow))));
                  const inflowHeight = (Number(month.inflow) / maxVal) * 100;
                  const outflowHeight = (Number(month.outflow) / maxVal) * 100;

                  return (
                     <div key={idx} className="flex-1 flex flex-col items-center group">
                        <div className="w-full flex justify-center gap-1 items-end h-[280px]">
                           <div
                              className="w-1/3 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative"
                              style={{ height: `${inflowHeight}%` }}
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-black">
                                 IN: {Number(month.inflow).toLocaleString()}
                              </div>
                           </div>
                           <div
                              className="w-1/3 bg-red-400 rounded-t-md hover:bg-red-500 transition-all cursor-pointer relative"
                              style={{ height: `${outflowHeight}%` }}
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-black">
                                 OUT: {Number(month.outflow).toLocaleString()}
                              </div>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mt-4 rotate-45 lg:rotate-0">
                           {format(new Date(month.month), "MMM")}
                        </p>
                     </div>
                  );
               })}
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="border-emerald-100 bg-emerald-50/10">
               <CardHeader>
                  <CardTitle className="text-lg font-black text-emerald-900">Portfolio Health</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Inflow</p>
                     <p className="text-2xl font-black text-slate-900">
                        KES {(data.reduce((acc, m) => acc + Number(m.inflow), 0) / data.length).toLocaleString()}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Net</p>
                     <p className="text-2xl font-black text-emerald-600">
                        KES {(data.reduce((acc, m) => acc + Number(m.net), 0) / data.length).toLocaleString()}
                     </p>
                  </div>
                  <div className="pt-4 border-t border-emerald-100">
                     <div className="flex items-center gap-2 text-emerald-700">
                        <TrendingUpIcon className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase">Positive Trend</span>
                     </div>
                     <p className="text-[10px] text-emerald-600/70 font-medium mt-1">
                        Your net cash position has improved by 8% over the last 6 months.
                     </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-slate-200">
               <CardHeader>
                  <CardTitle className="text-lg font-black text-slate-900">Cash Flow Tips</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Optimize Returns</p>
                     <p className="text-[11px] font-medium text-slate-600 leading-tight">
                        Review utility recoveries for Property B. Current collection rate is 15% below market average.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[10px] font-black text-red-600 uppercase mb-1">Expense Alert</p>
                     <p className="text-[11px] font-medium text-slate-600 leading-tight">
                        Maintenance spend increased by 22% this month due to elevator repairs at Property A.
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Month</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Total Inflow</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-red-600">Total Outflow</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-blue-600 text-right pr-6">Net Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((month: any, idx: number) => (
                <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 font-black text-slate-900 uppercase">
                    {format(new Date(month.month), "MMMM yyyy")}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-600">
                    KES {Number(month.inflow).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-red-600">
                    KES {Number(month.outflow).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                       <span className="font-black text-slate-900">KES {Number(month.net).toLocaleString()}</span>
                       {Number(month.net) >= 0 ? <ArrowUpIcon className="h-4 w-4 text-emerald-500" /> : <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
