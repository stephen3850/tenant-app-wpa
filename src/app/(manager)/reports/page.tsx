"use client";

import React from "react";
import {
  Search,
  FileText,
  Wallet,
  Layers,
  BarChart3,
  ArrowRight,
  TrendingDown,
  Building2,
  Home,
  ShieldCheck,
  Key,
  RefreshCw,
  Table,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Report {
  title: string;
  description: string;
  icon: any;
  tag: string;
  colorTheme: "blue" | "orange" | "green" | "red";
  href: string;
}

const reports: Report[] = [
  {
    title: "TENANT STATEMENTS",
    description: "Statement library for every tenant.",
    icon: FileText,
    tag: "Report",
    colorTheme: "blue",
    href: "/reports-tenant-statements"
  },
  {
    title: "INVOICES BY MONTH",
    description: "Month-end arrears and opening balance roll-forward.",
    icon: Layers,
    tag: "Report",
    colorTheme: "orange",
    href: "/reports-opening-balance"
  },
  {
    title: "PROPERTY REVENUE REPORT",
    description: "Choose a property and review monthly revenue totals.",
    icon: Building2,
    tag: "Report",
    colorTheme: "green",
    href: "/reports-property-revenue"
  },
  {
    title: "RETURN MANAGER",
    description: "Prepare monthly returns, deductions, approvals, and payout vouchers from the business account.",
    icon: Briefcase,
    tag: "Report",
    colorTheme: "green",
    href: "/reports-returns"
  },
  {
    title: "EXPENSE REPORT",
    description: "Review expense totals, filters, and category breakdowns.",
    icon: TrendingDown,
    tag: "Report",
    colorTheme: "red",
    href: "/reports-expenses"
  },
  {
    title: "OCCUPANCY REPORT",
    description: "Occupancy snapshot by date, property, and unit.",
    icon: Home,
    tag: "Report",
    colorTheme: "blue",
    href: "/reports-occupancy"
  },
  {
    title: "RENT COLLECTION REPORT",
    description: "Balance-affecting collections grouped by bank, service, property, and unit. Payments by Month (Service).",
    icon: Wallet,
    tag: "Report",
    colorTheme: "blue",
    href: "/reports-rent-collections"
  },
  {
    title: "PAYMENTS BY BANK",
    description: "Bank performance and inflows.",
    icon: Building2,
    tag: "Report",
    colorTheme: "green",
    href: "/reports-bank-payments"
  },
  {
    title: "TENANT BALANCES",
    description: "Outstanding vs prepaid tenants by branch/property.",
    icon: Table,
    tag: "Report",
    colorTheme: "red",
    href: "/reports-tenant-balances"
  },
  {
    title: "ANALYTICS DASHBOARD",
    description: "Visual KPIs and insights.",
    icon: BarChart3,
    tag: "Featured",
    colorTheme: "green",
    href: "/reports-analytics"
  },
  {
    title: "SECURITY DEPOSITS",
    description: "Single view: missing vs unrefunded deposits.",
    icon: ShieldCheck,
    tag: "Report",
    colorTheme: "red",
    href: "/reports-security-deposits"
  },
  {
    title: "VACANT UNITS + OPEN LEASES",
    description: "Units marked vacant but lease not ended yet.",
    icon: Home,
    tag: "Report",
    colorTheme: "green",
    href: "/reports-vacant-units"
  },
  {
    title: "RENT-TO-OWN REPORT",
    description: "Track purchase price, paid installments, balance, and ownership readiness.",
    icon: Key,
    tag: "Report",
    colorTheme: "green",
    href: "/reports-rent-to-own"
  },
  {
    title: "TENANT MOVEMENT REPORT",
    description: "New tenants, vacated tenants, and units/shop movement by period.",
    icon: RefreshCw,
    tag: "Report",
    colorTheme: "orange",
    href: "/reports-tenant-movement"
  }
];

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500 bg-[#F5F7FA]">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 flex justify-between items-center shadow-sm">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#56A600]">INSIGHTS</p>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">Reports</h1>
          <p className="text-[11px] font-medium text-[#667085]">Quick access to summary reports and dashboards.</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-[0.1em]">AVAILABLE</p>
          <p className="text-3xl font-black text-[#111827] leading-none">{reports.length}</p>
        </div>
      </div>

      {/* Core Reconciliation Section */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
             <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#98A2B3]">EXCEL REPLACEMENT</p>
             <h2 className="text-lg font-black text-[#111827]">Core reconciliation reports</h2>
             <p className="text-[11px] font-medium text-[#667085]">Start here when you need to filter, drill into balances, and reconcile before downloading.</p>
          </div>
          <div className="w-full lg:w-72 space-y-1">
            <p className="text-[9px] font-bold text-[#1F2937] uppercase">Find a report</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#98A2B3]" />
              <Input
                placeholder="Search reports..."
                className="pl-9 h-9 border-gray-200 rounded-md text-[11px] bg-white focus:ring-1 focus:ring-[#56A600]/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <Link href="/reports-tenant-statements" className="block">
            <QuickLinkCard
              title="Tenant statements"
              description="Tenant row balances and statements"
              icon={FileText}
            />
          </Link>
          <Link href="/reports-rent-collections" className="block">
            <QuickLinkCard
              title="Rent collections"
              description="Bank, service, property, and unit payments"
              icon={RefreshCw}
            />
          </Link>
          <Link href="/reports-opening-balance" className="block">
            <QuickLinkCard
              title="Opening balance"
              description="Month-end roll-forward and detail"
              icon={Layers}
            />
          </Link>
          <Link href="/reports-analytics" className="block">
            <QuickLinkCard
              title="Analytics"
              description="Date-range KPIs and drill-downs"
              icon={BarChart3}
            />
          </Link>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.title} report={report} />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <Search className="h-6 w-6 text-[#98A2B3] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#1F2937]">No reports found</h3>
        </div>
      )}
    </div>
  );
}

