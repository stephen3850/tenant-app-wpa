"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Download, Eye, Calendar, Users, Wrench } from "lucide-react";

export function OperationalReports() {
  const reports = [
    { id: "occupancy", name: "Occupancy & Vacancy", description: "Current occupancy status and vacancy rates.", icon: Users },
    { id: "lease_expiry", name: "Lease Expiry Forecast", description: "Upcoming lease expirations and renewal status.", icon: Calendar },
    { id: "maintenance", name: "Maintenance Performance", description: "Ticket resolution times and vendor performance.", icon: Wrench },
    { id: "move_in_out", name: "Move-In/Move-Out Report", description: "Historical tracking of tenant turnover.", icon: BarChart },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="border-2 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <report.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg font-black">{report.name}</CardTitle>
            </div>
            <CardDescription className="font-medium text-slate-500">
              {report.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 pt-2">
            <Button className="flex-1 bg-slate-900 font-bold">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button variant="outline" size="icon" className="border-2">
              <Download className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
