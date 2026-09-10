"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CheckCircle, Clock, XCircle } from "lucide-react";

export function MpesaMetrics({ metrics }: { metrics: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const items = [
    { label: "Collections Today", value: formatCurrency(metrics.collectionsToday), icon: Banknote, color: "text-emerald-600" },
    { label: "Collections This Month", value: formatCurrency(metrics.collectionsThisMonth), icon: CheckCircle, color: "text-blue-600" },
    { label: "Success Rate", value: `${metrics.successRate}%`, icon: Clock, color: "text-orange-600" },
    { label: "Pending Requests", value: metrics.pendingSTKRequests, icon: Clock, color: "text-slate-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
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