function QuickLinkCard({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#DCE3EA] hover:border-[#56A600]/30 hover:bg-white transition-all cursor-pointer group shadow-sm bg-[#F9FAFB]/50">
      <div className="mt-0.5">
        <Icon className="h-3.5 w-3.5 text-green-600" />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-[#111827] group-hover:text-[#56A600] transition-colors uppercase tracking-tight">{title}</h4>
        <p className="text-[9px] font-medium text-[#98A2B3] mt-0.5 leading-tight">{description}</p>
      </div>
    </div>
  );
}

const themeStyles = {
  blue: { tag: "bg-blue-600", button: "border-blue-600 text-blue-600 hover:bg-blue-50" },
  orange: { tag: "bg-orange-500", button: "border-orange-500 text-orange-500 hover:bg-orange-50" },
  green: { tag: "bg-[#56A600]", button: "border-[#56A600] text-[#56A600] hover:bg-green-50" },
  red: { tag: "bg-rose-600", button: "border-rose-600 text-rose-600 hover:bg-rose-50" }
};

function ReportCard({ report }: { report: Report }) {
  const styles = themeStyles[report.colorTheme];

  return (
    <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 bg-green-50 rounded-full flex items-center justify-center">
          <report.icon className="h-4 w-4 text-[#56A600]" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[10px] font-black text-[#111827] uppercase tracking-tight">{report.title}</h3>
          <p className="text-[10px] font-medium text-[#667085] leading-snug">
            {report.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <span className={cn(
          "px-2 py-0.5 rounded-[3px] text-[8px] font-black text-white uppercase tracking-widest",
          styles.tag
        )}>
          {report.tag}
        </span>
        <Link
          href={report.href}
          className={cn(
            "flex items-center gap-1 px-4 py-1.5 rounded-lg border text-[11px] font-bold transition-all",
            styles.button
          )}
        >
          Open <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
