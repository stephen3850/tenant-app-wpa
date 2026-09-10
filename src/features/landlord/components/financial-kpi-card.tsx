import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";
import { Prisma } from "@prisma/client";

interface FinancialKpiCardProps {
  title: string;
  value: Prisma.Decimal | number;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

export function FinancialKpiCard({ title, value, description, trend, icon, className }: FinancialKpiCardProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString() : Number(value).toLocaleString();

  return (
    <Card className={cn("overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</CardTitle>
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">{icon}</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-black text-slate-900 tracking-tight">KES {formattedValue}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <div className={cn(
              "flex items-center text-[10px] font-black px-1.5 py-0.5 rounded",
              trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {trend.isUp ? <ArrowUpRightIcon className="h-3 w-3 mr-0.5" /> : <ArrowDownRightIcon className="h-3 w-3 mr-0.5" />}
              {trend.value}%
            </div>
          )}
          {description && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
