import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CreditCardIcon,
    CalendarIcon,
    FileTextIcon,
    ArrowRightIcon,
    AlertCircleIcon
} from "lucide-react";
import { format } from "date-fns";

export function FinancialOverview({ org, expanded = false }: { org: any, expanded?: boolean }) {
  const subscription = org.subscription;
  const invoices = org.billingInvoices || [];

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b border-slate-50 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <CreditCardIcon className="h-4 w-4" /> Financial Overview
        </CardTitle>
        <Badge className="bg-blue-100 text-blue-700 border-none font-bold">
            {subscription?.plan?.name || "No Plan"} — {subscription?.plan?.interval}
        </Badge>
      </CardHeader>
      <CardContent className={`pt-6 ${expanded ? 'space-y-8' : 'space-y-6'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly MRR</p>
                <p className="text-2xl font-black text-slate-900">
                    ${subscription?.plan ? (Number(subscription.plan.price) / (subscription.plan.interval === 'YEARLY' ? 12 : 1)).toFixed(2) : "0.00"}
                </p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full ${subscription?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{subscription?.status || "INACTIVE"}</span>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Next Billing</p>
                <p className="text-sm font-black text-slate-900 mt-1">
                    {subscription?.endDate ? format(new Date(subscription.endDate), "MMM d, yyyy") : "N/A"}
                </p>
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Invoices</h4>
            <div className="space-y-2">
                {invoices.length > 0 ? invoices.map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                <FileTextIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900">{invoice.invoiceNumber}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900">${Number(invoice.total).toFixed(2)}</p>
                                <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter border-none h-4 ${
                                    invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {invoice.status}
                                </Badge>
                            </div>
                            <ArrowRightIcon className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed">
                        <p className="text-xs font-medium text-slate-400 italic">No billing history found.</p>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
