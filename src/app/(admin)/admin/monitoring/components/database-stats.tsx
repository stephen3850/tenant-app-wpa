import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, Timer, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DatabaseStats({ stats }: { stats: any }) {
  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500">Status</span>
          <Badge className="bg-emerald-100 text-emerald-700 font-black border-none uppercase text-[10px]">
            {stats.status}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Server className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Connections</span>
                <span className="text-xs font-bold text-slate-900">{stats.activeConnections}/{stats.maxConnections}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${(stats.activeConnections / stats.maxConnections) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Timer className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Query Performance</p>
              <p className="text-sm font-black text-slate-900">{stats.queryPerformance}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Search className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slow Queries (24h)</p>
              <p className="text-sm font-black text-rose-600">{stats.slowQueries}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
