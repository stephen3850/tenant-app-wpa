"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Play, Power, PowerOff, ShieldCheck, Globe, Trash2 } from "lucide-react";
import { enableIntegration, disableIntegration, testIntegrationConnection } from "@/features/integrations/actions/integration-actions";
import { toast } from "sonner";
import { useState } from "react";

export function IntegrationList({ integrations }: { integrations: any[] }) {
  const [testing, setTesting] = useState<string | null>(null);

  const handleToggle = async (id: string, currentlyEnabled: boolean) => {
    try {
      if (currentlyEnabled) {
        await disableIntegration(id);
        toast.success("Integration disabled");
      } else {
        await enableIntegration(id);
        toast.success("Integration enabled");
      }
    } catch (error) {
      toast.error("Failed to update integration");
    }
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const result = await testIntegrationConnection(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error("Connection test failed");
      }
    } catch (error) {
      toast.error("An error occurred during testing");
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {integrations.length === 0 && (
        <Card className="col-span-full border-2 border-dashed p-12 text-center">
          <CardContent>
            <p className="text-slate-500 font-medium">No integrations configured yet.</p>
          </CardContent>
        </Card>
      )}
      {integrations.map((integration) => (
        <Card key={integration.id} className="border-2 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black">{integration.name}</CardTitle>
                <CardDescription className="font-medium">{integration.description}</CardDescription>
              </div>
              <Badge
                variant={integration.isEnabled ? "default" : "secondary"}
                className={integration.isEnabled ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold" : "font-bold"}
              >
                {integration.isEnabled ? "ACTIVE" : "DISABLED"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                {integration.type}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {integration.isGlobal ? "Global" : "Scoped"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Jobs</p>
                <p className="text-xl font-black text-slate-900">{integration._count.jobs}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Webhooks</p>
                <p className="text-xl font-black text-slate-900">{integration._count.webhooks}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 font-bold border-2"
                onClick={() => handleTest(integration.id)}
                disabled={testing === integration.id}
              >
                {testing === integration.id ? "Testing..." : "Test Connection"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-2"
                onClick={() => handleToggle(integration.id, integration.isEnabled)}
              >
                {integration.isEnabled ? <PowerOff className="h-4 w-4 text-rose-600" /> : <Power className="h-4 w-4 text-emerald-600" />}
              </Button>
              <Button variant="outline" size="icon" className="border-2">
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
