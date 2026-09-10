import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { securityRepository } from "../repositories/security-repository";
import { ShieldAlertIcon, UsersIcon, ShieldCheckIcon, ActivityIcon } from "lucide-react";

export async function SecurityDashboard({ organizationId }: { organizationId: string }) {
  const stats = await securityRepository.getDashboardStats(organizationId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <ShieldAlertIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openIncidents}</div>
            <p className="text-xs text-muted-foreground">Active OB entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors On Site</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitorsOnSite}</div>
            <p className="text-xs text-muted-foreground">Currently registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrols (Today)</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">100% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OB entries</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Lifetime records</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional analytics could go here */}
    </div>
  );
}
