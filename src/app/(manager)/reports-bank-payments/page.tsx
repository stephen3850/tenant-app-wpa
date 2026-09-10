import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  Filter,
  Download,
  Building2,
  Calendar as CalendarIcon,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, startOfYear, endOfYear, eachMonthOfInterval, getMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PaymentsByBankReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const year = typeof searchParams.year === "string" ? parseInt(searchParams.year) : 2026;

  // Fetch all completed payments for the selected year
  const payments = await db.payment.findMany({
    where: {
      organizationId,
      status: "COMPLETED",
      paymentDate: {
        gte: startOfYear(new Date(year, 0, 1)),
        lte: endOfYear(new Date(year, 0, 1)),
      },
    },
    include: {
      invoice: true,
    }
  });

  const getCategory = (p: any) => {
    if (p.invoiceId) return "RENT";
    if (p.notes?.toLowerCase().includes("deposit")) return "DEPOSIT";
    return "OTHER";
  };

  const stats = {
    totalCollected: 0,
    rentPayments: 0,
    depositPayments: 0,
    otherPayments: 0,
    totalCount: payments.length,
    rentCount: 0,
    depositCount: 0,
    otherCount: 0,
  };

  const monthlyData = eachMonthOfInterval({
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  }).map((date) => ({
    month: format(date, "MMMM"),
    rentPayments: 0,
    rentAmount: 0,
    depositPayments: 0,
    depositAmount: 0,
    otherPayments: 0,
    otherAmount: 0,
    totalCount: 0,
    totalAmount: 0,
  }));

  const bankDistribution: { [key: string]: { count: number, total: number } } = {};

  payments.forEach((p) => {
    const amount = Number(p.amount);
    const cat = getCategory(p);
    const monthIdx = getMonth(p.paymentDate);

    stats.totalCollected += amount;
    monthlyData[monthIdx].totalAmount += amount;
    monthlyData[monthIdx].totalCount += 1;

    if (cat === "RENT") {
      stats.rentPayments += amount;
      stats.rentCount += 1;
      monthlyData[monthIdx].rentAmount += amount;
      monthlyData[monthIdx].rentPayments += 1;
    } else if (cat === "DEPOSIT") {
      stats.depositPayments += amount;
      stats.depositCount += 1;
      monthlyData[monthIdx].depositAmount += amount;
      monthlyData[monthIdx].depositPayments += 1;
    } else {
      stats.otherPayments += amount;
      stats.otherCount += 1;
      monthlyData[monthIdx].otherAmount += amount;
      monthlyData[monthIdx].otherPayments += 1;
    }

    const method = p.method || "OTHER";
    if (!bankDistribution[method]) {
      bankDistribution[method] = { count: 0, total: 0 };
    }
    bankDistribution[method].count += 1;
    bankDistribution[method].total += amount;
  });

  const sortedBanks = Object.entries(bankDistribution)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([method, data]) => ({
      method,
      ...data,
      share: stats.totalCollected > 0 ? (data.total / stats.totalCollected) * 100 : 0
    }));

  return (
    <div className="p-3 lg:p-4 space-y-4 bg-[#F8FAFC] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#56A600] uppercase tracking-[0.2em]">REPORTS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Payments by Bank</h1>
          <p className="text-[11px] font-medium text-[#64748B]">
            See how collections are distributed across bank channels and how rent and deposits move through the year.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-8 px-3 rounded-lg border-[#E2E8F0] text-[#56A600] font-bold text-[10px] gap-1.5 shadow-sm hover:bg-green-50">
             <TrendingUp className="h-3.5 w-3.5" />
             Rent Report
           </Button>
           <Button variant="outline" className="h-8 px-3 rounded-lg border-[#1E293B] text-[#1E293B] font-bold text-[10px] gap-1.5 shadow-sm hover:bg-slate-50" asChild>
             <Link href="/reports">
               <ArrowLeft className="h-3.5 w-3.5" />
               Reports
             </Link>
           </Button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="space-y-1 min-w-[150px]">
          <label className="text-[10px] font-black text-[#1E293B] ml-0.5 uppercase tracking-wider">Year</label>
          <Input
            type="number"
            defaultValue={year}
            className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg shadow-sm bg-white"
          />
        </div>
        <div className="flex-1">
           <p className="text-[11px] font-medium text-[#64748B] leading-tight">
             This report now pairs bank ranking with month-by-month rent, deposit, and other payment totals for {year}.
           </p>
        </div>
        <Button className="h-8 px-6 bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold text-[11px] rounded-lg shadow-sm gap-2 uppercase tracking-tight">
          <Filter className="h-3 w-3 fill-white" />
          Apply
        </Button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total collected"
          value={`KES ${stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subValue={`${stats.totalCount} payment(s) recorded in ${year}`}
        />
        <StatCard
          label="Rent payments"
          value={`KES ${stats.rentPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subValue={`${stats.rentCount} rent payment(s) posted in ${year}`}
        />
        <StatCard
          label="Deposit payments"
          value={`KES ${stats.depositPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subValue={`${stats.depositCount} deposit payment(s) posted in ${year}`}
        />
        <StatCard
          label="Other payments"
          value={`KES ${stats.otherPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subValue={`${stats.otherCount} payment(s) grouped as Others`}
        />
      </div>

      {/* Payments by Month Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9] bg-[#F9FAFB]/50">
          <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">Payments by month</h2>
          <p className="text-[10px] font-medium text-[#64748B]">Monthly totals for rent, deposits, and other balance-affecting payments in {year}.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider">Month</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Rent payments</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Rent amount</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Deposit payments</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Deposit amount</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Other payments</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Other amount</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Payments</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {monthlyData.map((m) => (
                <tr key={m.month} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-2 text-[11px] font-bold text-[#1E293B]">{m.month}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">{m.rentPayments}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">KES {m.rentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">{m.depositPayments}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">KES {m.depositAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">{m.otherPayments}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-[#64748B] text-right">KES {m.otherAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 text-[11px] font-bold text-[#1E293B] text-right">{m.totalCount}</td>
                  <td className="px-4 py-2 text-[11px] font-bold text-[#1E293B] text-right">KES {m.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr className="bg-[#F8FAFC] font-black">
                <td className="px-4 py-2 text-[11px] text-[#1E293B] uppercase">Total</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">{stats.rentCount}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">KES {stats.rentPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">{stats.depositCount}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">KES {stats.depositPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">{stats.otherCount}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">KES {stats.otherPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">{stats.totalCount}</td>
                <td className="px-4 py-2 text-[11px] text-[#1E293B] text-right">KES {stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Distribution Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9] bg-[#F9FAFB]/50">
          <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">Bank distribution</h2>
          <p className="text-[10px] font-medium text-[#64748B]">{sortedBanks.length} bank(s) recorded in {year} with a combined total of KES {stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider">Rank</th>
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider">Bank</th>
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider">Account</th>
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Payments</th>
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-center">Share of total</th>
                <th className="px-6 py-2 text-[9px] font-black text-[#64748B] uppercase tracking-wider text-right">Total amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {sortedBanks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1 opacity-50">
                       <Building2 className="h-6 w-6 text-[#94A3B8]" />
                       <p className="text-[11px] font-medium text-[#64748B]">No payments found for {year}.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedBanks.map((bank, index) => (
                  <tr key={bank.method} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-2.5 text-[11px] font-medium text-[#64748B]">{index + 1}</td>
                    <td className="px-6 py-2.5 text-[11px] font-black text-[#1E293B] uppercase">{bank.method}</td>
                    <td className="px-6 py-2.5 text-[11px] font-medium text-[#64748B]">---</td>
                    <td className="px-6 py-2.5 text-[11px] font-bold text-[#1E293B] text-right">{bank.count}</td>
                    <td className="px-6 py-2.5 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                             <div
                                className="h-full bg-[#3B82F6] rounded-full"
                                style={{ width: `${bank.share}%` }}
                             />
                          </div>
                          <span className="text-[10px] font-black text-[#1E293B]">{bank.share.toFixed(1)}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-2.5 text-[11px] font-black text-[#1E293B] text-right">
                      KES {bank.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
      <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider">{label}</p>
      <h3 className="text-lg font-black text-[#1E293B] tracking-tight">{value}</h3>
      <p className="text-[10px] font-medium text-[#94A3B8] leading-tight">{subValue}</p>
    </div>
  );
}
