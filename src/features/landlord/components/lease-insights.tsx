import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyIcon, CalendarIcon, RefreshCwIcon, ArrowUpRightIcon } from "lucide-react";

export function LeaseInsights({ leases }: { leases: any }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-indigo-600" />
          Lease Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border shadow-sm text-indigo-600">
                 <KeyIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-indigo-900">Total Active Leases</p>
           </div>
           <span className="text-xl font-black text-indigo-900">{leases.activeLeasesCount}</span>
        </div>

        <div className="space-y-3">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Upcoming Expiries</p>
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border rounded-xl space-y-1">
                 <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">In 30 Days</p>
                 <div className="flex items-end justify-between">
                    <p className="text-xl font-black text-slate-900">{leases.expiring30}</p>
                    <CalendarIcon className="h-4 w-4 text-orange-200" />
                 </div>
              </div>
              <div className="p-4 border rounded-xl space-y-1">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">In 60 Days</p>
                 <div className="flex items-end justify-between">
                    <p className="text-xl font-black text-slate-900">{leases.expiring60}</p>
                    <CalendarIcon className="h-4 w-4 text-slate-200" />
                 </div>
              </div>
           </div>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border shadow-sm text-emerald-600">
                 <RefreshCwIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-emerald-900">Renewals Pending</p>
           </div>
           <Badge className="bg-emerald-600 font-bold">{leases.renewalsPending}</Badge>
        </div>

        <button className="w-full py-3 bg-white border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group">
           Review All Expiring Leases
           <ArrowUpRightIcon className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </CardContent>
    </Card>
  );
}
