import { Card, CardContent } from "@/components/ui/card";
import { Zap, ToggleLeft, ToggleRight, Calendar, Users } from "lucide-react";

export function FeatureStats({ stats }: { stats: any }) {
  const items = [
    {
      label: "Total Flags",
      value: stats.totalFlags,
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active",
      value: stats.activeFlags,
      icon: ToggleRight,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Scheduled",
      value: stats.scheduledFlags,
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Overrides",
      value: stats.totalOverrides,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
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
                <p className="text-2xl font-black text-slate-900">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
