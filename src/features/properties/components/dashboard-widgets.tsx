"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, Archive, BarChart3 } from "lucide-react";

interface DashboardWidgetsProps {
  stats: {
    total: number;
    active: number;
    archived: number;
    occupancy: number;
  };
}

export function PropertyDashboardWidgets({ stats }: DashboardWidgetsProps) {
  const items = [
    {
      title: "Total Properties",
      value: stats.total,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Active Properties",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Archived",
      value: stats.archived,
      icon: Archive,
      color: "text-gray-600",
    },
    {
      title: "Avg. Occupancy",
      value: `${stats.occupancy}%`,
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
