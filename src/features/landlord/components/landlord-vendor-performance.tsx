"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  ChevronLeftIcon,
  StarIcon,
  CheckCircle2Icon,
  ClockIcon,
  WalletIcon,
  BarChart3Icon
} from "lucide-react";
import Link from "next/link";

export function LandlordVendorPerformance({ vendors }: { vendors: any[] }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tickets" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Performance</h1>
          <p className="text-slate-500 font-medium">Evaluating service provider efficiency and cost-effectiveness.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-indigo-100 bg-indigo-50/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase text-indigo-600">Active Vendors</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-indigo-900">{vendors.length} Providers</div>
            </CardContent>
         </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
           <div>
              <CardTitle className="text-xl font-black">Performance Matrix</CardTitle>
              <CardDescription className="text-xs font-bold uppercase">Ticket resolution and cost metrics</CardDescription>
           </div>
           <BarChart3Icon className="h-6 w-6 text-slate-300" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Vendor Name</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Tickets</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Res. Rate</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Avg Time</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Avg Cost</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                       <div className="bg-slate-100 p-2 rounded-lg text-slate-600 font-black text-xs">
                          {vendor.name[0]}
                       </div>
                       <span className="font-bold text-slate-900">{vendor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600">{vendor.ticketsAssigned}</TableCell>
                  <TableCell className="text-center">
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-slate-900">{vendor.resolutionRate}%</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${vendor.resolutionRate}%` }}></div>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex items-center justify-center gap-1 text-slate-600 font-medium">
                        <ClockIcon className="h-3 w-3" /> {vendor.avgCompletionTime}h
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex items-center justify-center gap-1 text-slate-900 font-bold">
                        <WalletIcon className="h-3 w-3 text-slate-400" /> KES {Number(vendor.avgCost).toLocaleString()}
                     </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                       <StarIcon className="h-4 w-4 text-orange-400 fill-orange-400" />
                       <span className="font-black text-slate-900">{vendor.avgRating}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vendors.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <UsersIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No vendor data</h3>
                         <p className="text-slate-500 font-medium">There is no performance data available for vendors in your portfolio.</p>
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
