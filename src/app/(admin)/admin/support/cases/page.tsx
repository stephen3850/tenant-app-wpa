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

export default async function SupportCasesPage({ searchParams }: any) {
  const { cases, total } = await getSupportCases(searchParams);

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

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search cases by number or subject..."
            className="pl-10 border-slate-200 bg-slate-50/50"
          />
        </div>
        <Button variant="outline" className="border-slate-200 font-bold">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Case #</TableHead>
              <TableHead className="font-bold text-slate-700">Organization</TableHead>
              <TableHead className="font-bold text-slate-700">Requester</TableHead>
              <TableHead className="font-bold text-slate-700">Priority</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Created</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c: any) => (
              <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono font-bold text-blue-600">
                  {c.caseNumber}
                </TableCell>
                <TableCell className="font-bold text-slate-700 text-sm">
                  {c.organization.name}
                </TableCell>
                <TableCell>
                    <div className="font-bold text-slate-900 text-sm">{c.requester.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{c.requester.email}</div>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={c.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={c.status} />
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/support/cases/${c.id}`}>
                            <ExternalLink className="w-4 h-4" />
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
