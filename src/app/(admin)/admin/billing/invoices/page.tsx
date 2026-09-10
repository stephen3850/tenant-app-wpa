import { getInvoices } from "@/actions/subscription-billing";
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
    FileTextIcon,
    DownloadIcon,
    AlertCircleIcon,
    SearchIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function InvoicesPage() {
  const invoices = await getInvoices({});

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Billing Invoices</h2>
          <p className="text-slate-500 font-medium mt-1">Global platform billing records and payment requests.</p>
        </div>
        <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search invoice #..." className="pl-9 font-medium border-slate-200" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[200px] font-black text-[10px] uppercase tracking-widest text-slate-500">Invoice</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Organization</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Amount</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Due Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                        <FileTextIcon className="h-4 w-4" />
                    </div>
                    <span className="font-black text-slate-900">{inv.invoiceNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="font-bold text-slate-700">{inv.organization.name}</span>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-900">
                  ${Number(inv.total).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`font-black text-[10px] uppercase tracking-widest border-none ${
                    inv.status === "PAID" ? "bg-green-100 text-green-700" :
                    inv.status === "OVERDUE" ? "bg-red-100 text-red-700" :
                    inv.status === "ISSUED" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-xs font-bold text-slate-500">
                  {format(new Date(inv.dueDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full">
                    <DownloadIcon className="h-4 w-4" />
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
