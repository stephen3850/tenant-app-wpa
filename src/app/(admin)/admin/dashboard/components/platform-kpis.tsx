import { Card, CardContent } from "@/components/ui/card";
import {
    Building2Icon,
    UsersIcon,
    CreditCardIcon,
    ArrowUpRightIcon,
    ArrowDownRightIcon
} from "lucide-react";

export function PlatformKPIs({ orgStats, userStats, revenue }: any) {
  const kpis = [
    {
      label: "Total Organizations",
      value: orgStats.total,
      subValue: `${orgStats.active} Active`,
      icon: Building2Icon,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Total Users",
      value: userStats.total,
      subValue: `${userStats.activeNow} MAU`,
      icon: UsersIcon,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Monthly Recurring Revenue",
      value: `$${revenue.mrr.toLocaleString()}`,
      subValue: `${revenue.trialConversionRate.toFixed(1)}% Conv. Rate`,
      icon: CreditCardIcon,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "New Signups (MTD)",
      value: userStats.newSignupsMTD,
      subValue: "Current Month",
      icon: ArrowUpRightIcon,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
              <p className="text-xs font-bold text-slate-400">{kpi.subValue}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
