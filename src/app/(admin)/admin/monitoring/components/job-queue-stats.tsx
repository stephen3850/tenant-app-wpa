import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export function JobQueueStats({ stats }: { stats: any }) {
  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-black">Background Job Infrastructure</CardTitle>
        <div className="flex items-center gap-2">
           <span className="h-2 w-2 rounded-full bg-emerald-500" />
           <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">QStash Operational</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Queued</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.queued}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processed</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.processedToday.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-rose-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Failed</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.failedToday}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-indigo-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retry Rate</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.retryRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
