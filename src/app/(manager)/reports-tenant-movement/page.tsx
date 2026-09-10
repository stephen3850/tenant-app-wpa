import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  FileSpreadsheet,
  MoreHorizontal,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function TenantMovementReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. DATA WIRING: Extract Params
  const propertyId = typeof searchParams.propertyId === "string" ? searchParams.propertyId : undefined;
  const start = typeof searchParams.start === "string" ? parseISO(searchParams.start) : startOfMonth(new Date());
  const end = typeof searchParams.end === "string" ? parseISO(searchParams.end) : endOfMonth(new Date());

  // 2. PURGE DUMMY DATA: Actual DB queries
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true }
  });

  const leasesInPeriod = await db.lease.findMany({
    where: {
      organizationId,
      ...(propertyId && propertyId !== "all" ? { propertyId } : {}),
      OR: [
        { startDate: { gte: start, lte: end } },
        { endDate: { gte: start, lte: end } },
        { deletedAt: { gte: start, lte: end } }
      ]
    },
    include: {
      tenant: true,
      property: true,
      unit: true
    },
    orderBy: { startDate: "desc" }
  });

  // Split logic based on event type
  const newTenants = leasesInPeriod.filter(l => l.startDate >= start && l.startDate <= end);
  const vacatedTenants = leasesInPeriod.filter(l => l.endDate && l.endDate >= start && l.endDate <= end);

  const stats = {
    newTenants: newTenants.length,
    vacatedTenants: vacatedTenants.length,
    movementEvents: leasesInPeriod.length,
  };

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Container */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Tenant movement report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Move-in and move-out tracking for the period.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="h-8 px-4 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] shadow-sm" asChild>
             <Link href="/reports">Back to Reports</Link>
           </Button>
        </div>
      </div>

      {/* 3. BUTTON RESPONSIVENESS: Filter form */}
      <form className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Start date</label>
            <input name="start" type="date" defaultValue={format(start, "yyyy-MM-dd")} className="w-full h-8 px-3 rounded-md border border-[#E2E8F0] text-[11px] font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">End date</label>
            <input name="end" type="date" defaultValue={format(end, "yyyy-MM-dd")} className="w-full h-8 px-3 rounded-md border border-[#E2E8F0] text-[11px] font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Property</label>
            <Select name="propertyId" defaultValue={propertyId || "all"}>
               <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] bg-white"><SelectValue placeholder="All properties" /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All properties</SelectItem>
                 {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>)}
               </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="h-8 w-full bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-[11px] rounded-lg">Apply Filters</Button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="NEW TENANTS" value={stats.newTenants.toString()} subValue="Move-ins recorded" />
        <StatCard label="VACATED TENANTS" value={stats.vacatedTenants.toString()} subValue="Lease ends recorded" />
        <StatCard label="TOTAL EVENTS" value={stats.movementEvents.toString()} subValue="Lifecycle updates" />
      </div>

      {/* Movement Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-3 border-b border-[#F1F5F9] bg-[#F9FAFB]/50 flex justify-between items-center">
           <h2 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Movement Log</h2>
           <Badge variant="outline" className="text-[9px] font-bold">{leasesInPeriod.length} events</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Event Date</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Tenant</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Property / Unit</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Movement</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {leasesInPeriod.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[11px] text-[#64748B]">No movements found for this period.</td></tr>
              ) : (
                leasesInPeriod.map((lease) => {
                  const isNew = lease.startDate >= start && lease.startDate <= end;
                  const eventDate = isNew ? lease.startDate : lease.endDate!;
                  return (
                    <tr key={lease.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 text-[11px] font-medium text-[#1E293B]">{format(new Date(eventDate), "MMM dd, yyyy")}</td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#1E293B]">{lease.tenant.firstName} {lease.tenant.lastName}</td>
                      <td className="px-4 py-3 text-[11px] text-[#64748B]">{lease.property.propertyName} / {lease.unit.unitNumber}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          isNew ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                        )}>
                          {isNew ? "Move-In" : "Move-Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-black text-[#1E293B] text-right">{Number(lease.monthlyRent).toLocaleString()}</td>
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

function StatCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-tight">{label}</p>
      <h4 className="text-base font-black text-[#1E293B] tracking-tight">{value}</h4>
      {subValue && <p className="text-[9px] font-medium text-[#94A3B8] leading-tight">{subValue}</p>}
    </div>
  );
}
