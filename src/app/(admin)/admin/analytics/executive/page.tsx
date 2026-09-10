import { getExecutiveAnalytics } from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Building2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default async function ExecutiveAnalyticsPage() {
  const data = await getExecutiveAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium">Strategic KPIs and growth indicators.</p>
        </div>
        <div className="flex gap-2">
            {/* Date Range Picker Placeholder */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Active Users"
          value={data.kpis.mau.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="+12.5%"
          trendType="up"
          description="Last 30 days"
        />
        <MetricCard
          title="Daily Active Users"
          value={data.kpis.dau.toLocaleString()}
          icon={<Activity className="w-5 h-5" />}
          trend="+5.2%"
          trendType="up"
          description="Last 24 hours"
        />
        <MetricCard
          title="Active Organizations"
          value={data.kpis.activeOrgs.toString()}
          icon={<Building2 className="w-5 h-5" />}
          trend="+2"
          trendType="up"
          description="Paid subscriptions"
        />
        <MetricCard
          title="DAU/MAU Ratio"
          value={`${data.kpis.dauMauRatio.toFixed(1)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+0.8%"
          trendType="up"
          description="User stickiness"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="font-bold">Growth Trends</CardTitle>
            <CardDescription>MAU vs DAU over the last 90 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center bg-slate-50/50 rounded-b-xl border-t border-slate-100">
             <span className="text-slate-400 font-medium">Interactive Chart Component (Recharts)</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="font-bold">Conversion Funnel</CardTitle>
            <CardDescription>Trial to Active conversion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
             <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Trials (Active)</span>
                    <span className="font-bold">{data.kpis.trialOrgs}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[100%]" />
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Converted</span>
                    <span className="font-bold">{Math.round(data.kpis.activeOrgs * 0.15)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[15%]" />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendType, description }: any) {
  return (
    <Card className="shadow-sm border-slate-200 hover:border-slate-300 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="flex items-center mt-1">
          {trendType === "up" ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-rose-500 mr-1" />
          )}
          <span className={`text-xs font-bold ${trendType === "up" ? "text-emerald-600" : "text-rose-600"}`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400 ml-1.5 font-medium">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
