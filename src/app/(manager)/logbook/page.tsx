import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  FileSpreadsheet,
  Search,
  RotateCcw,
  Filter as FilterIcon,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { serialize } from "@/lib/utils";

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch audit logs
  const rawLogs = await db.auditLog.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  const logs = serialize(rawLogs);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">Audit Logs</h1>
          <p className="text-sm font-medium text-[#667085] mt-0.5">Who changed what, and when.</p>
        </div>
        <Button variant="outline" className="border-[#56A600] text-[#56A600] font-bold h-10 px-4 rounded-lg gap-2 hover:bg-[#F0FDF4] transition-all">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FilterField label="START">
              <div className="relative">
                <Input type="date" className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg pl-3 pr-8" placeholder="mm/dd/yyyy" />
                <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-[#98A2B3] pointer-events-none" />
              </div>
            </FilterField>

            <FilterField label="END">
              <div className="relative">
                <Input type="date" className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg pl-3 pr-8" placeholder="mm/dd/yyyy" />
                <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-[#98A2B3] pointer-events-none" />
              </div>
            </FilterField>

            <FilterField label="ACTOR">
              <Select defaultValue="all">
                <SelectTrigger className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="ACTION">
              <Select defaultValue="all">
                <SelectTrigger className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="create">CREATE</SelectItem>
                  <SelectItem value="update">UPDATE</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="MODEL">
              <Select defaultValue="all">
                <SelectTrigger className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>
          </div>

          <div className="flex flex-col md:flex-row items-end justify-between gap-4 pt-2">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest ml-0.5">SEARCH</label>
              <div className="relative">
                <Input
                  placeholder="Record ID, model, route, actor name/email..."
                  className="h-10 text-xs border-[#DCE3EA] rounded-lg bg-[#F9FAFB]/50 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-10 px-6 rounded-lg transition-all shadow-md shadow-blue-600/20">
                Filter
              </Button>
              <Button variant="outline" className="border-[#DCE3EA] text-[#1F2937] font-bold h-10 px-6 rounded-lg hover:bg-[#F9FAFB] transition-all">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="border border-[#DCE3EA] rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-[#F9FAFB] border-b border-[#DCE3EA]">
            <TableRow className="hover:bg-transparent h-12">
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-6">Time</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Actor</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4 text-center">Action</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Model</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Record</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Changes</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-6 text-right">Route</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-sm font-medium text-[#98A2B3] italic">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-[#F5F7FA] h-14 group hover:bg-[#F9FAFB]/30">
                  <TableCell className="px-6 py-3">
                    <span className="text-[11px] font-bold text-[#1F2937] whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#1F2937]">{log.user?.name || "System"}</span>
                      <span className="text-[10px] text-[#98A2B3]">{log.user?.email || "automated-process"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight bg-slate-100 text-slate-600 border border-slate-200">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-bold text-[#667085]">{log.entity}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[10px] font-mono text-[#98A2B3] bg-[#F5F7FA] px-1.5 py-0.5 rounded">
                      #{log.entityId.slice(0, 12)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-[200px]">
                    <span className="text-[10px] text-[#667085] truncate block">
                      {log.action === "UPDATE" ? "Modified fields..." : `New ${log.entity} created`}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <span className="text-[10px] text-[#98A2B3] font-medium italic">
                      {log.route || "/dashboard"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest ml-0.5">{label}</label>
      {children}
    </div>
  );
}
