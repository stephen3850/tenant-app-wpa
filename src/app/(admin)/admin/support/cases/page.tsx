import { getSupportCases } from "@/actions/support-admin";
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
  ExternalLink,
  LifeBuoy
} from "lucide-react";
import Link from "next/link";

export default async function SupportCasesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const { cases, total } = await getSupportCases(params);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Cases</h1>
          <p className="text-slate-500 font-medium">Global support queue and SLA tracking.</p>
        </div>
        <div className="flex gap-4">
           {/* Actions Placeholder */}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Case ID</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Subject</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Priority</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Organization</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c: any) => (
              <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-black text-xs text-slate-500 pl-6">
                  {c.caseNumber}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{c.subject}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <PriorityBadge priority={c.priority} />
                </TableCell>
                <TableCell>
                   <StatusBadge status={c.status} />
                </TableCell>
                <TableCell>
                    <span className="font-bold text-slate-700 text-xs">{c.organization?.name || "Platform"}</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black text-blue-600 uppercase">
                        View
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

function PriorityBadge({ priority }: { priority: string }) {
    const styles: any = {
      URGENT: "bg-rose-100 text-rose-700 border-rose-200",
      HIGH: "bg-orange-100 text-orange-700 border-orange-200",
      MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
      LOW: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return (
      <Badge variant="outline" className={`${styles[priority]} font-bold text-[10px] uppercase tracking-wider`}>
        {priority}
      </Badge>
    );
  }

  function StatusBadge({ status }: { status: string }) {
    const styles: any = {
      OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ESCALATED: "bg-rose-50 text-rose-700 border-rose-200",
      IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
      AWAITING_CUSTOMER: "bg-orange-50 text-orange-700 border-orange-200",
      RESOLVED: "bg-slate-50 text-slate-700 border-slate-200",
      CLOSED: "bg-slate-200 text-slate-600 border-slate-300",
    };
    return (
      <Badge variant="outline" className={`${styles[status]} font-bold text-[10px] uppercase tracking-wider`}>
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }
