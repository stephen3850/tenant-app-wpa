import { getSentryErrors } from "@/features/monitoring/actions/monitoring-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bug, ShieldX, TrendingDown, ExternalLink, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ErrorCenterPage() {
  const errors = await getSentryErrors();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Error Monitoring Center</h1>
          <p className="text-slate-500 font-medium">Real-time application exceptions and fatal crashes via Sentry.</p>
        </div>
        <Button className="bg-slate-900 font-bold">
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Sentry Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <ShieldX className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Unresolved Errors</p>
              <p className="text-2xl font-black text-slate-900">{errors.unresolved}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Bug className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Events (24h)</p>
              <p className="text-2xl font-black text-slate-900">{errors.total.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <TrendingDown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Critical Failures</p>
              <p className="text-2xl font-black text-slate-900">{errors.critical}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Recurring Issues</h2>
        <div className="grid grid-cols-1 gap-4">
          {errors.recent.map((err) => (
            <Card key={err.id} className="border-2 shadow-sm hover:border-slate-300 transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={err.level === 'fatal' ? 'destructive' : 'secondary'} className="font-black uppercase text-[10px]">
                      {err.level}
                    </Badge>
                    <h3 className="text-base font-black text-slate-900 font-mono">{err.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span>{err.count} events</span>
                    <span>Last seen {formatDate(err.lastSeen)}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
