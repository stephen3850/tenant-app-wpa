"use client";

import {
  Building2,
  Home,
  Users,
  FileText,
  Percent,
  CreditCard,
  Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  propertyCount: number;
  unitCount: number;
  tenantCount: number;
  leaseCount: number;
  occupancyRate: number;
  outstandingBalance: number;
  collectionsThisMonth: number;
}

export function StatCards({ stats }: { stats: Stats }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const items = [
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: Percent,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Across all properties"
    },
    {
      label: "Collections (MTD)",
      value: formatCurrency(stats.collectionsThisMonth),
      icon: Banknote,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Monthly collections"
    },
    {
      label: "Outstanding",
      value: formatCurrency(stats.outstandingBalance),
      icon: CreditCard,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      description: "Pending payments"
    },
    {
      label: "Active Leases",
      value: stats.leaseCount,
      icon: FileText,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      description: "Current contracts"
    },
    {
      label: "Total Properties",
      value: stats.propertyCount,
      icon: Building2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "In your portfolio"
    },
    {
      label: "Total Units",
      value: stats.unitCount,
      icon: Home,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      description: "Managed units"
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="border-border shadow-sm hover:shadow-md transition-all group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</CardTitle>
            <div className={`p-2 rounded-lg ${item.bg} ${item.color} transition-colors group-hover:scale-110 duration-200`}>
              <item.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{item.value}</div>
            <p className="text-xs text-muted-foreground font-medium">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
