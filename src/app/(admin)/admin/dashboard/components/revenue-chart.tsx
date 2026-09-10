import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export function RevenueChart({ revenue, expanded = false }: any) {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <CreditCardIcon className="h-4 w-4" /> Revenue Intelligence
        </CardTitle>
        <Badge className="bg-green-100 text-green-700 border-none font-bold">
            <TrendingUpIcon className="h-3 w-3 mr-1" /> +12.5%
        </Badge>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly (MRR)</p>
                <p className="text-xl font-black text-slate-900">${revenue.mrr.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Annual (ARR)</p>
                <p className="text-xl font-black text-slate-900">${revenue.arr.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">ARPO</p>
                <p className="text-xl font-black text-slate-900">${revenue.arpo.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion</p>
                <p className="text-xl font-black text-slate-900">{revenue.trialConversionRate.toFixed(1)}%</p>
            </div>
        </div>

        {/* Visual representation placeholder */}
        <div className="h-48 w-full bg-slate-50 rounded-xl flex items-end justify-between p-4 gap-2">
            {[40, 60, 45, 70, 85, 65, 90, 100].map((height, i) => (
                <div
                    key={i}
                    className="w-full bg-blue-500/20 rounded-t-sm hover:bg-blue-500 transition-all cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${(height * 1000).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
            <span>Oct 2025</span>
            <span>Nov 2025</span>
            <span>Dec 2025</span>
            <span>Jan 2026</span>
            <span>Feb 2026</span>
            <span>Mar 2026</span>
            <span>Apr 2026</span>
            <span>May 2026</span>
        </div>
      </CardContent>
    </Card>
  );
}
