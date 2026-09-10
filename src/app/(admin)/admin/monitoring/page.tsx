import { getSystemHealth, getIntegrationHealth } from "@/features/monitoring/actions/monitoring-actions";
import { HealthStats } from "./components/health-stats";
import { IntegrationHealth } from "./components/integration-health";
import { DatabaseStats } from "./components/database-stats";
import { JobQueueStats } from "./components/job-queue-stats";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

export default async function MonitoringDashboardPage() {
  const [health, integrations] = await Promise.all([
    getSystemHealth(),
    getIntegrationHealth(),
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            System Health & Monitoring
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 font-medium text-lg">Real-time operational visibility and infrastructure health.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-2 h-11">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700 font-black h-11">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Declare Incident
          </Button>
        </div>
      </div>

      <HealthStats stats={health.infrastructure} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <IntegrationHealth integrations={integrations} />
          <JobQueueStats stats={health.backgroundJobs} />
        </div>
        <div className="space-y-8">
          <DatabaseStats stats={health.database} />
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h3 className="text-lg font-black">Platform Shield</h3>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              WAF and DDoS protection are currently active. 42 malicious requests blocked in the last hour.
            </p>
            <Button className="w-full bg-white text-slate-900 font-bold hover:bg-slate-100">
              Security Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
