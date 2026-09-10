"use client";

import { FinancialKpiCard } from "./financial-kpi-card";
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  PieChartIcon,
  ArrowRightIcon,
  DownloadIcon,
  CalendarIcon,
  BriefcaseIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LandlordFinancialDashboard({ data }: { data: any }) {
  const { revenue, expenses, noi, disbursements, arrears, ownerBalance } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 font-medium italic">Executive summary of your portfolio performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold border-2" asChild>
            <Link href="/landlord/financials/statements">
              <DownloadIcon className="h-4 w-4 mr-2" /> Owner Statements
            </Link>
          </Button>
          <Button className="font-bold bg-blue-600 hover:bg-blue-700" asChild>
             <Link href="/landlord/financials/disbursements">
                <BriefcaseIcon className="h-4 w-4 mr-2" /> Disbursement Request
             </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialKpiCard
          title="Gross Revenue (MTD)"
          value={revenue.mtd}
          trend={{ value: 12, isUp: true }}
          description="vs Previous Month"
          icon={<TrendingUpIcon className="h-5 w-5 text-emerald-600" />}
        />
        <FinancialKpiCard
          title="Total Expenses (MTD)"
          value={expenses.mtd}
          trend={{ value: 5, isUp: false }}
          description="vs Previous Month"
          icon={<TrendingDownIcon className="h-5 w-5 text-red-600" />}
        />
        <FinancialKpiCard
          title="Net Operating Income"
          value={noi.mtd}
          description="Current Month"
          icon={<WalletIcon className="h-5 w-5 text-blue-600" />}
          className="border-blue-200 bg-blue-50/10"
        />
        <FinancialKpiCard
          title="Owner Balance"
          value={ownerBalance}
          description="Available for disbursement"
          icon={<DollarSignIcon className="h-5 w-5 text-indigo-600" />}
          className="border-indigo-200 bg-indigo-50/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Revenue Trends</CardTitle>
              <CardDescription className="text-xs font-bold uppercase text-slate-500">Last 6 Months Inflows vs Outflows</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="font-bold text-blue-600" asChild>
              <Link href="/landlord/financials/cash-flow">View Full Report <ArrowRightIcon className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-white">
            <div className="flex flex-col items-center text-slate-400">
               <PieChartIcon className="h-12 w-12 mb-4 opacity-20" />
               <p className="font-bold text-sm">Visualizing Financial Performance...</p>
               <p className="text-[10px] uppercase tracking-widest font-black opacity-60">Interactive charts powered by RentalDesk Engine</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-red-100 bg-red-50/10">
            <CardHeader>
              <CardTitle className="text-lg font-black text-red-900">Arrears Aging</CardTitle>
              <CardDescription className="text-xs font-bold text-red-700/60 uppercase">Impact on cash flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-black text-red-600">KES {Number(arrears).toLocaleString()}</div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500 uppercase">Current</span>
                    <span className="text-slate-900">45%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: "45%" }}></div>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500 uppercase">31-60 Days</span>
                    <span className="text-slate-900">30%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: "30%" }}></div>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500 uppercase">90+ Days</span>
                    <span className="text-slate-900">25%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: "25%" }}></div>
                 </div>
              </div>
              <Button variant="outline" className="w-full font-bold border-red-200 text-red-600 hover:bg-red-50" asChild>
                <Link href="/landlord/financials/arrears">View Aging Report</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">Recent Disbursements</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                     <div>
                        <p className="text-xs font-bold text-slate-900">#DISB-8291</p>
                        <p className="text-[10px] text-slate-500">June 12, 2026</p>
                     </div>
                     <p className="text-sm font-black text-emerald-600">KES 450,000</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                     <div>
                        <p className="text-xs font-bold text-slate-900">#DISB-8144</p>
                        <p className="text-[10px] text-slate-500">May 15, 2026</p>
                     </div>
                     <p className="text-sm font-black text-emerald-600">KES 420,000</p>
                  </div>
               </div>
               <Button variant="ghost" className="w-full font-bold text-blue-600 mt-4 h-8" asChild>
                 <Link href="/landlord/financials/disbursements">Full History</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
