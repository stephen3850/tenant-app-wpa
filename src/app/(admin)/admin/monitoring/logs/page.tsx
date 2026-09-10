import { getAxiomLogs } from "@/features/monitoring/actions/monitoring-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Terminal, Database, ShieldAlert, Cpu } from "lucide-react";

export default async function LogsExplorerPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const logs = await getAxiomLogs(params.q);

  return (
    <div className="space-y-8 pb-12 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logs Explorer</h1>
          <p className="text-slate-500 font-medium">Query structured application and infrastructure logs via Axiom.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-2">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button className="bg-slate-900 font-bold">
            <Terminal className="mr-2 h-4 w-4" />
            Live Tail
          </Button>
        </div>
      </div>

      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search logs (message, level, orgId, service)..."
            className="pl-10 font-medium border-2 focus-visible:ring-slate-900 h-12 rounded-xl"
            defaultValue={params.q || ""}
          />
        </div>
        <Button variant="outline" className="h-12 w-12 border-2 rounded-xl p-0">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-800 p-2 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 px-4">
           <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
              <Cpu className="h-3 w-3" />
              Runtime Logs
           </div>
           <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
              <Database className="h-3 w-3" />
              DB Queries
           </div>
           <div className="flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" />
              Security
           </div>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-2">
          {logs.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-500 italic">
              No logs found matching your criteria.
            </div>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 hover:bg-slate-800/50 p-1.5 rounded transition-colors group">
              <span className="text-slate-500 shrink-0 select-none">[{log.timestamp.toLocaleTimeString()}]</span>
              <span className={`font-black shrink-0 w-16 ${
                log.level === 'ERROR' ? 'text-rose-500' :
                log.level === 'WARN' ? 'text-amber-500' :
                log.level === 'SECURITY' ? 'text-indigo-400' : 'text-emerald-400'
              }`}>{log.level}</span>
              <span className="text-blue-400 shrink-0">[{log.service}]</span>
              <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
              {log.org && <span className="text-slate-500 ml-auto italic">org:{log.org}</span>}
            </div>
          ))}
        </div>
        <div className="bg-slate-800/50 p-3 flex items-center justify-between shrink-0 px-6">
           <span className="text-xs font-bold text-slate-500">Showing {logs.length} events</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Axiom TMS-V2-PROD-CLUSTER</span>
        </div>
      </div>
    </div>
  );
}
