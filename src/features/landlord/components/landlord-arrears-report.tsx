"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  ChevronLeftIcon,
  CalendarIcon,
  HomeIcon,
  UserIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export function LandlordArrearsReport({ data }: { data: any }) {
  const { total, buckets, items } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/financials" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Financials
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Arrears Aging Report</h1>
          <p className="text-slate-500 font-medium">Detailed breakdown of outstanding payments across your portfolio.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold border-2">
              <DownloadIcon className="h-4 w-4 mr-2" /> Export CSV
           </Button>
           <Button className="font-bold bg-blue-600 hover:bg-blue-700">Action All Overdue</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-slate-400">Total Arrears</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-black text-slate-900">KES {Number(total).toLocaleString()}</div>
           </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-emerald-600">Current</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-xl font-bold text-emerald-900">KES {Number(buckets.current).toLocaleString()}</div>
           </CardContent>
        </Card>
        <Card className="bg-orange-50/30 border-orange-100">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-orange-600">31-60 Days</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-xl font-bold text-orange-900">KES {Number(buckets["31-60"]).toLocaleString()}</div>
           </CardContent>
        </Card>
        <Card className="bg-red-50/30 border-red-100">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-red-600">61-90 Days</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-xl font-bold text-red-900">KES {Number(buckets["61-90"]).toLocaleString()}</div>
           </CardContent>
        </Card>
        <Card className="bg-red-100/50 border-red-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-red-700">90+ Days</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-xl font-black text-red-950">KES {Number(buckets["90+"]).toLocaleString()}</div>
           </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by tenant or unit..." className="pl-10 font-medium" />
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="font-bold gap-2">
               <FilterIcon className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="font-bold gap-2">
               <CalendarIcon className="h-4 w-4" /> Date Range
            </Button>
         </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Tenant & Unit</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Property</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Due Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Overdue</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Balance Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                       <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors"><UserIcon className="h-4 w-4 text-slate-600" /></div>
                       <div>
                          <p className="font-bold text-slate-900">{item.tenant}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                             <HomeIcon className="h-3 w-3" /> Unit {item.unit}
                          </p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600 italic">{item.property}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-500">
                     {format(new Date(item.dueDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                     <Badge variant={item.daysOverdue > 30 ? "destructive" : "secondary"} className="font-black">
                        {item.daysOverdue} Days
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="text-sm font-black text-slate-900 tracking-tight">KES {Number(item.balance).toLocaleString()}</div>
                    <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View Ledger</button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <div className="bg-emerald-50 p-4 rounded-full mb-4">
                            <AlertCircleIcon className="h-8 w-8 text-emerald-600" />
                         </div>
                         <h3 className="text-lg font-black text-slate-900">Portfolio fully paid</h3>
                         <p className="text-slate-500 font-medium">Great job! There are no outstanding arrears at this time.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
