import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingIcon, HomeIcon, UserCheckIcon, LogOutIcon } from "lucide-react";

export function PortfolioSummary({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          <BuildingIcon className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProperties}</div>
          <p className="text-xs text-muted-foreground">Assigned to your portfolio</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          <HomeIcon className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUnits}</div>
          <p className="text-xs text-muted-foreground">{stats.totalUnits - stats.occupiedUnits} units currently vacant</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
          <UserCheckIcon className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupiedUnits}</div>
          <p className="text-xs text-emerald-600 font-bold">{stats.occupancyRate.toFixed(1)}% Occupancy Rate</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow border-orange-100 bg-orange-50/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vacant Units</CardTitle>
          <LogOutIcon className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.vacantUnits}</div>
          <p className="text-xs text-orange-600 font-medium">Ready for onboarding</p>
        </CardContent>
      </Card>
    </div>
  );
}
