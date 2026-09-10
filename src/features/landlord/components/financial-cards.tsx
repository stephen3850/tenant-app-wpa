import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, AlertCircleIcon, CreditCardIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function FinancialCards({ financial }: { financial: any }) {
  const { mtd, pm, arrears, cashAvailable } = financial;

  const revenueChange = pm.revenue > 0
    ? ((mtd.revenue - pm.revenue) / pm.revenue) * 100
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-900">Monthly Revenue (MTD)</CardTitle>
          <TrendingUpIcon className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-blue-900">{formatCurrency(mtd.revenue)}</div>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-xs font-bold ${revenueChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
             </span>
             <span className="text-xs text-muted-foreground uppercase font-semibold">vs Last Month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-red-50/30 border-red-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-red-900">Total Expenses (MTD)</CardTitle>
          <TrendingDownIcon className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-red-900">{formatCurrency(mtd.expenses)}</div>
          <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold">Maintenance & Operations</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-900">Net Income</CardTitle>
          <WalletIcon className="h-5 w-5 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-900">{formatCurrency(mtd.revenue.minus(mtd.expenses))}</div>
          <p className="text-xs text-emerald-600 font-bold mt-1 uppercase">Operational Profit</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-orange-900">Outstanding Arrears</CardTitle>
            <AlertCircleIcon className="h-5 w-5 text-orange-500" />
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-extrabold text-orange-700">{formatCurrency(arrears)}</div>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter mt-1">Total unpaid invoices</p>
         </CardContent>
      </Card>

      <Card className="border-indigo-200 shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-indigo-900">Owner Disbursements</CardTitle>
            <CreditCardIcon className="h-5 w-5 text-indigo-500" />
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-extrabold text-indigo-700">{formatCurrency(mtd.revenue.mul(0.9))}</div> { /* Mock 90% disbursement */ }
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter mt-1">Projected payout this month</p>
         </CardContent>
      </Card>

      <Card className="bg-slate-900 text-white border-slate-800 shadow-xl">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Portfolio Cash Available</CardTitle>
            <WalletIcon className="h-5 w-5 text-blue-400" />
         </CardHeader>
         <CardContent>
            <div className="text-3xl font-extrabold text-white">{formatCurrency(cashAvailable)}</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for disbursement</p>
         </CardContent>
      </Card>
    </div>
  );
}
