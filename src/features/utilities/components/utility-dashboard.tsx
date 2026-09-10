import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { utilityRepository } from "../repositories/utility-repository";
import { DropletsIcon, ZapIcon, ThermometerIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";

export async function UtilityDashboard({ organizationId }: { organizationId: string }) {
  const stats = await utilityRepository.getDashboardStats(organizationId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readings Billed (This Month)</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.billedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ThermometerIcon className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faulty Meters</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.faultyMeters}</div>
            <p className="text-xs text-muted-foreground">Requiring maintenance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
          <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Water Usage</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-blue-900">450 m³</div>
                      <DropletsIcon className="h-8 w-8 text-blue-300" />
                  </div>
              </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-100">
              <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">Electricity</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-yellow-900">1,200 kWh</div>
                      <ZapIcon className="h-8 w-8 text-yellow-300" />
                  </div>
              </CardContent>
          </Card>
          {/* Add more as needed */}
      </div>
    </div>
  );
}
