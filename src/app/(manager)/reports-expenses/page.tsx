import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  TrendingDown,
  FileSpreadsheet,
  FileText,
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
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ExpenseReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. END-TO-END DATA WIRING
  const propertyId = typeof params.propertyId === "string" ? params.propertyId : undefined;
  const categoryId = typeof searchParams.categoryId === "string" ? searchParams.categoryId : undefined;
  const start = typeof searchParams.start === "string" ? parseISO(searchParams.start) : startOfMonth(new Date());
  const end = typeof searchParams.end === "string" ? parseISO(searchParams.end) : endOfMonth(new Date());

  // 2. PURGE DUMMY DATA: Actual DB queries
  const [properties, categories, expenses] = await Promise.all([
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true }
    }),
    db.expenseCategory.findMany({
      where: { organizationId },
      select: { id: true, name: true }
    }),
    db.expense.findMany({
      where: {
        organizationId,
        expenseDate: { gte: start, lte: end },
        ...(propertyId && propertyId !== "all" ? { propertyId } : {}),
        ...(categoryId && categoryId !== "all" ? { categoryId } : {})
      },
      include: {
        property: true,
        category: true,
      },
      orderBy: { expenseDate: "desc" }
    })
  ]);

  const totalSpend = expenses.reduce((acc, exp) => acc + Number(exp.totalAmount), 0);
  const taxedTotal = expenses.reduce((acc, exp) => acc + Number(exp.taxAmount), 0);
  const totalEntries = expenses.length;
  const avgSpend = totalEntries > 0 ? totalSpend / totalEntries : 0;

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-rose-600 uppercase tracking-[0.2em]">FINANCIAL REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Expense Report</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Review operational spend and category patterns.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="h-8 px-3 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm" asChild>
             <Link href="/reports">Back to reports</Link>
           </Button>
           <Button variant="outline" className="h-8 px-3 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm">
             <FileSpreadsheet className="h-3.5 w-3.5 text-[#1D6F42]" />
             Excel
           </Button>
        </div>
      </div>

      {/* 3. BUTTON & EVENT HANDLER RESPONSIVENESS: Filter Form */}
      <form className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
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
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">Category</label>
            <Select name="categoryId" defaultValue={categoryId || "all"}>
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] bg-white">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">From</label>
            <input name="start" type="date" defaultValue={format(start, "yyyy-MM-dd")} className="w-full h-8 px-3 rounded-md border border-[#E2E8F0] text-[11px] font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">To</label>
            <input name="end" type="date" defaultValue={format(end, "yyyy-MM-dd")} className="w-full h-8 px-3 rounded-md border border-[#E2E8F0] text-[11px] font-bold" />
          </div>
        </div>
        <Button type="submit" className="h-8 px-6 bg-[#12B76A] hover:bg-[#0f9d58] text-white font-black text-[11px] rounded-lg">
          Apply
        </Button>
      </form>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="TOTAL SPEND" value={`KES ${totalSpend.toLocaleString()}`} subValue="Net operational costs" />
        <StatCard label="TAXED TOTAL" value={`KES ${taxedTotal.toLocaleString()}`} subValue="Captured tax amounts" />
        <StatCard label="ENTRIES" value={totalEntries.toString()} subValue={`Avg KES ${avgSpend.toFixed(0)} / entry`} />
        <StatCard label="PERIOD" value={format(start, "MMM yy") + " - " + format(end, "MMM yy")} subValue="Selected range" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Date</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Expense / Category</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase">Property</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Amount</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[11px] text-[#64748B] font-medium">No expenses found for this selection.</td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 text-[11px] font-medium text-[#1E293B]">{format(new Date(exp.expenseDate), "MMM dd, yyyy")}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-[#1E293B]">{exp.category.name}</p>
                        <p className="text-[10px] text-[#64748B] truncate max-w-[200px]">{exp.notes || "---"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#64748B]">{exp.property.propertyName}</td>
                    <td className="px-4 py-3 text-[11px] font-black text-[#1E293B] text-right">{Number(exp.totalAmount).toLocaleString()}</td>
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

function StatCard({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider leading-tight">{label}</p>
      <h3 className="text-base font-black text-[#1E293B] tracking-tight">{value}</h3>
      <p className="text-[9px] font-medium text-[#94A3B8] leading-tight">{subValue}</p>
    </div>
  );
}
