import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Building2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PropertyRevenueReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true, propertyCode: true, address: true }
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#56A600] uppercase tracking-[0.2em]">PROPERTY REPORTS</p>
          <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Property Revenue Report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Select a property to open its monthly revenue summary.</p>
        </div>
        <Link href="/reports">
          <Button variant="outline" className="h-9 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[11px] gap-2 hover:bg-[#F8FAFC]">
            <ArrowLeft className="h-4 w-4" />
            Back to reports
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm min-h-[200px] flex flex-col items-center justify-center text-center">
        {properties.length === 0 ? (
          <p className="text-[13px] font-medium text-[#64748B]">
            No accessible properties are available for this report.
          </p>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link key={property.id} href={`/reports-property-revenue/${property.id}`} className="group">
                <div className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#56A600]/30 hover:bg-[#F9FAFB] transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-[#56A600]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[12px] font-black text-[#1E293B] group-hover:text-[#56A600] transition-colors">{property.propertyName}</p>
                      <p className="text-[10px] text-[#64748B] font-medium">{property.propertyCode} • {property.address}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#56A600] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
