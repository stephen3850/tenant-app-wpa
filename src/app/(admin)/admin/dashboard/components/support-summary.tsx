import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoyIcon, MessageSquareIcon, AlertCircleIcon, ClockIcon } from "lucide-react";

export function SupportSummary({ support }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <LifeBuoyIcon className="h-4 w-4" /> Support Oversight
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Open Cases</p>
                <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-xl font-black text-slate-900">{support.openCases}</span>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Resolution</p>
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-xl font-black text-slate-900">{support.avgResolutionTime}h</span>
                </div>
            </div>
        </div>

        {support.criticalCases > 0 && (
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                <AlertCircleIcon className="h-5 w-5 text-orange-600" />
                <div>
                    <p className="text-xs font-black text-orange-700">{support.criticalCases} Critical Escalations</p>
                    <p className="text-[10px] font-medium text-orange-600">SLA breach imminent for {support.criticalCases} items.</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
