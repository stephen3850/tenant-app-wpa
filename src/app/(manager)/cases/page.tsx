import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { caseRepository } from "@/features/cases/repositories/case-repository";
import { caseCategoryRepository } from "@/features/cases/repositories/case-category-repository";
import { serialize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default async function CasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const casesData = await caseRepository.findMany(organizationId);
  const categoriesData = await caseCategoryRepository.findMany(organizationId);

  const cases = serialize(casesData);
  const categories = serialize(categoriesData);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-none text-[9px] font-bold px-2 py-0">Critical</Badge>;
      case "HIGH": return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-none text-[9px] font-bold px-2 py-0">High</Badge>;
      case "MEDIUM": return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[9px] font-bold px-2 py-0">Medium</Badge>;
      case "LOW": return <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50 border-none text-[9px] font-bold px-2 py-0">Low</Badge>;
      default: return <Badge variant="outline" className="text-[9px] px-2 py-0">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLOSED":
      case "RESOLVED": return <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-none text-[9px] font-bold px-2 py-0">Resolved</Badge>;
      case "UNDER_REVIEW":
      case "INVESTIGATING": return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[9px] font-bold px-2 py-0">Investigating</Badge>;
      case "OPEN": return <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50 border-none text-[9px] font-bold px-2 py-0">Open</Badge>;
      default: return <Badge variant="outline" className="text-[9px] px-2 py-0">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8F9FB] min-h-screen">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">ADMINISTRATIVE</p>
          <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Cases</h1>
          <p className="text-[12px] font-medium text-[#64748B]">Track escalations, disputes, compliance, and long-running matters.</p>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-9 px-5 rounded-lg text-[13px] shadow-sm transition-all active:scale-95" asChild>
            <Link href="/cases/new">Open Case</Link>
          </Button>
          <div className="bg-[#0F172A] text-white h-9 px-4 flex items-center gap-3 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
            <span className="text-lg font-black leading-none">{cases.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Search</label>
            <Input
              placeholder="Ref, subject, tenant"
              className="h-9 text-[12px] font-bold rounded-lg border-[#E2E8F0] bg-white focus-visible:ring-1 focus-visible:ring-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Type</label>
            <div className="relative">
              <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-[#E2E8F0] rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all">
                <option>All</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Priority</label>
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
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <Button className="h-9 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[12px] rounded-lg shadow-sm transition-all active:scale-95 px-8">
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
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Ref</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Subject</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Tenant</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Type</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Status</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Priority</TableHead>
                <TableHead className="text-slate-500 font-bold text-[11px] px-4">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <p className="text-[11px] font-medium text-slate-400">No cases found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((c: any) => (
                  <TableRow key={c.id} className="border-b border-[#F1F5F9] hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-4 py-2.5 font-black text-slate-900 text-[12px] uppercase">
                      {c.caseNumber}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-[11px] font-semibold text-slate-600">
                      {c.subject}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-[11px] font-bold text-slate-700">
                      {c.tenant ? `${c.tenant.firstName} ${c.tenant.lastName}` : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-tighter">
                      {c.category?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      {getStatusBadge(c.status)}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      {getPriorityBadge(c.severity)}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-[11px] font-bold text-slate-400 tabular-nums">
                      {format(new Date(c.updatedAt), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
