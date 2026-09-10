import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  FileText,
  Search,
  Filter,
  Download,
  X,
  TrendingUp,
  Users,
  Building2,
  ChevronRight,
  Info,
  LayoutDashboard,
  FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RentCollectionsReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties for the filter
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true }
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-3 lg:p-4 space-y-3 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-[#64748B] uppercase tracking-[0.2em]">COLLECTION REPORT</p>
          <h1 className="text-lg font-black text-[#1E293B] tracking-tight">Collections by Month</h1>
          <p className="text-[10px] font-medium text-[#64748B]">Rent, deposits, and other collections summarized by period.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" className="h-7 px-2.5 text-[#1E293B] font-bold text-[9px] bg-[#1E293B]/5 rounded-lg gap-1 uppercase">
            <LayoutDashboard className="h-2.5 w-2.5" />
            Dashboard
          </Button>
          <Button className="h-7 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[9px] gap-1 uppercase">
            Invoice Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <CollectionStatCard label="TOTAL COLLECTED" value="0.00" subValue="Across all bank feeds." />
        <CollectionStatCard label="BANKS COVERED" value="0" subValue="Active summarized feeds." />
        <CollectionStatCard label="PEAK MONTH" value="N/A" subValue="No collection data." />
        <CollectionStatCard label="DEPOSIT POOL" value="0.00" subValue="Total deposits received." />
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
          <FilterSelect label="Year" defaultValue="2026" options={["2024", "2025", "2026"]} />
          <FilterSelect label="Bank" defaultValue="all" options={["All"]} />
          <FilterSelect label="Service" defaultValue="all" options={["All"]} />
          <FilterSelect label="Property" defaultValue="all" options={["All", ...properties.map(p => p.propertyName)]} />
          <FilterSelect label="Unit" defaultValue="all" options={["All"]} />

          <div className="flex items-end gap-1.5 md:col-span-2 lg:col-span-1 xl:col-span-2">
             <Button className="h-7 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[9px] uppercase">
               Apply
             </Button>
             <Button variant="outline" className="h-7 px-3 rounded-lg border-[#1E293B] bg-[#1E293B] text-white hover:bg-black font-bold text-[9px] uppercase">
               Excel
             </Button>
             <Button variant="outline" className="h-7 px-3 rounded-lg border-[#1E293B] bg-[#1E293B] text-white hover:bg-black font-bold text-[9px] uppercase">
               PDF
             </Button>
          </div>
        </div>
      </div>

      {/* Workbench Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#F1F5F9] space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-[#64748B] uppercase tracking-[0.15em]">EXCEL REPLACEMENT</p>
              <h2 className="text-base font-black text-[#1E293B] tracking-tight">Collections reconciliation workbench</h2>
              <p className="text-[10px] font-medium text-[#64748B] max-w-2xl leading-relaxed">
                Filter inflow by year and unit, then drill into matching ledger or balance reports.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 self-start bg-[#F9FAFB] rounded-lg border border-[#F2F4F7]">
               <TabLink label="Payment ledger" active color="blue" href="/reports-rent-collections" />
               <TabLink label="Tenant statements" color="black" href="/reports-tenant-statements" />
               <TabLink label="Opening roll-forward" color="orange" href="/reports-opening-balance" />
               <TabLink label="Analytics" color="green" href="/reports-analytics" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <StatCard label="COLLECTED" value="KES 0.00" valueColor="text-[#10B981]" />
            <StatCard label="BANKS" value="0" />
            <StatCard label="PEAK MONTH" value="N/A" />
            <StatCard label="PEAK VALUE" value="KES 0.00" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-1">
            <div className="space-y-1.5">
               <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">ACTIVE FILTERS</p>
               <Badge className="bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0] px-1.5 py-0 rounded-md text-[9px] font-bold flex items-center gap-1 shadow-none">
                 Year: 2026
                 <X className="h-2 w-2 cursor-pointer" />
               </Badge>
            </div>

            <div className="space-y-0.5 lg:text-right">
              <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">RECONCILIATION FORMULA</p>
              <p className="text-[10px] font-bold text-[#475569]">Total = approved balance-affecting payments by month.</p>
            </div>

            <div className="space-y-0.5 lg:text-right max-w-xs">
              <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">DRILL-DOWN CHECKS</p>
              <p className="text-[9px] font-medium text-[#64748B] leading-relaxed">
                Use View Payments to inspect receipts. Compare against opening balance before downloading.
              </p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto p-4 bg-[#F8FAFC]">
          <div className="mb-4 px-1">
             <h3 className="text-sm font-black text-[#1E293B]">Grand Total</h3>
             <p className="text-[10px] font-medium text-[#64748B]">Aggregate inflow across every bank.</p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#F1F5F9]">
                <th className="px-3 py-2 text-[9px] font-black text-[#667085] uppercase tracking-wider text-left">Month</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#667085] uppercase tracking-wider text-left">All Banks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {months.map((month) => (
                <tr key={month} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-3 py-2 text-[10px] font-bold text-[#1E293B]">{month}</td>
                  <td className="px-3 py-2 text-[10px] font-medium text-[#1E293B]">0.00</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-[#1E293B] text-white font-black">
                  <td className="px-3 py-2.5 text-[10px] uppercase tracking-wider">Total</td>
                  <td className="px-3 py-2.5 text-[10px]">0.00</td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function CollectionStatCard({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-0.5">
      <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-black text-[#1E293B] tracking-tight">{value}</h3>
      <p className="text-[9px] font-medium text-[#94A3B8]">{subValue}</p>
    </div>
  );
}

function FilterSelect({ label, defaultValue, options }: { label: string; defaultValue: string; options: string[] }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[9px] font-black text-[#64748B] uppercase tracking-wider">{label}</label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="h-7 text-[10px] border-[#E2E8F0] rounded-lg px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt.toLowerCase()} className="text-[10px]">{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TabLink({ label, active = false, color = "blue", href }: { label: string; active?: boolean; color?: string; href: string }) {
  const colorStyles: any = {
    blue: active ? "border-[#3B82F6] text-[#3B82F6] bg-white shadow-sm" : "border-transparent text-[#64748B] hover:text-[#3B82F6]",
    orange: active ? "border-[#F59E0B] text-[#F59E0B] bg-white shadow-sm" : "border-transparent text-[#64748B] hover:text-[#F59E0B]",
    green: active ? "border-[#10B981] text-[#10B981] bg-white shadow-sm" : "border-transparent text-[#64748B] hover:text-[#10B981]",
    black: active ? "border-[#1E293B] text-[#1E293B] bg-white shadow-sm" : "border-transparent text-[#64748B] hover:text-[#1E293B]"
  };

  return (
    <Link href={href} className={cn(
      "px-3 py-1 rounded-md text-[9px] font-black transition-all border shadow-none",
      active ? "border-[#E2E8F0]" : "border-transparent opacity-80 hover:opacity-100",
      colorStyles[color]
    )}>
      {label}
    </Link>
  );
}

function StatCard({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F9FAFB]/50 space-y-1 shadow-sm">
      <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-[0.1em]">{label}</p>
      <h3 className={cn("text-base font-black tracking-tight", valueColor)}>{value}</h3>
    </div>
  );
}
