import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, WrenchIcon, ReceiptIcon, UserIcon, ArrowRightIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export function RecentActivities({ recent }: { recent: any }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
           <CardTitle className="text-lg font-bold">Portfolio Activity</CardTitle>
           <Link href="/reports" className="text-xs font-bold text-blue-600 hover:underline">View All Records</Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
         <div className="divide-y divide-slate-100">
            {recent.payments.map((p: any) => (
               <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <CreditCardIcon className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Payment Received</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                           {p.tenant?.firstName} {p.tenant?.lastName} • Ref: {p.transactionRef || 'N/A'}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-emerald-600">+{formatCurrency(p.amount)}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(p.paymentDate)}</p>
                  </div>
               </div>
            ))}

            {recent.expenses.map((e: any) => (
               <div key={e.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <ReceiptIcon className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Expense Logged</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                           {e.category?.name} • {e.expenseNumber}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-red-600">-{formatCurrency(e.totalAmount)}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(e.expenseDate)}</p>
                  </div>
               </div>
            ))}

            {recent.tickets.map((t: any) => (
               <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <WrenchIcon className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">New Ticket: {t.subject}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                           {t.property.propertyName} • {t.unit?.unitNumber || 'Common Area'}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge variant={t.priority === 'URGENT' ? 'destructive' : 'secondary'} className="text-[10px] font-black uppercase">
                        {t.priority}
                     </Badge>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{formatDate(t.createdAt)}</p>
                  </div>
               </div>
            ))}
         </div>
      </CardContent>
    </Card>
  );
}
