import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  FileSpreadsheet,
  FileText,
  ArrowLeft,
  Calendar as CalendarIcon,
  Search,
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
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OccupancyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. DATA WIRING: Extract Params
  const propertyId = typeof searchParams.propertyId === "string" ? searchParams.propertyId : undefined;
  const asOfDate = typeof searchParams.asOf === "string" ? parseISO(searchParams.asOf) : new Date();

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, units] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.unit.findMany({
      where: {
        property: {
          organizationId,
          ...(propertyId && propertyId !== "all" ? { id: propertyId } : {})
        },
      },
      include: {
        property: true,
        leases: {
          where: {
            status: "ACTIVE",
            startDate: { lte: asOfDate },
            OR: [
              { endDate: null },
              { endDate: { gte: asOfDate } }
            ]
          },
          include: { tenant: true },
          take: 1
        }
      }
    })
  ]);

  const totalUnits = units.length;
  // Use real lease presence for occupancy if data matches
  const occupiedUnits = units.filter(u => u.leases.length > 0).length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* 3. BUTTON & EVENT HANDLER RESPONSIVENESS: Filter Form */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Occupancy Report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Snapshot of property utilization as of {format(asOfDate, "MMM dd, yyyy")}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="h-8 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm" asChild>
             <Link href="/reports">Back to reports</Link>
           </Button>
           <Button variant="outline" className="h-8 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm">
             <FileSpreadsheet className="h-3.5 w-3.5" />
             Export Excel
           </Button>
        </div>
      </div>

      <form className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">As of date</label>
            <input name="asOf" type="date" defaultValue={format(asOfDate, "yyyy-MM-dd")} className="w-full h-8 px-3 rounded-md border border-[#E2E8F0] text-[11px] font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Property</label>
            <Select name="propertyId" defaultValue={propertyId || "all"}>
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] bg-white">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Search</label>
            <Input name="q" placeholder="Unit, tenant..." className="h-8 text-[11px] font-medium" />
          </div>
        </div>
        <Button type="submit" className="h-8 px-8 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg">
          Apply Filters
        </Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="TOTAL UNITS" value={totalUnits.toString()} />
        <StatCard label="OCCUPIED" value={occupiedUnits.toString()} />
        <StatCard label="VACANT" value={vacantUnits.toString()} />
        <StatCard label="OCCUPANCY RATE" value={`${occupancyRate.toFixed(1)}%`} />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Property / Unit</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Status</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Tenant</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Unit Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {units.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-[11px] text-[#64748B]">No units in scope.</td></tr>
              ) : (
                units.map((unit) => {
                  const lease = unit.leases[0];
                  const isOccupied = !!lease;
                  return (
                    <tr key={unit.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3">
                        <p className="text-[11px] font-bold text-[#1E293B]">{unit.unitNumber}</p>
                        <p className="text-[10px] text-[#64748B]">{unit.property.propertyName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          isOccupied ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"
                        )}>
                          {isOccupied ? "Occupied" : "Vacant"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-[#1E293B]">
                        {lease ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : "---"}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#1E293B] text-right">
                        {Number(unit.monthlyRent).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">{label}</p>
      <h3 className="text-base font-black text-[#1E293B] tracking-tight">{value}</h3>
    </div>
  );
}
