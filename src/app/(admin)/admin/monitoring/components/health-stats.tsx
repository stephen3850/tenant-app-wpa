import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, Zap, AlertCircle, TrendingUp } from "lucide-react";

export function HealthStats({ stats }: { stats: any }) {
  const items = [
    { label: "Uptime", value: `${stats.uptime}%`, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Response Time", value: `${stats.responseTime}ms`, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "API Throughput", value: `${stats.apiThroughput} r/m`, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Error Rate", value: `${stats.errorRate}%`, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.label} className="border-2 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
