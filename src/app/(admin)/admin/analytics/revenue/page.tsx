import { getRevenueAnalytics } from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  PieChart,
  ArrowUpRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function RevenueAnalyticsPage() {
  const data = await getRevenueAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Analytics</h1>
        <p className="text-slate-500 font-medium">Financial performance and unit economics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="MRR"
          value={formatCurrency(Number(data.mrr))}
          icon={<DollarSign className="w-5 h-5" />}
          trend="+8.2%"
          description="Monthly Recurring Rev"
        />
        <MetricCard
          title="ARR"
          value={formatCurrency(Number(data.arr))}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+15%"
          description="Annual Run Rate"
        />
        <MetricCard
          title="ARPO"
          value={formatCurrency(Number(data.arpo))}
          icon={<PieChart className="w-5 h-5" />}
          trend="+3.1%"
          description="Avg Rev Per Org"
        />
        <MetricCard
          title="CLTV"
          value={formatCurrency(Number(data.ltv))}
          icon={<CreditCard className="w-5 h-5" />}
          trend="+5.5%"
          description="Cust. Lifetime Value"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="font-bold">Revenue by Plan</CardTitle>
            <CardDescription>Distribution across subscription tiers</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {data.byPlan.map((plan: any) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 mr-3" />
                    <span className="font-bold text-slate-700">{plan.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">{formatCurrency(Number(plan.amount))}</div>
                    <div className="text-xs text-slate-400 font-medium">Monthly</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
            <CardHeader>
                <CardTitle className="font-bold">Unit Economics</CardTitle>
                <CardDescription>Efficiency and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-bold text-slate-500 uppercase mb-1">Trial Conversion Rate</div>
                    <div className="text-3xl font-black text-slate-900">{data.trialConversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Percentage of trials that convert to paid plans within 30 days.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-sm font-bold text-slate-500 uppercase mb-1">LTV:CAC</div>
                        <div className="text-xl font-black text-slate-900">3.4x</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-sm font-bold text-slate-500 uppercase mb-1">Payback Period</div>
                        <div className="text-xl font-black text-slate-900">7.2 Mo</div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, description }: any) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="flex items-center mt-1">
          <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
          <span className="text-xs font-bold text-emerald-600">{trend}</span>
          <span className="text-xs text-slate-400 ml-1.5 font-medium">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
