import { getSecurityIncidents } from "@/actions/security-admin";
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
  AlertTriangle,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

export default async function SecurityIncidentsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const { incidents, total } = await getSecurityIncidents(params);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Incident Center</h1>
          <p className="text-slate-500 font-medium">Coordinate investigations and resolve security breaches.</p>
        </div>
        <Button className="bg-slate-900 text-white font-bold">
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Investigator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Open Incidents" value={incidents.filter((i:any) => i.status !== 'CLOSED').length} icon={AlertTriangle} color="text-rose-600" />
          <StatCard title="Critical Breaches" value={incidents.filter((i:any) => i.severity === 'CRITICAL').length} icon={ShieldCheck} color="text-amber-600" />
          <StatCard title="Resolved (24h)" value="0" icon={ShieldCheck} color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Incident #</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Title</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Severity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Target User</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident: any) => (
              <TableRow key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-black text-xs text-slate-500 pl-6">
                  {incident.incidentNumber}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{incident.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(incident.createdAt).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <SeverityBadge severity={incident.severity} />
                </TableCell>
                <TableCell>
                   <StatusBadge status={incident.status} />
                </TableCell>
                <TableCell>
                   {incident.targetUser ? (
                     <div className="flex flex-col text-xs">
                        <span className="font-bold text-slate-700">{incident.targetUser.name}</span>
                        <span className="text-slate-400">{incident.targetUser.email}</span>
                     </div>
                   ) : <span className="text-slate-400 text-xs italic">N/A</span>}
                </TableCell>
                <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black text-blue-600 uppercase">
                        Investigate
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

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    )
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: any = {
    CRITICAL: "bg-rose-100 text-rose-700 border-rose-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={`${styles[severity]} font-bold text-[10px] uppercase px-2`}>
      {severity}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    OPEN: "bg-rose-50 text-rose-600 border-rose-100",
    INVESTIGATING: "bg-blue-50 text-blue-600 border-blue-100",
    ESCALATED: "bg-orange-50 text-orange-600 border-orange-100",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CLOSED: "bg-slate-50 text-slate-400 border-slate-200",
  };
  return (
    <Badge variant="outline" className={`${styles[status]} font-bold text-[10px] uppercase px-2`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
