"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Hourglass, FileX, RefreshCw, Banknote } from "lucide-react";
import { LeaseStats as LeaseStatsType } from "../types";
import { formatCurrency } from "@/lib/utils";

interface LeaseStatsProps {
  stats: LeaseStatsType;
}

export function LeaseStats({ stats }: LeaseStatsProps) {
  const items = [
    {
      title: "Active Leases",
      value: stats.activeLeases,
      icon: FileCheck,
      color: "text-green-600",
    },
    {
      title: "Expiring Soon",
      value: stats.expiringLeases,
      icon: Hourglass,
      color: "text-orange-600",
    },
    {
      title: "Expired",
      value: stats.expiredLeases,
      icon: FileX,
      color: "text-red-600",
    },
    {
      title: "Renewed",
      value: stats.renewedLeases,
      icon: RefreshCw,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
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
