import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  FileText,
  FileDown,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OpeningBalanceFilters } from "./opening-balance-filters";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function OpeningBalanceReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. DATA WIRING: Extract and Validate Parameters
  const propertyId = typeof params.propertyId === "string" ? params.propertyId : "all";
  const unitId = typeof params.unitId === "string" ? params.unitId : "all";
  const year = typeof params.year === "string" ? params.year : "2026";

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, units, organization] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.unit.findMany({
      where: { property: { organizationId } },
      select: { id: true, unitNumber: true, propertyId: true }
    }),
    db.organization.findUnique({
      where: { id: organizationId },
      select: { name: true }
    })
  ]);

  const selectedProperty = properties.find(p => p.id === propertyId);
  const selectedUnit = units.find(u => u.id === unitId);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter print:bg-white print:p-8 print:m-0">

      {/* CSS to hide browser default headers and footers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}} />

      {/* PROFESSIONAL PRINT HEADER (Hidden in UI) */}
      <div className="hidden print:flex flex-col border-b-2 border-rose-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-black text-rose-600 uppercase tracking-tight">{organization?.name || "TMS"}</h1>
              <p className="text-sm font-bold text-rose-500">Opening Balance Report - {year}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Generated on</p>
              <p className="text-xs font-black text-slate-900">{format(new Date(), "PPP p")}</p>
           </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
           <div className="bg-rose-50/50 p-2 rounded border border-rose-100">
              <p className="text-[9px] font-black text-rose-400 uppercase">Year</p>
              <p className="text-xs font-bold text-rose-900">{year}</p>
           </div>
           <div className="bg-rose-50/50 p-2 rounded border border-rose-100">
              <p className="text-[9px] font-black text-rose-400 uppercase">Property</p>
              <p className="text-xs font-bold text-rose-900">{selectedProperty?.propertyName || "ALL PROPERTIES"}</p>
           </div>
           <div className="bg-rose-50/50 p-2 rounded border border-rose-100">
              <p className="text-[9px] font-black text-rose-400 uppercase">Unit / Apartment</p>
              <p className="text-xs font-bold text-rose-900">{selectedUnit?.unitNumber || "ALL UNITS"}</p>
           </div>
        </div>
      </div>

      {/* UI Header Section (Hidden in Print) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="space-y-0.5">
             <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
             <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Opening Balance Report</h1>
             <p className="text-[11px] font-medium text-[#64748B]">Monthly opening balance carry-forward.</p>
           </div>
           <Button variant="outline" size="sm" className="h-8 border-[#E2E8F0] text-[#1E293B] font-bold text-[11px] gap-2" asChild>
             <Link href="/reports"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link>
           </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 px-4 text-[#1E293B] font-bold text-[10px] border-[#DCE3EA] rounded-lg gap-2 shadow-sm uppercase">
            <FileDown className="h-3.5 w-3.5" />
            Excel
          </Button>
          <Button className="h-8 px-4 bg-[#475569] hover:bg-[#334155] text-white font-bold text-[10px] rounded-lg gap-2 shadow-sm uppercase">
            <FileText className="h-3.5 w-3.5" />
            Invoices by Month
          </Button>
        </div>
      </div>

      {/* Filters Section (Hidden in Print) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 print:hidden">
        <OpeningBalanceFilters
          properties={properties}
          units={units}
          initialFilters={{ year, propertyId, unitId }}
        />
      </div>

      {/* Summary Cards */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-4 print:shadow-none print:border-slate-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryBox label="OPENING BALANCE" value="KES 0.00" />
          <SummaryBox label="INVOICED" value="KES 0.00" />
          <SummaryBox label="PAYMENTS" value="KES 0.00" valueColor="text-[#12B76A]" />
          <SummaryBox label="CLOSING BALANCE" value="KES 0.00" valueColor="text-[#E11D48]" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-1 print:hidden">
          <div className="space-y-1">
             <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">ACTIVE SCOPE</p>
             <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] px-2 py-0.5 rounded-full text-[10px] font-black">
                  YEAR: {year}
                </Badge>
                <Badge variant="secondary" className="bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  PROPERTY: {selectedProperty?.propertyName || "ALL"}
                </Badge>
                {selectedUnit && (
                  <Badge variant="secondary" className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                    UNIT: {selectedUnit.unitNumber}
                  </Badge>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden print:shadow-none print:border-slate-200">
        <div className="overflow-x-auto p-4 bg-[#F8FAFC] print:bg-white">
          <div className="mb-4">
             <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">Monthly rent roll-forward</h3>
             {selectedUnit && (
                <p className="text-[10px] font-bold text-[#3B82F6] uppercase mt-1">Detailed report for Unit: {selectedUnit.unitNumber}</p>
             )}
          </div>
          <table className="w-full border-separate border-spacing-y-1 min-w-[800px] print:min-w-0">
            <thead>
              <tr className="bg-[#F1F5F9] print:bg-slate-100">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-left rounded-l-lg print:text-slate-900">Month</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Opening</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Invoiced</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Deductions</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Payments</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right rounded-r-lg print:text-slate-900">Closing</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr key={month} className="group">
                  <td className="px-4 py-3 bg-white border-y border-l border-[#E2E8F0] rounded-l-lg text-[11px] font-black text-[#3B82F6] print:text-slate-900">{month} {year.slice(-2)}</td>
                  <td className="px-4 py-3 bg-white border-y border-[#E2E8F0] text-[11px] text-right font-medium text-[#1E293B] print:text-slate-800">0.00</td>
                  <td className="px-4 py-3 bg-white border-y border-[#E2E8F0] text-[11px] text-right font-medium text-[#1E293B] print:text-slate-800">0.00</td>
                  <td className="px-4 py-3 bg-white border-y border-[#E2E8F0] text-[11px] text-right font-medium text-[#1E293B] print:text-slate-800">0.00</td>
                  <td className="px-4 py-3 bg-white border-y border-[#E2E8F0] text-[11px] text-right font-medium text-[#10B981] print:text-slate-800">0.00</td>
                  <td className="px-4 py-3 bg-white border-y border-r border-[#E2E8F0] rounded-r-lg text-[11px] text-right font-black text-[#1E293B] print:text-slate-900">0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT FOOTER */}
      <div className="hidden print:block mt-12 border-t border-slate-200 pt-6">
         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">TMS - Property Management System</p>
               <p className="text-[9px] text-slate-500 font-medium">This report is an official record generated for {organization?.name || "the organization"}.</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[9px] text-slate-400 italic font-medium tracking-tight">Confidential Document</p>
               <p className="text-[9px] text-slate-400 font-bold">Page 1 of 1</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value, valueColor = "text-[#1E293B]" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1 print:bg-slate-50 print:border-slate-200">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.1em] print:text-slate-500">{label}</p>
      <h3 className={cn("text-base font-black tracking-tight", valueColor, "print:text-slate-900")}>{value}</h3>
    </div>
  );
}
