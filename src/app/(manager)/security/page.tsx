import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  Play,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function SecurityLogbookPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch properties for filter
  const properties = await db.property.findMany({
    where: { organizationId },
    select: { id: true, propertyName: true }
  });

  // Fetch categories for filter
  const categories = await db.securityIncidentCategory.findMany({
    where: { organizationId },
    select: { id: true, name: true }
  });

  // Fetch incidents
  const rawIncidents = await db.securityIncident.findMany({
    where: { organizationId },
    include: {
      property: true,
      category: true,
      recordedBy: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const incidents = serialize(rawIncidents);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      {/* Dark Green Header Card */}
      <div className="m-4 lg:m-6 bg-[#04241B] rounded-xl text-white p-6 lg:p-8 shadow-lg overflow-hidden relative">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest opacity-80">OPERATIONS</p>
            <h1 className="text-3xl font-black tracking-tight">Security Logbook</h1>
            <p className="text-[12px] text-emerald-100/60 font-medium">Incidents, control room logs, patrol rounds, and safety checks.</p>
          </div>
          <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-8 px-4 font-bold text-[12px] rounded-lg shadow-sm" asChild>
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 relative z-10">
          <Button className="bg-[#2D3F39] hover:bg-[#3D4F49] text-white font-bold h-8 px-4 rounded-lg text-[12px] shadow-sm">
            Incidents
          </Button>
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-bold h-8 px-4 rounded-lg text-[12px]">
            Control Room
          </Button>
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-bold h-8 px-4 rounded-lg text-[12px]">
            Patrols
          </Button>
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-bold h-8 px-4 rounded-lg text-[12px]">
            Equipment Checks
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-6 pb-8 space-y-4">
        {/* Add Section Toggle */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <button className="w-full flex items-center gap-2.5 px-6 py-3.5 hover:bg-slate-50/50 transition-colors group">
            <Play className="h-2 w-2 text-slate-900 fill-current" />
            <span className="text-[12px] font-black text-[#1E293B]">Add new Incidents</span>
          </button>
        </div>

        {/* Filter Section Card */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Search</label>
              <Input
                placeholder="Search..."
                className="h-9 text-[12px] font-bold rounded-lg border-[#E2E8F0] bg-white focus-visible:ring-1 focus-visible:ring-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Property</label>
              <div className="relative">
                <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-[#E2E8F0] rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all">
                  <option>All</option>
                  {properties.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.propertyName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Category</label>
              <div className="relative">
                <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-[#E2E8F0] rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all">
                  <option>All</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Severity</label>
              <div className="relative">
                <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-[#E2E8F0] rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all">
                  <option>All</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Status</label>
              <div className="relative">
                <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-[#E2E8F0] rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all">
                  <option>All</option>
                  <option value="OPEN">Open</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4 pt-2 border-t border-slate-50">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">From</label>
                <div className="relative">
                  <Input
                    placeholder="mm/dd/yyyy"
                    className="h-9 text-[12px] font-bold rounded-lg border-[#E2E8F0] bg-white pl-3 pr-8"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">To</label>
                <div className="relative">
                  <Input
                    placeholder="mm/dd/yyyy"
                    className="h-9 text-[12px] font-bold rounded-lg border-[#E2E8F0] bg-white pl-3 pr-8"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
            <Button className="h-9 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[12px] rounded-lg shadow-sm px-10 transition-all active:scale-95">
              Filter
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F8F9FB]/50">
                <TableRow className="hover:bg-transparent border-b border-[#E2E8F0] h-10">
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">When</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Ref</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Property</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Tenant/Unit</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Category</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Severity</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Status</TableHead>
                  <TableHead className="text-slate-500 font-bold text-[11px] px-4">Assigned</TableHead>
                  <TableHead className="text-right font-bold text-[11px] text-slate-500 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-40 text-center">
                      <p className="text-[11px] font-medium text-slate-400 italic">No incidents found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident: any) => (
                    <TableRow key={incident.id} className="border-b border-[#F1F5F9] hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="px-4 py-2.5 text-[11px] font-bold text-slate-500 tabular-nums">
                        {format(new Date(incident.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 font-black text-slate-900 text-[12px] uppercase">
                        {incident.logNumber}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-[11px] font-bold text-slate-700">
                        {incident.property.propertyName}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-[11px] font-medium text-slate-500">
                        -
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                         <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tight border-slate-200 bg-slate-50 px-2 py-0">
                           {incident.category.name}
                         </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        {getSeverityBadge(incident.severity)}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        {getStatusBadge(incident.status)}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-[11px] font-bold text-slate-600">
                        {incident.recordedBy?.name || "Unassigned"}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "CRITICAL": return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-none text-[9px] font-bold px-2 py-0">CRITICAL</Badge>;
    case "HIGH": return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-none text-[9px] font-bold px-2 py-0">HIGH</Badge>;
    case "MEDIUM": return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[9px] font-bold px-2 py-0">MEDIUM</Badge>;
    case "LOW": return <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50 border-none text-[9px] font-bold px-2 py-0">LOW</Badge>;
    default: return <Badge variant="outline" className="text-[9px] font-bold px-2 py-0">{severity}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "CLOSED": return <Badge className="bg-slate-50 text-slate-500 hover:bg-slate-50 border-none text-[9px] font-bold px-2 py-0">CLOSED</Badge>;
    case "RESOLVED": return <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-none text-[9px] font-bold px-2 py-0">RESOLVED</Badge>;
    case "INVESTIGATING": return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[9px] font-bold px-2 py-0">INVESTIGATING</Badge>;
    case "OPEN": return <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none text-[9px] font-bold px-2 py-0">OPEN</Badge>;
    default: return <Badge variant="outline" className="text-[9px] font-bold px-2 py-0">{status}</Badge>;
  }
}
