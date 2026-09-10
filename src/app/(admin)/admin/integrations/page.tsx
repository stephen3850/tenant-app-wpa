import { getIntegrations, getIntegrationsDashboard } from "@/features/integrations/actions/integration-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, RefreshCw, CheckCircle2, XCircle, AlertCircle, Activity, Globe, ShieldCheck } from "lucide-react";
import { IntegrationList } from "./components/integration-list";
import { IntegrationStats } from "./components/integration-stats";

export default async function IntegrationsPage() {
  const [integrations, stats] = await Promise.all([
    getIntegrations(),
    getIntegrationsDashboard(),
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations & Connected Apps</h1>
          <p className="text-slate-500 font-medium">Manage external service connections and platform webhooks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Health
          </Button>
          <Button className="bg-slate-900 font-bold hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>
      </div>

      <IntegrationStats stats={stats} />

      <div className="grid grid-cols-1 gap-8">
        <IntegrationList integrations={integrations} />
      </div>
    </div>
  );
}
