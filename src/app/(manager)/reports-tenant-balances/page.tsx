import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  Filter,
  TrendingUp,
  Wallet,
  Scale,
  Building2,
  MoreHorizontal
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

export default async function TenantBalanceReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const propertyId = typeof searchParams.propertyId === "string" ? searchParams.propertyId : undefined;

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, tenants] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.tenant.findMany({
      where: {
        organizationId,
        leases: {
           some: {
              ...(propertyId && propertyId !== "all" ? { propertyId } : {}),
              status: "ACTIVE"
           }
        }
      },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: {
            unit: true,
            property: true,
            invoices: {
              select: { balanceDue: true }
            }
          }
        }
      }
    })
  ]);

  const tenantBalances = tenants.map(tenant => {
    const activeLease = tenant.leases[0];
    const balance = activeLease?.invoices.reduce((acc, inv) => acc + Number(inv.balanceDue), 0) || 0;
    return {
      id: tenant.id,
      name: `${tenant.firstName} ${tenant.lastName}`,
      property: activeLease?.property.propertyName || "---",
      unit: activeLease?.unit.unitNumber || "---",
      balance
    };
  });

  const outstandingTenants = tenantBalances.filter(t => t.balance > 0);
  const creditTenants = tenantBalances.filter(t => t.balance < 0);

  const totalOutstanding = outstandingTenants.reduce((acc, t) => acc + t.balance, 0);
  const totalCredit = Math.abs(creditTenants.reduce((acc, t) => acc + t.balance, 0));

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Tenant balance report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Review outstanding balances and prepaid credits.</p>
        </div>
        <Button variant="outline" className="h-8 px-4 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] shadow-sm" asChild>
          <Link href="/reports">Back to reports</Link>
        </Button>
      </div>

      <form className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
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
        </div>
        <Button type="submit" className="h-8 px-6 bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-[11px] rounded-lg">Apply filters</Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          label="OUTSTANDING EXPOSURE"
          value={`KES ${totalOutstanding.toLocaleString()}`}
          subValue={`${outstandingTenants.length} tenant(s) with arrears.`}
          icon={<TrendingUp className="h-3.5 w-3.5 text-rose-600" />}
          iconBg="bg-rose-50"
        />
        <StatCard
          label="PREPAID / CREDIT"
          value={`KES ${totalCredit.toLocaleString()}`}
          subValue={`${creditTenants.length} tenant(s) in credit.`}
          icon={<Wallet className="h-3.5 w-3.5 text-green-600" />}
          iconBg="bg-green-50"
        />
        <StatCard
          label="NET RECEIVABLE"
          value={`KES ${(totalOutstanding - totalCredit).toLocaleString()}`}
          subValue="Net portfolio health."
          icon={<Scale className="h-3.5 w-3.5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[#F1F5F9] bg-[#F9FAFB]/50">
            <h2 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">Balance Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                  <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Tenant</th>
                  <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Property / Unit</th>
                  <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Balance</th>
                  <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {tenantBalances.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-[11px] text-[#64748B]">No active tenants in scope.</td></tr>
                ) : (
                  tenantBalances.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 text-[11px] font-bold text-[#1E293B]">{t.name}</td>
                      <td className="px-4 py-3 text-[11px] text-[#64748B]">{t.property} / {t.unit}</td>
                      <td className={cn(
                        "px-4 py-3 text-[11px] font-black text-right",
                        t.balance > 0 ? "text-rose-600" : t.balance < 0 ? "text-green-600" : "text-[#1E293B]"
                      )}>
                        {t.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-3.5 w-3.5 text-[#64748B]" /></Button>
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

function StatCard({ label, value, subValue, icon, iconBg }: { label: string; value: string; subValue: string; icon: React.ReactNode; iconBg: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm flex items-start gap-4">
      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0", iconBg)}>{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">{label}</p>
        <h3 className="text-base font-black text-[#1E293B] tracking-tight">{value}</h3>
        <p className="text-[9px] font-medium text-[#94A3B8] leading-tight">{subValue}</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, placeholder, options }: { label: string; placeholder: string; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-[#1E293B] ml-0.5 uppercase tracking-wider">{label}</label>
      <Select>
        <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-white"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-[11px] font-bold">{placeholder}</SelectItem>
          {options.map(opt => <SelectItem key={opt} value={opt.toLowerCase().replace(/\s+/g, "-")} className="text-[11px] font-bold">{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
