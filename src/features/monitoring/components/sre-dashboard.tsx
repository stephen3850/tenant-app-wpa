"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertCircle,
  Database,
  Zap,
  Server,
  ShieldCheck
} from "lucide-react";
import { SystemHealthBadge } from "./system-health-badge";

export function SREDashboard() {
  const metrics = [
    {
      title: "Api Latency",
      value: "124ms",
      trend: "-12%",
      status: "healthy",
      icon: Zap,
    },
    {
      title: "Error Rate",
      value: "0.02%",
      trend: "+0.01%",
      status: "healthy",
      icon: AlertCircle,
    },
    {
      title: "DB Connections",
      value: "18/50",
      trend: "stable",
      status: "healthy",
      icon: Database,
    },
    {
      title: "M-Pesa Webhooks",
      value: "99.9%",
      trend: "100%",
      status: "healthy",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Reliability Overview</h2>
        <SystemHealthBadge />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.trend} from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Infrastructure Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Vercel Edge Runtime</span>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">PostgreSQL (Supabase)</span>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Upstash Redis (Cache)</span>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Security & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <span className="text-sm">Tenant Isolation</span>
                <Badge className="bg-emerald-500">Enforced</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Encryption at Rest</span>
                <Badge className="bg-emerald-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit Logging</span>
                <Badge className="bg-emerald-500">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
