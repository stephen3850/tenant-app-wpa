import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ZapIcon,
    TrendingUpIcon,
    AlertCircleIcon,
    ShieldCheckIcon
} from "lucide-react";

export function SuccessInsights({ insights, expanded = false }: { insights: any, expanded?: boolean }) {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="bg-white border-b border-slate-50 py-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <TrendingUpIcon className="h-4 w-4" /> Customer Success
        </CardTitle>
      </CardHeader>
      <CardContent className={`pt-6 ${expanded ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}`}>
        <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Health Score</p>
                    <p className={`text-4xl font-black mt-1 ${
                        insights.healthScore >= 70 ? 'text-green-600' :
                        insights.healthScore >= 40 ? 'text-orange-500' : 'text-red-600'
                    }`}>
                        {insights.healthScore}%
                    </p>
                </div>
                <div className="text-right">
                    <Badge className={`font-black text-[10px] uppercase tracking-tighter ${
                        insights.churnRisk === 'LOW' ? 'bg-green-100 text-green-700' :
                        insights.churnRisk === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {insights.churnRisk} RISK
                    </Badge>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Churn Risk Level</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Product Adoption</span>
                        <span className="text-xs font-black text-slate-900">{insights.productAdoptionScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full"
                            style={{ width: `${insights.productAdoptionScore}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Core Usage (Monthly)</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Payments</p>
                        <p className="text-lg font-black text-slate-900">{insights.usage.payments.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Leases</p>
                        <p className="text-lg font-black text-slate-900">{insights.usage.leases.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Units</p>
                        <p className="text-lg font-black text-slate-900">{insights.usage.units.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tenants</p>
                        <p className="text-lg font-black text-slate-900">{insights.usage.tenants.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                    <h5 className="text-xs font-black text-blue-900 flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4" /> Success Recommendation
                    </h5>
                    <p className="text-xs font-medium text-blue-700 leading-relaxed">
                        This organization has high unit utilization but low payment automation adoption. Recommend scheduling an M-Pesa integration review call.
                    </p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
