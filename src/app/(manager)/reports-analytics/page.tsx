import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, parseISO, differenceInDays } from "date-fns";
import { ReportFilters } from "./report-filters";

export const dynamic = "force-dynamic";

export default async function AnalyticsReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: { name: true }
  });

  // 1. END-TO-END DATA WIRING: Extract and Validate Parameters
  const propertyId = typeof searchParams.propertyId === "string" ? searchParams.propertyId : "all";
  const startStr = typeof searchParams.start === "string" ? searchParams.start : format(startOfMonth(new Date()), "yyyy-MM-dd");
  const endStr = typeof searchParams.end === "string" ? searchParams.end : format(endOfMonth(new Date()), "yyyy-MM-dd");

  const start = parseISO(startStr);
  const end = parseISO(endStr);

  // 2. PURGE DUMMY DATA: Real DB queries
  const [properties, invoices, payments] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.invoice.findMany({
      where: {
        organizationId,
        createdAt: { gte: start, lte: end },
        ...(propertyId !== "all" ? { lease: { propertyId } } : {})
      },
      include: { lease: { include: { property: true } } }
    }),
    db.payment.findMany({
      where: {
        organizationId,
        status: "COMPLETED",
        paymentDate: { gte: start, lte: end },
        ...(propertyId !== "all" ? { lease: { propertyId } } : {})
      }
    })
  ]);

  const netInvoices = invoices.reduce((acc, inv) => acc + Number(inv.totalAmount), 0);
  const rentPayments = payments.reduce((acc, pay) => acc + Number(pay.amount), 0);
  const outstanding = netInvoices - rentPayments;
  const collectionRate = netInvoices > 0 ? (rentPayments / netInvoices) * 100 : 0;

  const now = new Date();
  const agingBuckets = { current: 0, p30: 0, p60: 0, p90: 0, p120: 0 };

  invoices.forEach(inv => {
    const diff = differenceInDays(now, new Date(inv.dueDate));
    const bal = Number(inv.balanceDue);
    if (bal > 0) {
      if (diff <= 30) agingBuckets.current += bal;
      else if (diff <= 60) agingBuckets.p30 += bal;
      else if (diff <= 90) agingBuckets.p60 += bal;
      else if (diff <= 120) agingBuckets.p90 += bal;
      else agingBuckets.p120 += bal;
    }
  });

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter print:bg-white print:p-8 print:block">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}} />
      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:flex flex-col border-b-2 border-slate-900 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {organization?.name || "TMS Management"}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Property Performance Report
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-slate-900">DATE GENERATED</p>
            <p className="text-xs font-bold text-slate-600">{format(new Date(), "MMMM dd, yyyy HH:mm")}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
           <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">REPORT PERIOD</p>
              <p className="text-xs font-bold text-slate-900">
                {format(start, "MMM dd, yyyy")} TO {format(end, "MMM dd, yyyy")}
              </p>
           </div>
           <div className="space-y-1 text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">FILTERED BY PROPERTY</p>
              <p className="text-xs font-bold text-slate-900">
                {propertyId === "all" ? "All Portfolio Properties" : properties.find(p => p.id === propertyId)?.propertyName || "Specific Property"}
              </p>
           </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 relative overflow-hidden space-y-6 print:hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B] rounded-full -mr-12 -mt-8 opacity-20" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.2em]">ANALYTICS</p>
            <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Reporting & Analytics</h1>
            <p className="text-[11px] font-medium text-[#64748B]">Real-time property performance data.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#F8FAFC] px-3 py-1.5 rounded-full border border-[#E2E8F0] flex items-center gap-2">
               <span className="text-[10px] font-bold text-[#12B76A]">● Live data</span>
            </div>
            <Button variant="outline" className="h-8 px-4 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm" asChild>
              <Link href="/reports"><ArrowLeft className="h-3 w-3" /> Back</Link>
            </Button>
          </div>
        </div>

        {/* Client Filters Component */}
        <ReportFilters
          properties={properties}
          initialFilters={{ start: startStr, end: endStr, propertyId }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
           <MiniStatBox label="NET INVOICES" value={netInvoices.toFixed(2)} />
           <MiniStatBox label="RENT PAYMENTS" value={rentPayments.toFixed(2)} valueColor="text-[#12B76A]" />
           <MiniStatBox label="OUTSTANDING" value={outstanding.toFixed(2)} valueColor="text-rose-600" />
           <MiniStatBox label="COLLECTION %" value={collectionRate.toFixed(1) + "%"} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print-break-inside-avoid">
          <BigSummaryBox label="PERIOD INVOICES" value={`KES ${netInvoices.toLocaleString()}`} />
          <BigSummaryBox label="PERIOD PAYMENTS" value={`KES ${rentPayments.toLocaleString()}`} valueColor="text-[#12B76A]" />
          <BigSummaryBox label="NET OUTSTANDING" value={`KES ${outstanding.toLocaleString()}`} valueColor="text-[#E11D48]" />
          <BigSummaryBox label="COLLECTION %" value={`${collectionRate.toFixed(1)}%`} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-2 print:hidden">
          <div className="space-y-2">
             <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">ACTIVE FILTERS</p>
             <Badge variant="secondary" className="bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0] px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                {format(start, "MMM dd, yyyy")} - {format(end, "MMM dd, yyyy")}
             </Badge>
          </div>
        </div>
      </div>

      {/* AR Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col print:border-slate-300 print:rounded-none print-break-inside-avoid">
          <div className="p-3 border-b border-[#F1F5F9] flex justify-between items-center print:bg-slate-50">
            <h3 className="text-[13px] font-black text-[#1E293B] uppercase tracking-tight print:text-slate-900">AR breakdown (aging)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9] print:bg-slate-100">
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase print:text-slate-700">0-30 days</th>
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase text-center print:text-slate-700">31-60</th>
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase text-center print:text-slate-700">61-90</th>
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase text-center print:text-slate-700">91-120</th>
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase text-center print:text-slate-700">120+</th>
                    <th className="px-4 py-2 text-[10px] font-black text-[#64748B] uppercase text-right print:text-slate-700">Total</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] print:divide-slate-200">
                  <tr className="hover:bg-[#F8FAFC] font-bold print:hover:bg-transparent">
                    <td className="px-4 py-3 text-[12px] text-[#1E293B]">{agingBuckets.current.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#1E293B] text-center">{agingBuckets.p30.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#1E293B] text-center">{agingBuckets.p60.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#1E293B] text-center">{agingBuckets.p90.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#1E293B] text-center">{agingBuckets.p120.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-rose-600 text-right print:text-rose-700">{Object.values(agingBuckets).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                  </tr>
              </tbody>
            </table>
          </div>
      </div>

      {/* PRINT-ONLY FOOTER */}
      <div className="hidden print:flex flex-col mt-auto pt-12">
        <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <div>System generated report by TMS Property Management</div>
           <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
}

function MiniStatBox({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-tight">{label}</p>
      <h4 className={cn("text-base font-black tracking-tight", valueColor)}>{value}</h4>
    </div>
  );
}

function BigSummaryBox({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1 print:bg-white print:border-slate-200">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.1em] print:text-slate-500">{label}</p>
      <h3 className={cn("text-base font-black tracking-tight print:text-lg", valueColor)}>{value}</h3>
    </div>
  );
}
