"use client";

import { useEffect, useState } from "react";
import { getExpenseStatsAction } from "../actions/expense-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseStatsWidget() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenseStatsAction().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-[120px]" /><Skeleton className="h-[120px]" /><Skeleton className="h-[120px]" /></div>;
  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const items = [
    { label: "This Month", value: formatCurrency(stats.expensesThisMonth), icon: Banknote, color: "text-blue-600" },
    { label: "Outstanding", value: formatCurrency(stats.outstandingExpenses), icon: AlertCircle, color: "text-red-600" },
    { label: "Pending Approval", value: stats.pendingApprovals, icon: Clock, color: "text-orange-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
