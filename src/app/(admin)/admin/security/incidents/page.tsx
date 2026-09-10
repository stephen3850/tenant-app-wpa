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
import {
  AlertTriangle,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

export default async function SecurityIncidentsPage({ searchParams }: any) {
  const { incidents, total } = await getSecurityIncidents(searchParams);

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

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by incident number or title..."
            className="pl-10 border-slate-200 bg-slate-50/50"
          />
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200 font-bold">
                <Filter className="w-4 h-4 mr-2" />
                Filters
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Incident #</TableHead>
              <TableHead className="font-bold text-slate-700">Title</TableHead>
              <TableHead className="font-bold text-slate-700">Severity</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Investigator</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident: any) => (
              <TableRow key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono font-bold text-rose-600">
                  {incident.incidentNumber}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900 text-sm">{incident.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{incident.description}</div>
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={incident.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={incident.status} />
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-600">
                    {incident.investigator?.name || "Unassigned"}
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/security/incidents/${incident.id}`}>
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
            {incidents.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                        No active incidents found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
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
