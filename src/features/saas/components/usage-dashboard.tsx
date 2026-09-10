import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function UsageDashboard({ usage }: any) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Units" value={usage.activeUnits} />
        <StatCard title="Active Users" value={usage.activeUsers} />
        <StatCard title="SMS Used" value={usage.smsSent} />
        <StatCard title="Emails Sent" value={usage.emailSent} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.historical.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    No historical usage data recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                usage.historical.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell>{format(new Date(m.recordedAt), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell className="capitalize">{m.metricType.replace("_", " ").toLowerCase()}</TableCell>
                    <TableCell>{m.value}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
