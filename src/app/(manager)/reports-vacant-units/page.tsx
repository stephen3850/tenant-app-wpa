import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  Filter,
  Search,
  MoreHorizontal,
  Home,
  AlertTriangle
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
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function VacantUnitsOpenLeasesReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties for filter
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true }
  });

  // Fetch units marked as VACANT but having ACTIVE or EXPIRING leases
  const flaggedUnits = await db.unit.findMany({
    where: {
      property: { organizationId },
      occupancyStatus: "VACANT",
      leases: {
        some: {
          status: { in: ["ACTIVE", "EXPIRING"] }
        }
      }
    },
    include: {
      property: true,
      leases: {
        where: {
          status: { in: ["ACTIVE", "EXPIRING"] }
        },
        include: {
          tenant: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Vacant units with open leases</h1>
          <p className="text-[11px] font-medium text-[#64748B]">
            Units marked as vacant, but their latest lease status is not ended (e.g. Occupied / Pending Move-Out).
          </p>
        </div>
        <Button variant="outline" className="h-8 px-4 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm" asChild>
          <Link href="/reports">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Reports
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
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
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Search</label>
            <div className="relative">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
               <Input
                 placeholder="Unit, tenant, or property"
                 className="h-8 pl-8 text-[11px] font-medium border-[#E2E8F0] rounded-lg bg-white"
               />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-8 px-6 bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-[11px] rounded-lg shadow-sm gap-2 uppercase">
            <Filter className="h-3 w-3 fill-white" />
            Apply
          </Button>
          <Button variant="outline" className="h-8 px-6 border-[#E2E8F0] text-[#1E293B] font-black text-[11px] rounded-lg shadow-sm uppercase">
            Reset
          </Button>
          <span className="text-[10px] font-medium text-[#64748B] whitespace-nowrap ml-2">Showing {flaggedUnits.length} flagged</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="p-4 border-b border-[#F1F5F9] flex justify-between items-center">
           <div className="space-y-0.5">
              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">FLAGGED UNITS</p>
              <p className="text-[11px] font-medium text-[#64748B]">Vacant units still linked to active leases.</p>
           </div>
           <div className="bg-[#F1F5F9] px-2 py-1 rounded text-[10px] font-black text-[#1E293B]">
              {flaggedUnits.length} found
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Property</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Unit</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Tenant</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Lease Status</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Lease Dates</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Rent</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight">Updated</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-tight text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {flaggedUnits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                     <div className="flex flex-col items-center justify-center space-y-2 opacity-60">
                        <Home className="h-8 w-8 text-[#94A3B8]" />
                        <p className="text-[12px] font-medium text-[#64748B]">No flagged units found.</p>
                     </div>
                  </td>
                </tr>
              ) : (
                flaggedUnits.map((u) => {
                  const lease = u.leases[0];
                  return (
                    <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 text-[11px] font-medium text-[#1E293B]">{u.property.propertyName}</td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#1E293B]">{u.unitNumber}</td>
                      <td className="px-4 py-3 text-[11px] font-medium text-[#1E293B]">
                        {lease ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : "---"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          lease?.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                        )}>
                          {lease?.status || "---"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#64748B]">
                        {lease ? `${format(new Date(lease.startDate), "MMM dd, yyyy")} - ${lease.endDate ? format(new Date(lease.endDate), "MMM dd, yyyy") : 'Open'}` : "---"}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#1E293B]">
                        {Number(u.monthlyRent).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#64748B]">
                        {format(new Date(u.updatedAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-4 w-4 text-[#64748B]" />
                        </Button>
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
