"use client";

import { useEffect, useState } from "react";
import { getMaintenanceStatsAction } from "../actions/maintenance-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MaintenanceStatsWidget() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenanceStatsAction().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-[120px] w-full" />;
  if (!stats) return null;

  const items = [
    { label: "Active", value: stats.activeTickets, icon: Wrench, color: "text-blue-600" },
    { label: "Pending", value: stats.openTickets, icon: Clock, color: "text-orange-600" },
    { label: "Urgent", value: stats.urgentTickets, icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label} Tickets</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
