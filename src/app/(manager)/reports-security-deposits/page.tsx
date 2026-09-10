import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SecurityDepositsReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. DATA WIRING: Extract Filters
  const propertyId = typeof searchParams.propertyId === "string" ? searchParams.propertyId : undefined;
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, tenants] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.tenant.findMany({
      where: {
        organizationId,
        ...(status && status !== "any" ? { status: status as any } : {})
      },
      include: {
        leases: {
          where: {
            ...(propertyId && propertyId !== "all" ? { propertyId } : {})
          },
          include: { unit: true, property: true }
        },
        payments: {
          where: {
            OR: [
              { notes: { contains: "deposit", mode: "insensitive" } },
              { notes: { contains: "security", mode: "insensitive" } }
            ],
            status: "COMPLETED"
          }
        }
      }
    })
  ]);

  // Transform data
  const depositData = tenants.filter(t => t.leases.length > 0).map(tenant => {
    const activeLease = tenant.leases.find(l => l.status === "ACTIVE") || tenant.leases[0];
    const required = activeLease ? Number(activeLease.securityDeposit) : 0;
    const received = tenant.payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const available = received; // Simplified

    return {
      id: tenant.id,
      name: `${tenant.firstName} ${tenant.lastName}`,
      propertyUnit: activeLease ? `${activeLease.property.propertyName} / ${activeLease.unit.unitNumber}` : "N/A",
      tenantStatus: tenant.status,
      required,
      received,
      available,
      isMissing: received < required,
      hasRefundIssue: tenant.status !== "ACTIVE" && available > 0
    };
  });

  const stats = {
    tenants: depositData.length,
    notReceived: depositData.filter(d => d.isMissing).length,
    notRefunded: depositData.filter(d => d.hasRefundIssue).length,
    totalReceived: depositData.reduce((acc, d) => acc + d.received, 0),
    totalAvailable: depositData.reduce((acc, d) => acc + d.available, 0)
  };

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Security Deposits - Single View</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Auditing deposit collections vs lease requirements.</p>
        </div>
        <Button variant="outline" className="h-8 px-4 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] shadow-sm" asChild>
          <Link href="/reports">Back to reports</Link>
        </Button>
      </div>

      {/* 3. BUTTON RESPONSIVENESS: Filter form */}
      <form className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
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
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Tenant Status</label>
            <Select name="status" defaultValue={status || "any"}>
               <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] bg-white"><SelectValue placeholder="Any status" /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="any">Any status</SelectItem>
                 <SelectItem value="ACTIVE">Active</SelectItem>
                 <SelectItem value="FORMER">Former</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="h-8 px-8 bg-[#3B82F6] hover:bg-blue-700 text-white font-black text-[11px] rounded-lg">Apply Filters</Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatBox label="TENANTS" value={stats.tenants.toString()} />
        <StatBox label="NOT RECEIVED" value={stats.notReceived.toString()} valueColor="text-rose-600" />
        <StatBox label="NOT REFUNDED" value={stats.notRefunded.toString()} valueColor="text-orange-500" />
        <StatBox label="DEPOSITS RCVD" value={`KES ${stats.totalReceived.toLocaleString()}`} />
        <StatBox label="AVAILABLE BAL" value={`KES ${stats.totalAvailable.toLocaleString()}`} />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Tenant</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Property / Unit</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Required</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Received</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {depositData.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[11px] text-[#64748B]">No records found.</td></tr>
              ) : (
                depositData.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-2 text-[11px] font-bold text-[#1E293B]">{d.name}</td>
                    <td className="px-4 py-2 text-[11px] text-[#64748B]">{d.propertyUnit}</td>
                    <td className="px-4 py-2 text-[11px] text-right">{d.required.toLocaleString()}</td>
                    <td className="px-4 py-2 text-[11px] font-black text-[#1E293B] text-right">{d.received.toLocaleString()}</td>
                    <td className="px-4 py-2">
                       <div className="flex gap-1">
                         {d.isMissing && <AlertCircle className="h-3.5 w-3.5 text-rose-500" title="Missing Deposit" />}
                         {d.hasRefundIssue && <AlertCircle className="h-3.5 w-3.5 text-orange-500" title="Refund Pending" />}
                         {!d.isMissing && !d.hasRefundIssue && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
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

function StatBox({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">{label}</p>
      <h4 className={cn("text-base font-black tracking-tight", valueColor)}>{value}</h4>
    </div>
  );
}
