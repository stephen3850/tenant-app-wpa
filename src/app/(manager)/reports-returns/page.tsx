import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Briefcase,
  FileText,
  Search,
  Filter,
  Download,
  X,
  Plus,
  ArrowRight,
  HandCoins,
  Receipt,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default async function ReturnManagerReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties and field officers for filters
  const [properties, fieldOfficers] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.user.findMany({
      where: {
        organizationId,
        userRoles: {
          some: {
            role: {
              name: "FIELD_OFFICER"
            }
          }
        }
      },
      select: { id: true, name: true }
    })
  ]);

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight">Returns</h1>
          <p className="text-[12px] font-medium text-[#64748B]">Create and review owner monthly returns.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#3B82F6] font-bold text-[12px] gap-2 shadow-sm hover:bg-blue-50">
             <HandCoins className="h-4 w-4" />
             Manage Advances
           </Button>
           <Button variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[12px] gap-2 shadow-sm">
             <Receipt className="h-4 w-4" />
             Payment Vouchers
           </Button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <FilterSelect label="Month" defaultValue="july-2026" options={["July 2026", "June 2026", "May 2026"]} />
          <FilterSelect label="Owner" defaultValue="all" options={["All owners"]} />
          <FilterSelect label="Property" defaultValue="all" options={["All properties", ...properties.map(p => p.propertyName)]} />
          <FilterSelect label="Field Officer" defaultValue="all" options={["All field officers", ...fieldOfficers.map(f => f.name || "Unknown")]} />
          <FilterSelect label="Return date" defaultValue="all" options={["All return dates"]} />
          <FilterSelect label="Status" defaultValue="all" options={["All return status"]} />
        </div>
        <div className="flex items-center gap-2">
           <Button className="h-10 px-8 bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold text-[13px] rounded-lg shadow-sm gap-2">
             <Filter className="h-4 w-4 fill-white" />
             Apply
           </Button>
           <Button variant="outline" className="h-10 w-10 p-0 border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 rounded-lg shadow-sm">
             <X className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Returns List Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#F1F5F9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Returns List</h2>
            <p className="text-[12px] font-medium text-[#64748B]">July 2026 draft, checked, and approved returns.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#F1F5F9] px-3 py-1.5 rounded-md border border-[#E2E8F0]">
               <span className="text-[11px] font-bold text-[#1E293B]">0 return(s)</span>
            </div>
            <Button variant="outline" className="h-9 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[11px] gap-2 shadow-sm">
               <FileSpreadsheet className="h-4 w-4" />
               Excel
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[11px] gap-2 shadow-sm">
               <Receipt className="h-4 w-4" />
               Payment vouchers
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-lg border-[#3B82F6] text-[#3B82F6] font-bold text-[11px] gap-2 shadow-sm hover:bg-blue-50">
               <HandCoins className="h-4 w-4" />
               Manage advances
            </Button>
            <Button className="h-9 px-4 bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold text-[11px] rounded-lg shadow-sm gap-2">
               <Plus className="h-4 w-4" />
               Create returns
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Receipts</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Deductions</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Payable</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-[13px] font-medium text-[#64748B]">No draft, checked, or approved returns for July 2026.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, defaultValue, options }: { label: string; defaultValue: string; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#1E293B] ml-0.5">{label}</label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="h-10 text-[12px] font-medium border-[#E2E8F0] rounded-lg shadow-sm bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt.toLowerCase().replace(/\s+/g, "-")} className="text-[12px] font-medium">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
