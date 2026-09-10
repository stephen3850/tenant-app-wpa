import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueActions } from "./revenue-actions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PropertyRevenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  const [property, organization] = await Promise.all([
    db.property.findUnique({
      where: { id: id },
    }),
    db.organization.findUnique({
      where: { id: organizationId },
      select: { name: true }
    })
  ]);

  if (!property) redirect("/reports-property-revenue");

  const months = [
    "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026",
    "July 2026", "August 2026", "September 2026", "October 2026", "November 2026", "December 2026"
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8FAFC] min-h-screen font-inter print:bg-white print:p-8 print:m-0">

      {/* CSS to hide browser default headers and footers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .print-header { display: flex !important; }
        }
      `}} />

      {/* PROFESSIONAL PRINT HEADER (Hidden in UI) */}
      <div className="hidden print-header hidden flex-col border-b-2 border-[#56A600] pb-4 mb-6">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-2xl font-black text-[#56A600] uppercase tracking-tight">{organization?.name || "TMS"}</h1>
              <p className="text-sm font-bold text-slate-600">Property Revenue Report - 2026</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Generated on</p>
              <p className="text-xs font-black text-slate-900">{format(new Date(), "PPP p")}</p>
           </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
            <h2 className="text-xl font-black text-slate-900">{property.propertyName}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase">{property.propertyCode} • {property.address}</p>
        </div>
      </div>

      {/* Header Section (Hidden in Print) */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/reports-property-revenue">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-[#64748B]" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REVENUE SUMMARY</p>
            <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">{property.propertyName}</h1>
            <p className="text-[11px] font-medium text-[#64748B]">{property.propertyCode} • {property.address}</p>
          </div>
        </div>
        <RevenueActions />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">YEAR TO DATE REVENUE</p>
            <h3 className="text-2xl font-black text-[#1E293B] mt-1">KES 0.00</h3>
            <p className="text-[11px] text-green-600 font-bold mt-2 print:hidden">↑ 0% from last year</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">OCCUPANCY RATE</p>
            <h3 className="text-2xl font-black text-[#1E293B] mt-1">0%</h3>
            <p className="text-[11px] text-[#64748B] font-medium mt-2">Based on current leases</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">PENDING ARREARS</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">KES 0.00</h3>
            <p className="text-[11px] text-[#64748B] font-medium mt-2">Across all units</p>
         </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden print:shadow-none print:border-slate-200">
        <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between print:bg-slate-50">
          <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">Monthly Revenue Breakdown (2026)</h2>
          <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-[#3B82F6] print:hidden">
            Filter Year
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9] print:bg-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-[#64748B] uppercase print:text-slate-900">Month</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Rent Revenue</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Utility Revenue</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Other Inflows</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#64748B] uppercase text-right print:text-slate-900">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {months.map((month) => (
                <tr key={month} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4 text-[12px] font-bold text-[#1E293B] print:text-slate-900">{month}</td>
                  <td className="px-6 py-4 text-[12px] font-medium text-[#64748B] text-right print:text-slate-800">0.00</td>
                  <td className="px-6 py-4 text-[12px] font-medium text-[#64748B] text-right print:text-slate-800">0.00</td>
                  <td className="px-6 py-4 text-[12px] font-medium text-[#64748B] text-right print:text-slate-800">0.00</td>
                  <td className="px-6 py-4 text-[12px] font-black text-[#1E293B] text-right print:text-slate-900">0.00</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#1E293B] text-white print:bg-slate-900 print:text-white">
               <tr className="font-black">
                  <td className="px-6 py-4 text-[12px] uppercase">Annual Total</td>
                  <td className="px-6 py-4 text-[12px] text-right">0.00</td>
                  <td className="px-6 py-4 text-[12px] text-right">0.00</td>
                  <td className="px-6 py-4 text-[12px] text-right">0.00</td>
                  <td className="px-6 py-4 text-[12px] text-right">KES 0.00</td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PRINT FOOTER */}
      <div className="hidden print:block mt-12 border-t border-slate-200 pt-6">
         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">TMS - Property Management System</p>
               <p className="text-[9px] text-slate-500 font-medium">This report is an official revenue summary for {property.propertyName}.</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[9px] text-slate-400 italic font-medium tracking-tight">Confidential Revenue Data</p>
               <p className="text-[9px] text-slate-400 font-bold">Page 1 of 1</p>
            </div>
         </div>
      </div>
    </div>
  );
}
