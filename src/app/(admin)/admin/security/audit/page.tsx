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

export default async function AuditLogsPage({ searchParams }: any) {
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
            Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by action, entity or ID..."
            className="pl-10 border-slate-200 bg-slate-50/50"
          />
        </div>
        <Button variant="outline" className="border-slate-200 font-bold">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Timestamp</TableHead>
              <TableHead className="font-bold text-slate-700">Actor</TableHead>
              <TableHead className="font-bold text-slate-700">Event</TableHead>
              <TableHead className="font-bold text-slate-700">Entity</TableHead>
              <TableHead className="font-bold text-slate-700">Organization</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-[10px] font-mono font-medium text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900 text-sm">{log.user?.name || "System"}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{log.user?.email || "automated-process"}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50 font-bold text-[10px] uppercase tracking-wider px-2">
                    {log.action.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Database className="w-3 h-3 text-slate-400" />
                      {log.entity} <span className="text-slate-300">/</span> {log.entityId}
                   </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-500">
                    {log.organization?.name || "Global Platform"}
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="w-4 h-4" />
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
