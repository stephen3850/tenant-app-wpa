import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, MapPinIcon } from "lucide-react";

export function TenantWelcome({ tenant, activeLease }: any) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {tenant.firstName}!</h1>
            <p className="text-blue-100 flex items-center mt-1">
              <HomeIcon className="h-4 w-4 mr-2" />
              {activeLease ? `${activeLease.unit.unitNumber}, ${activeLease.unit.property.propertyName}` : "No active lease"}
            </p>
          </div>
          {activeLease && (
            <div className="flex flex-col items-end">
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                {activeLease.status}
              </Badge>
              <p className="text-xs text-blue-100 mt-2 flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {activeLease.unit.property.city}, {activeLease.unit.property.county}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
