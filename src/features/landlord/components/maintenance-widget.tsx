import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WrenchIcon, AlertTriangleIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function MaintenanceWidget({ maintenance }: { maintenance: any }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <WrenchIcon className="h-5 w-5 text-purple-600" />
            Maintenance Overview
          </CardTitle>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
             MTD Costs: {formatCurrency(maintenance.totalCosts)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
             <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase">
                <ClockIcon className="h-4 w-4" /> Open Tasks
             </div>
             <p className="text-2xl font-black text-slate-900">{maintenance.open}</p>
          </div>
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
             <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">
                <WrenchIcon className="h-4 w-4" /> In Progress
             </div>
             <p className="text-2xl font-black text-blue-700">{maintenance.inProgress}</p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
             <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                <CheckCircle2Icon className="h-4 w-4" /> Resolved
             </div>
             <p className="text-2xl font-black text-emerald-700">{maintenance.resolved}</p>
          </div>
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-2 animate-pulse">
             <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase">
                <AlertTriangleIcon className="h-4 w-4" /> High Priority
             </div>
             <p className="text-2xl font-black text-red-700">{maintenance.highPriority}</p>
          </div>
        </div>

        {maintenance.highPriority > 0 && (
           <div className="mt-6 p-4 bg-red-600 text-white rounded-xl shadow-lg flex items-center gap-4">
              <AlertTriangleIcon className="h-8 w-8 text-white/80 shrink-0" />
              <div>
                 <p className="text-sm font-bold uppercase tracking-widest">Immediate Attention Required</p>
                 <p className="text-xs font-medium text-white/90">You have {maintenance.highPriority} emergency or high-priority maintenance requests pending.</p>
              </div>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
