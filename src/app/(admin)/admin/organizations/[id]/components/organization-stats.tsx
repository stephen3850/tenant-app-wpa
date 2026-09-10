import { Card, CardContent } from "@/components/ui/card";
import {
    UsersIcon,
    Building2Icon,
    HomeIcon,
    KeyIcon,
    BriefcaseIcon
} from "lucide-react";

export function OrganizationStats({ org }: { org: any }) {
  const stats = [
    { label: "Total Users", value: org._count.users, icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Properties", value: org._count.properties, icon: Building2Icon, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Tenants", value: org._count.tenants, icon: HomeIcon, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Leases", value: org._count.leases, icon: KeyIcon, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
