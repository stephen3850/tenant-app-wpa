import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function IntegrationHealth({ integrations }: { integrations: any[] }) {
  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black">Third-Party Integration Health</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-black text-slate-900 uppercase text-xs">Service</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Provider</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Status</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Success Rate</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Latency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
                <TableCell className="text-slate-500 font-medium">{item.provider}</TableCell>
                <TableCell>
                  <Badge className={`font-black uppercase text-[10px] border-none ${
                    item.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.status === 'OPERATIONAL' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.successRate}%</span>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.successRate > 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${item.successRate}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-slate-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {item.latency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
