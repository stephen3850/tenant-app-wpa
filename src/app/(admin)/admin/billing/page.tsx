import { getSubscriptionDashboard } from "@/actions/subscription-billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CreditCardIcon,
    TrendingUpIcon,
    UsersIcon,
    AlertCircleIcon,
    ActivityIcon,
    DollarSignIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function BillingDashboardPage() {
  const stats = await getSubscriptionDashboard();

  const kpis = [
    {
      label: "Monthly Recurring Revenue",
      value: `$${Number(stats.mrr).toLocaleString()}`,
      description: "Projected monthly revenue",
      icon: DollarSignIcon,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions,
      description: "Paying organizations",
      icon: CreditCardIcon,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Free Trials",
      value: stats.trialOrganizations,
      description: `${stats.expiringTrials} expiring soon`,
      icon: ActivityIcon,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Failed Payments",
      value: stats.failedPayments,
      description: "Requires attention",
      icon: AlertCircleIcon,
      color: stats.failedPayments > 0 ? "text-red-600" : "text-slate-600",
      bg: stats.failedPayments > 0 ? "bg-red-50" : "bg-slate-50"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Revenue</h1>
        <p className="text-slate-500 font-medium">Manage platform subscriptions, plans, and financial performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge variant="outline" className="font-bold border-slate-200">
                    SaaS
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{kpi.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                <p className="text-xs font-bold text-slate-400">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-80 flex items-center justify-center bg-slate-50/50 rounded-b-xl">
             {/* Chart Component Placeholder */}
             <div className="text-center space-y-2">
                <TrendingUpIcon className="h-12 w-12 text-blue-200 mx-auto" />
                <p className="text-sm font-bold text-slate-400">Revenue analytics visualization coming soon</p>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Churn Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase">Retention Rate</span>
                    <span className="text-green-600">98.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[98.2%]" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase">Trial Conversion</span>
                    <span className="text-blue-600">15.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[15.5%]" />
                </div>
            </div>
            <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Revenue Retention (NRR)</p>
                <p className="text-3xl font-black text-slate-900">112%</p>
                <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUpIcon className="h-3 w-3" /> Healthy expansion
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
