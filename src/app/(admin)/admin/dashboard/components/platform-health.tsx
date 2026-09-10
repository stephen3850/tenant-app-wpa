import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, CheckCircle2Icon, AlertCircleIcon, ZapIcon } from "lucide-react";

export function PlatformHealth({ health, expanded = false }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ActivityIcon className="h-4 w-4" /> System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold text-green-700">All Systems Operational</span>
            </div>
            <ZapIcon className="h-4 w-4 text-green-600 animate-pulse" />
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase">M-Pesa Callbacks</p>
                <span className="text-xs font-black text-slate-900">{health.mpesaCallbackSuccessRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${health.mpesaCallbackSuccessRate}%` }}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Background Jobs</p>
                <p className="text-lg font-black text-slate-900">42,810</p>
                <p className="text-[9px] font-bold text-green-600 mt-0.5">0.02% Failure Rate</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Response</p>
                <p className="text-lg font-black text-slate-900">142ms</p>
                <p className="text-[9px] font-bold text-blue-600 mt-0.5">Optimized</p>
            </div>
        </div>

        {health.criticalSecurityAlerts > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircleIcon className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                    <p className="text-xs font-black text-red-700">{health.criticalSecurityAlerts} Critical Alerts</p>
                    <p className="text-[10px] font-medium text-red-600">Action required in Security Center.</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
