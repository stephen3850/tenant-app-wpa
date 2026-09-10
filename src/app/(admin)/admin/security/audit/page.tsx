import { getAuditLogs } from "@/actions/security-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  History,
  Database,
  Download,
  Terminal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const { logs, total } = await getAuditLogs(params);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Audit Logs</h1>
          <p className="text-slate-500 font-medium">Immutable record of all platform activities and data mutations.</p>
        </div>
        <Button variant="outline" className="font-bold border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by user, entity, or action..." className="pl-10 font-medium border-slate-200 focus-visible:ring-slate-900" />
          </div>
          <Button variant="outline" className="font-bold border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Timestamp</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">User</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Action</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Entity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">IP Address</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-500 text-xs pl-6">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{log.user?.name || "System"}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.user?.email || "automated-job"}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-black text-[9px] uppercase bg-slate-100 text-slate-700 border-slate-200">
                      {log.action}
                   </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-slate-400" />
                    <span className="font-bold text-slate-700 text-xs">{log.entity}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{log.entityId.slice(-6)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {log.ipAddress || "::1"}
                </TableCell>
                <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
