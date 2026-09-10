import { getIncidents } from "@/features/monitoring/actions/incident-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, ShieldAlert, ChevronRight, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function IncidentCenterPage() {
  const incidents = await getIncidents();

  const severityColors = {
    SEV1: "bg-rose-600 text-white",
    SEV2: "bg-rose-100 text-rose-700",
    SEV3: "bg-amber-100 text-amber-700",
    SEV4: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Incident Management Center</h1>
          <p className="text-slate-500 font-medium">Track system outages, service degradations, and post-mortems.</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700 font-black h-11">
          <Plus className="mr-2 h-4 w-4" />
          Declare Incident
        </Button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Incident / Severity</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Status</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Commander</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Started</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Duration</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                   <div className="flex flex-col items-center gap-2 text-slate-500">
                      <ShieldAlert className="h-8 w-8 text-slate-200" />
                      <p className="font-medium italic">No active or historical incidents recorded.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
            {incidents.map((incident) => (
              <TableRow key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Badge className={`font-black ${severityColors[incident.severity as keyof typeof severityColors]} border-none`}>
                      {incident.severity}
                    </Badge>
                    <div>
                      <p className="font-black text-slate-900">{incident.title}</p>
                      <p className="text-xs font-bold text-slate-500 line-clamp-1">{incident.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`font-bold uppercase text-[10px] ${
                    incident.status === 'RESOLVED' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-rose-200 text-rose-700 bg-rose-50'
                  }`}>
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-slate-700">{incident.commander?.name || "Unassigned"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-600">{formatDate(incident.startedAt)}</span>
                    <span className="text-[10px] font-bold text-slate-400">14:32 UTC</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-slate-500">
                    {incident.resolvedAt ? "42m" : <span className="text-rose-600 animate-pulse">Ongoing</span>}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/monitoring/incidents/${incident.id}`}>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
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
