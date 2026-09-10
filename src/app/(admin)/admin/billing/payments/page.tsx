import { getPayments } from "@/actions/subscription-billing";
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
import { format } from "date-fns";
import {
    CreditCardIcon,
    ExternalLinkIcon,
    ArrowUpRightIcon,
    CheckCircle2Icon,
    XCircleIcon
} from "lucide-react";

export default async function PaymentsPage() {
  const payments = await getPayments({});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Global Payments</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time ledger of all subscription transactions across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[200px] font-black text-[10px] uppercase tracking-widest text-slate-500">Transaction Ref</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Organization</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Amount</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Method</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((pmt) => (
              <TableRow key={pmt.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-black text-slate-900">{pmt.transactionRef || pmt.id.slice(0, 12).toUpperCase()}</span>
                    <ArrowUpRightIcon className="h-3 w-3 text-slate-300" />
                  </div>
                </TableCell>
                <TableCell>
                    <span className="font-bold text-slate-700">{pmt.organization.name}</span>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-900">
                  ${Number(pmt.amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                   <Badge variant="outline" className="font-bold border-slate-200 text-slate-500 uppercase text-[9px]">
                        {pmt.method}
                   </Badge>
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        {pmt.status === "COMPLETED" ? (
                            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                        ) : pmt.status === "FAILED" ? (
                            <XCircleIcon className="h-4 w-4 text-red-500" />
                        ) : (
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                            pmt.status === "COMPLETED" ? "text-green-700" :
                            pmt.status === "FAILED" ? "text-red-700" : "text-slate-700"
                        }`}>
                            {pmt.status}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-center text-xs font-bold text-slate-500">
                  {format(new Date(pmt.paymentDate), "MMM d, yyyy HH:mm")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
