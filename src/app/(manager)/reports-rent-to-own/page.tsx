import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  MoreHorizontal,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RentToOwnReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties for filter
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true }
  });

  const agreements: any[] = [];

  const stats = {
    agreements: agreements.length,
    purchaseValue: 0,
    paidTowardPurchase: 0,
    remainingBalance: 0,
    readyForConversion: 0
  };

  return (
    <div className="p-3 lg:p-4 space-y-3 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section Container */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Rent-to-own report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">
            Purchase progress, paid installments, remaining balance, and owner conversion readiness.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-8 px-3 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm" asChild>
            <Link href="/reports">
              <ArrowLeft className="h-3 w-3" />
              Back to Reports
            </Link>
          </Button>
          <Button className="h-8 px-3 rounded-lg bg-[#28a745] hover:bg-[#218838] text-white font-bold text-[10px] gap-1.5 shadow-sm">
            <FileSpreadsheet className="h-3 w-3" />
            Export Excel
          </Button>
          <Button variant="outline" className="h-8 px-3 rounded-lg border-[#dc3545] text-[#dc3545] font-bold text-[10px] gap-1.5 shadow-sm hover:bg-rose-50">
            <FileText className="h-3 w-3" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="AGREEMENTS" value={stats.agreements.toString()} />
        <StatCard label="PURCHASE VALUE" value={`KES ${stats.purchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <StatCard label="PAID TOWARD PURCHASE" value={`KES ${stats.paidTowardPurchase.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} valueColor="text-[#12B76A]" />
        <StatCard
          label="REMAINING BALANCE"
          value={`KES ${stats.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          valueColor="text-rose-600"
          subValue={`${stats.readyForConversion} ready for conversion`}
        />
      </div>

      {/* Filters Card Container */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Property</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-white">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Status</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DEFAULTED">Defaulted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#94A3B8]" />
              <Input
                placeholder="Tenant, property, or unit"
                className="pl-8 h-8 text-[11px] font-medium border-[#E2E8F0] rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-8 px-6 bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-[11px] rounded-lg shadow-sm gap-2 uppercase tracking-tight">
            <Filter className="h-3 w-3 fill-white" />
            Apply
          </Button>
          <Button variant="outline" className="h-8 px-6 border-[#E2E8F0] text-[#1E293B] font-black text-[11px] rounded-lg shadow-sm uppercase">
            Reset
          </Button>
        </div>
      </div>

      {/* Main Table Section Container */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col min-h-[250px]">
        <div className="p-3 border-b border-[#F1F5F9] flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">RENT-TO-OWN AGREEMENTS</p>
            <p className="text-[11px] font-medium text-[#64748B]">Each row shows current purchase progress and conversion readiness.</p>
          </div>
          <div className="bg-[#F1F5F9] px-2 py-1 rounded text-[10px] font-black text-[#1E293B]">
            {agreements.length} found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Tenant</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Property / Unit</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Status</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Purchase price</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Deposit paid</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Installments paid</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Remaining</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Next due</th>
                <th className="px-4 py-1.5 text-[9px] font-black text-[#64748B] uppercase tracking-tight text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {agreements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1.5 opacity-60">
                      <Key className="h-6 w-6 text-[#94A3B8]" />
                      <p className="text-[11px] font-medium text-[#64748B]">No rent-to-own agreements found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                agreements.map((a: any) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC]">
                    {/* Render data here if any */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor = "text-[#1E293B]", subValue }: { label: string; value: string; valueColor?: string; subValue?: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest leading-tight">{label}</p>
      <h4 className={cn("text-base font-black tracking-tight", valueColor)}>{value}</h4>
      {subValue && <p className="text-[8px] font-medium text-[#94A3B8] leading-tight">{subValue}</p>}
    </div>
  );
}
