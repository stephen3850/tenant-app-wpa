import { getImpersonationSessions } from "@/actions/impersonation";
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
import {
  ShieldAlert,
  Clock,
  ExternalLink,
  History
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function ImpersonationSessionsPage() {
  const sessions = await getImpersonationSessions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Impersonation Log</h1>
        <p className="text-slate-500 font-medium">Historical audit of all support impersonation sessions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Impersonator</TableHead>
              <TableHead className="font-bold text-slate-700">Target User</TableHead>
              <TableHead className="font-bold text-slate-700">Reason</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Time</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s: any) => (
              <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-bold text-slate-900">{s.impersonator.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-700">{s.targetUser.name}</div>
                </TableCell>
                <TableCell className="max-w-xs">
                    <div className="text-sm text-slate-600 truncate">{s.reason}</div>
                    {s.caseReference && (
                        <div className="text-[10px] font-mono font-bold text-blue-600">{s.caseReference}</div>
                    )}
                </TableCell>
                <TableCell>
                  {s.isActive ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold text-[10px] uppercase">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 font-bold text-[10px] uppercase">Completed</Badge>
                  )}
                </TableCell>
                <TableCell>
                    <div className="text-sm font-bold text-slate-600">
                        {formatDistanceToNow(new Date(s.startTime), { addSuffix: true })}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(s.startTime).toLocaleTimeString()}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                        <History className="w-4 h-4" />
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
