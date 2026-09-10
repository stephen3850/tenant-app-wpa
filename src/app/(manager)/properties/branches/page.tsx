import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function BranchesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const departments = await db.department.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-3 lg:p-6 space-y-4 bg-[#F5F7FA] min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="space-y-1">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">AGENCIES</p>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Branches</h1>
        <p className="text-[11px] font-medium text-[#667085]">
          Group properties under a specific branch so you can segment portfolios by office or region.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="h-8 px-4 border-[#1e293b] bg-[#1e293b] text-white text-[10px] font-black rounded-lg gap-2 hover:bg-[#0f172a] transition-all shadow-sm" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to properties
          </Link>
        </Button>
      </div>

      {/* Add Branch Card */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm space-y-4">
        <Button className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-lg gap-2 shadow-sm border-none">
          Add branch
        </Button>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Branch name</Label>
          <div className="max-w-4xl">
            <Input
              placeholder="e.g. Westlands Office"
              className="h-10 border-[#DCE3EA] rounded-lg text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <p className="text-[10px] text-[#667085] font-medium leading-relaxed">
            Each branch name must be unique inside your business.
          </p>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-[#DCE3EA] h-10">
              <TableHead className="text-[10px] font-black text-[#98A2B3] uppercase px-4 w-12">#</TableHead>
              <TableHead className="text-[10px] font-black text-[#98A2B3] uppercase px-4">Branch</TableHead>
              <TableHead className="text-right text-[10px] font-black text-[#98A2B3] uppercase px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow className="h-10 border-none">
                <TableCell colSpan={3} className="px-4 text-[10px] font-medium text-[#667085]">
                  No branches added yet.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept, index) => (
                <TableRow key={dept.id} className="border-[#DCE3EA] h-12 hover:bg-slate-50 transition-colors">
                  <TableCell className="px-4 text-[10px] font-bold text-slate-400">{index + 1}</TableCell>
                  <TableCell className="px-4 text-[12px] font-black text-slate-900">{dept.name}</TableCell>
                  <TableCell className="px-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
