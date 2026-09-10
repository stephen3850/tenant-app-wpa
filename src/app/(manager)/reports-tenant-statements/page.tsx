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
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TenantStatementFilters } from "./tenant-statement-filters";

export const dynamic = "force-dynamic";

export default async function TenantStatementsReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. DATA WIRING: Extract and Validate Parameters
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? params.status : "active";
  const propertyId = typeof params.propertyId === "string" ? params.propertyId : "all";
  const rows = typeof params.rows === "string" ? params.rows : "100";

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, tenantsData] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.tenant.findMany({
      where: {
        organizationId,
        ...(status !== "all" ? { status: status.toUpperCase() as any } : {}),
        ...(search ? {
           OR: [
             { firstName: { contains: search, mode: "insensitive" } },
             { lastName: { contains: search, mode: "insensitive" } },
             { phone: { contains: search, mode: "insensitive" } },
             { leases: { some: { unit: { unitNumber: { contains: search, mode: "insensitive" } } } } }
           ]
        } : {})
      },
      include: {
        leases: {
          where: {
             ...(propertyId !== "all" ? { propertyId } : {}),
             status: "ACTIVE"
          },
          include: {
            unit: true,
            property: true,
            invoices: {
              select: { balanceDue: true }
            }
          }
        }
      },
      take: parseInt(rows)
    })
  ]);

  const tenants = tenantsData.map(tenant => {
     const activeLease = tenant.leases[0];
     const totalDue = activeLease?.invoices.reduce((acc, inv) => acc + Number(inv.balanceDue), 0) || 0;
     return {
        id: tenant.id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        phone: tenant.phone,
        unit: activeLease?.unit.unitNumber || "---",
        property: activeLease?.property.propertyName || "---",
        totalDue,
        status: tenant.status
     };
  });

  const totalVisibleDue = tenants.reduce((acc, t) => acc + t.totalDue, 0);

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Tenant Statements</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Review balance summaries across your portfolio.</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">AVAILABLE</p>
          <h2 className="text-2xl font-black text-[#1E293B] leading-none">{tenants.length}</h2>
        </div>
      </div>

      {/* Filters Section (Client Component) */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
        <TenantStatementFilters
            properties={properties}
            initialFilters={{ search, status, propertyId, rows }}
        />
        <div className="pt-2 border-t border-[#F1F5F9]">
           <p className="text-[9px] font-medium text-[#94A3B8]">
             Total Due = Total B/F + Rent + Utility - Paid MTD. Balance reflects all unpaid invoices.
           </p>
        </div>
      </div>

      {/* Workbench Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#F1F5F9] space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">RECONCILIATION</p>
              <h2 className="text-lg font-black text-[#1E293B] tracking-tight">Tenant Statements workbench</h2>
            </div>
            <div className="flex items-center gap-1.5 p-1 self-start bg-[#F9FAFB] rounded-lg border border-[#F2F4F7]">
               <TabLink label="Rent collections" color="blue" href="/reports-rent-collections" />
               <TabLink label="Opening balance" color="orange" href="/reports-opening-balance" />
               <TabLink label="Analytics" color="green" href="/reports-analytics" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="VISIBLE TENANTS" value={tenants.length.toString()} />
            <StatCard label="TOTAL DUE" value={`KES ${totalVisibleDue.toLocaleString()}`} valueColor="text-rose-600" />
            <StatCard label="PROPERTY" value={propertyId === "all" ? "ALL" : properties.find(p => p.id === propertyId)?.propertyName || "---"} />
            <StatCard label="SCOPE" value={status.toUpperCase()} />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto p-2 bg-[#F8FAFC]">
          <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0 min-w-[1000px]">
            <thead>
              <tr>
                <TableHeader label="#" className="w-10" />
                <TableHeader label="Name" />
                <TableHeader label="Phone" />
                <TableHeader label="Unit" />
                <TableHeader label="Property" />
                <TableHeader label="Total Due" />
                <TableHeader label="Status" />
                <TableHeader label="Action" className="text-right" />
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-0">
                    <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl mt-0.5 py-12 flex flex-col items-center justify-center space-y-2">
                       <p className="text-[11px] font-medium text-[#94A3B8]">No tenants match your current filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((t, i) => (
                  <tr key={t.id}>
                    <td className="p-0 pt-0.5"><div className="bg-white px-3 py-2 text-[10px] font-medium rounded-l-lg border border-[#E2E8F0] h-full flex items-center">{i + 1}</div></td>
                    <td className="p-0 pt-0.5"><div className="bg-white px-3 py-2 text-[11px] font-bold text-[#1E293B] border-y border-[#E2E8F0] h-full flex items-center">{t.name}</div></td>
                    <td className="p-0 pt-0.5"><div className="bg-white px-3 py-2 text-[11px] text-[#64748B] border-y border-[#E2E8F0] h-full flex items-center">{t.phone}</div></td>
                    <td className="p-0 pt-0.5"><div className="bg-white px-3 py-2 text-[11px] font-bold text-[#1E293B] border-y border-[#E2E8F0] h-full flex items-center">{t.unit}</div></td>
                    <td className="p-0 pt-0.5"><div className="bg-white px-3 py-2 text-[11px] text-[#64748B] border-y border-[#E2E8F0] h-full flex items-center">{t.property}</div></td>
                    <td className="p-0 pt-0.5"><div className={cn("bg-white px-3 py-2 text-[11px] font-black border-y border-[#E2E8F0] h-full flex items-center", t.totalDue > 0 ? "text-rose-600" : "text-green-600")}>
                      {t.totalDue.toLocaleString()}
                    </div></td>
                    <td className="p-0 pt-0.5">
                       <div className="bg-white px-3 py-2 border-y border-[#E2E8F0] h-full flex items-center">
                          <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase", t.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600")}>
                            {t.status}
                          </span>
                       </div>
                    </td>
                    <td className="p-0 pt-0.5">
                       <div className="bg-white px-3 py-2 border-y border-r border-[#E2E8F0] rounded-r-lg h-full flex items-center justify-end">
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                       </div>
                    </td>
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

function TableHeader({ label, className }: { label: string; className?: string }) {
  return (
    <th className={cn(
      "bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-lg px-3 py-2 text-[9px] font-black text-[#1E293B] text-left uppercase tracking-tight whitespace-nowrap",
      className
    )}>
      {label}
    </th>
  );
}

function TabLink({ label, color, href }: { label: string; color: string; href: string }) {
  const colorStyles: any = {
    blue: "border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50",
    orange: "border-[#F59E0B] text-[#F59E0B] hover:bg-orange-50",
    green: "border-[#10B981] text-[#10B981] hover:bg-green-50",
    black: "border-[#1E293B] text-[#1E293B] hover:bg-slate-50"
  };

  return (
    <Link href={href} className={cn(
      "px-3 py-1 rounded-md text-[10px] font-bold transition-all border-2 bg-white",
      colorStyles[color]
    )}>
      {label}
    </Link>
  );
}

function StatCard({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F9FAFB]/50 space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.1em]">{label}</p>
      <h3 className={cn("text-lg font-black tracking-tight", valueColor)}>{value}</h3>
    </div>
  );
}
