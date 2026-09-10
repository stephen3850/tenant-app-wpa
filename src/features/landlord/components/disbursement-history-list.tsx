"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HistoryIcon,
  DownloadIcon,
  ChevronLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  RefreshCcwIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function DisbursementHistoryList({ disbursements }: { disbursements: any[] }) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PROCESSED":
        return <Badge className="bg-emerald-500 font-black"><CheckCircle2Icon className="h-3 w-3 mr-1" /> PROCESSED</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="text-orange-500 border-orange-500 font-black"><ClockIcon className="h-3 w-3 mr-1" /> PENDING</Badge>;
      case "FAILED":
        return <Badge variant="destructive" className="font-black"><XCircleIcon className="h-3 w-3 mr-1" /> FAILED</Badge>;
      case "REVERSED":
        return <Badge variant="secondary" className="font-black"><RefreshCcwIcon className="h-3 w-3 mr-1" /> REVERSED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/financials" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Financials
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Disbursement History</h1>
          <p className="text-slate-500 font-medium">Tracking all payouts and drawings from your owner balance.</p>
        </div>
        <Button className="font-bold bg-blue-600 hover:bg-blue-700">
           Request New Disbursement
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Disbursement #</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Amount</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Method</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursements.map((d) => (
                <TableRow key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 font-bold text-slate-900">{d.disbursementNumber}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-600 italic">
                    {format(new Date(d.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-black text-slate-900">
                     KES {Number(d.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    {d.method.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(d.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <code className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-600">
                       {d.reference || "N/A"}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
              {disbursements.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <HistoryIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No disbursements found</h3>
                         <p className="text-slate-500 font-medium">When you receive payouts, they will be listed here.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
