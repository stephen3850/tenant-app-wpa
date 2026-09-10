"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, UserCheck, UserX, Hammer, Percent } from "lucide-react";

interface UnitStatsProps {
  stats: {
    total: number;
    occupied: number;
    vacant: number;
    maintenance: number;
    occupancyRate: number;
  };
}

export function UnitStats({ stats }: UnitStatsProps) {
  const items = [
    {
      title: "Total Units",
      value: stats.total,
      icon: DoorOpen,
      color: "text-blue-600",
    },
    {
      title: "Occupied",
      value: stats.occupied,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Vacant",
      value: stats.vacant,
      icon: UserX,
      color: "text-red-600",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: Hammer,
      color: "text-orange-600",
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate.toFixed(1)}%`,
      icon: Percent,
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
