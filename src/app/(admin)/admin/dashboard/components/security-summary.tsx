import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon, LockIcon, KeyIcon, AlertTriangleIcon } from "lucide-react";

export function SecuritySummary({ security, expanded = false }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ShieldCheckIcon className="h-4 w-4" /> Security Center
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <LockIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Failed Logins (24h)</span>
            </div>
            <span className={`text-sm font-black ${security.failedLogins24h > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                {security.failedLogins24h}
            </span>
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">MFA Adoption</span>
                </div>
                <span className="text-sm font-black text-slate-900">{security.mfaAdoptionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${security.mfaAdoptionRate}%` }}
                />
            </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-700">Locked Accounts</span>
            </div>
            <span className="text-sm font-black text-slate-900">{security.lockedAccounts}</span>
        </div>
      </CardContent>
    </Card>
  );
}
