import { getWebhooks } from "@/features/integrations/actions/integration-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, ShieldCheck, Activity, Globe } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function WebhooksPage() {
  const webhooks = await getWebhooks();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Webhook Management</h1>
          <p className="text-slate-500 font-medium">Global platform endpoints and provider callbacks.</p>
        </div>
        <Button className="bg-slate-900 font-bold">
          <Activity className="mr-2 h-4 w-4" />
          Live Logs
        </Button>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Provider / Endpoint</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Status</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs text-center">Success Rate</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Last Delivery</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center font-medium text-slate-500">
                  No webhooks configured.
                </TableCell>
              </TableRow>
            )}
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">{webhook.integration.name}</span>
                    <span className="text-xs font-bold text-slate-500 font-mono truncate max-w-xs">{webhook.endpoint}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`font-bold ${webhook.isEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"} border-none`}>
                    {webhook.isEnabled ? "LISTENING" : "PAUSED"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-black text-slate-900">{webhook.successRate}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${webhook.successRate}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-600">
                    {webhook.lastDeliveryAt ? formatDate(webhook.lastDeliveryAt) : "Never"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 font-black border-2">
                      View Payload
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
