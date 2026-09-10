"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  WrenchIcon,
  AlertTriangleIcon,
  ClockIcon,
  CheckCircle2Icon,
  WalletIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  BarChart3Icon,
  UsersIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function LandlordMaintenanceDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Oversight</h1>
          <p className="text-slate-500 font-medium italic">Operational status and maintenance efficiency across your portfolio.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold border-2" asChild>
            <Link href="/landlord/tickets/tickets">
              View All Tickets
            </Link>
          </Button>
          <Button className="font-bold bg-blue-600 hover:bg-blue-700" asChild>
             <Link href="/landlord/tickets/analytics">
                <BarChart3Icon className="h-4 w-4 mr-2" /> Cost Analysis
             </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Open Tickets</CardTitle>
            <WrenchIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{data.openTickets}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Awaiting attention</p>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-600">Emergencies</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-700">{data.emergencyTickets}</div>
            {data.emergencyTickets > 0 && (
               <Badge variant="destructive" className="mt-1 animate-pulse text-[8px] h-4">Immediate Action Required</Badge>
            )}
            {data.emergencyTickets === 0 && (
               <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">All clear</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg Resolution</CardTitle>
            <ClockIcon className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{data.avgResolutionTime} hrs</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Efficiency metric</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Spend (MTD)</CardTitle>
            <WalletIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-900">KES {Number(data.maintenanceSpend).toLocaleString()}</div>
            <p className="text-[10px] font-bold text-emerald-600/60 uppercase mt-1 flex items-center gap-1">
               <TrendingUpIcon className="h-3 w-3" /> Within budget
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black text-slate-900">Priority Tickets</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase text-slate-500">Active High-Priority Issues</CardDescription>
               </div>
               <Button variant="ghost" size="sm" className="font-bold text-blue-600" asChild>
                  <Link href="/landlord/tickets/tickets">View All <ArrowRightIcon className="h-4 w-4 ml-1" /></Link>
               </Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                  {/* Sample rows, in real app would pass recent/priority tickets */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-2 rounded-lg"><AlertTriangleIcon className="h-4 w-4 text-red-600" /></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Main Pipe Burst - Unit 402</p>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Property Alpha • Plumbing</p>
                        </div>
                     </div>
                     <Badge className="bg-orange-500 font-black">IN PROGRESS</Badge>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-2 rounded-lg"><AlertTriangleIcon className="h-4 w-4 text-orange-600" /></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Elevator Malfunction</p>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skyline Plaza • Lift</p>
                        </div>
                     </div>
                     <Badge className="bg-blue-500 font-black">ASSIGNED</Badge>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-8">
            <Card className="border-indigo-100 bg-indigo-50/10">
               <CardHeader>
                  <CardTitle className="text-lg font-black text-indigo-900 flex items-center gap-2">
                     <UsersIcon className="h-5 w-5" /> Top Vendors
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-600 uppercase">Ace Plumbing</span>
                     <Badge variant="outline" className="font-black border-indigo-200 text-indigo-700">98% Res.</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-600 uppercase">PowerGrid Elec.</span>
                     <Badge variant="outline" className="font-black border-indigo-200 text-indigo-700">92% Res.</Badge>
                  </div>
                  <Button variant="ghost" className="w-full font-bold text-blue-600 mt-2 h-8" asChild>
                     <Link href="/landlord/tickets/vendors">Full Performance Report</Link>
                  </Button>
               </CardContent>
            </Card>

            <Card className="border-slate-200">
               <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-black text-slate-900">Efficiency Insights</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-slate-500 uppercase">Resolved MTD</span>
                     <span className="text-slate-900">{data.resolvedMTD} Tickets</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                     <span className="text-slate-500 uppercase">In Progress</span>
                     <span className="text-slate-900">{data.inProgressTickets} Tickets</span>
                  </div>
                  <div className="pt-2 border-t border-slate-50">
                     <p className="text-[10px] font-medium text-slate-500 italic">
                        Resolution time has improved by 4.5 hours compared to last month.
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
