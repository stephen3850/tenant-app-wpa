"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserMinus, UserCheck, Ban } from "lucide-react";
import { TenantStats as TenantStatsType } from "../types";

interface TenantStatsProps {
  stats: TenantStatsType;
}

export function TenantStats({ stats }: TenantStatsProps) {
  const items = [
    {
      title: "Total Tenants",
      value: stats.totalTenants,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active",
      value: stats.activeTenants,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Former",
      value: stats.formerTenants,
      icon: UserMinus,
      color: "text-orange-600",
    },
    {
      title: "Blacklisted",
      value: stats.blacklistedTenants,
      icon: Ban,
      color: "text-red-600",
    },
    {
      title: "New This Month",
      value: stats.newTenantsThisMonth,
      icon: UserPlus,
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
