"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3Icon,
  ChevronLeftIcon,
  WalletIcon,
  PieChartIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  AlertTriangleIcon
} from "lucide-react";
import Link from "next/link";

export function LandlordMaintenanceAnalytics({ data }: { data: any }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tickets" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Analytics</h1>
          <p className="text-slate-500 font-medium">Detailed cost analysis and spend distribution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-emerald-100 bg-emerald-50/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase text-emerald-600">Total Maintenance Spend</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-emerald-900">KES {Number(data.totalSpend).toLocaleString()}</div>
               <p className="text-xs font-bold text-emerald-700/60 mt-1 uppercase flex items-center gap-1">
                  <TrendingUpIcon className="h-3 w-3" /> YTD Cumulative
               </p>
            </CardContent>
         </Card>
         <Card className="border-blue-100 bg-blue-50/10">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase text-blue-600">Avg Cost per Ticket</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-blue-900">KES {Number(data.avgCostPerTicket).toLocaleString()}</div>
               <p className="text-xs font-bold text-blue-700/60 mt-1 uppercase">Operational efficiency</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-xl font-black">Spend by Category</CardTitle>
               <CardDescription className="text-xs font-bold uppercase">Distribution of maintenance costs</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
               <div className="space-y-4">
                  {data.byCategory.map((cat: any, idx: number) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-600">{cat.name}</span>
                           <span className="text-slate-900">KES {Number(cat.value).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${(Number(cat.value) / Number(data.totalSpend)) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-xl font-black">Spend by Property</CardTitle>
               <CardDescription className="text-xs font-bold uppercase">Cost allocation across portfolio</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
               <div className="space-y-4">
                  {data.byProperty.map((prop: any, idx: number) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-600">{prop.name}</span>
                           <span className="text-slate-900">KES {Number(prop.value).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${(Number(prop.value) / Number(data.totalSpend)) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      <Card className="border-orange-100 bg-orange-50/10">
         <CardHeader>
            <CardTitle className="text-lg font-black text-orange-900 flex items-center gap-2">
               <AlertTriangleIcon className="h-5 w-5" /> High-Cost Alerts & Trends
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex items-start gap-4">
               <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><TrendingUpIcon className="h-5 w-5" /></div>
               <div>
                  <h4 className="font-bold text-slate-900">Repeated Plumbing Issues - Property Alpha</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                     Unit 102 and 205 have reported plumbing leaks 3 times in the last 60 days. Recommendation: Full inspection of the vertical stack.
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
