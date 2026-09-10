"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalendarIcon, HomeIcon, FileTextIcon, DownloadIcon, UserIcon, ClockIcon } from "lucide-react";
import { logLeaseDownload } from "@/actions/tenant-lease";
import { differenceInDays } from "date-fns";

export function LeaseOverview({ lease }: { lease: any }) {
  if (!lease) return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        No active lease found.
      </CardContent>
    </Card>
  );

  const daysRemaining = lease.endDate ? differenceInDays(new Date(lease.endDate), new Date()) : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 60;

  const handleDownload = async () => {
    await logLeaseDownload(lease.id);
    if (lease.signedLeaseUrl) {
      window.open(lease.signedLeaseUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-blue-200 text-blue-700 bg-blue-50">
                  {lease.leaseNumber}
                </Badge>
                {isExpiringSoon && (
                  <Badge variant="destructive" className="text-[10px] uppercase animate-pulse">
                    Expiring Soon
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">{lease.unit.property.propertyName}</CardTitle>
              <p className="text-muted-foreground flex items-center text-sm">
                <HomeIcon className="h-3 w-3 mr-1" /> Unit {lease.unit.unitNumber} • {lease.unit.property.city}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <Badge variant={lease.status === "ACTIVE" ? "success" as any : "warning"} className="px-4 py-1">
                {lease.status}
              </Badge>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={handleDownload} disabled={!lease.signedLeaseUrl}>
                   <DownloadIcon className="h-4 w-4 mr-2" /> Download Agreement
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1">Period</h3>
               <div className="flex items-start gap-3">
                 <CalendarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium">{formatDate(lease.startDate)} — {lease.endDate ? formatDate(lease.endDate) : "Indefinite"}</p>
                   <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{lease.paymentFrequency} billing</p>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1">Lease Health</h3>
               <div className="flex items-start gap-3">
                 <ClockIcon className={`h-5 w-5 mt-0.5 ${isExpiringSoon ? 'text-red-500' : 'text-green-500'}`} />
                 <div>
                   <p className="text-sm font-medium">
                    {daysRemaining !== null
                      ? daysRemaining > 0
                        ? `${daysRemaining} Days Remaining`
                        : "Expired"
                      : "Month-to-Month"}
                   </p>
                   <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Until next renewal</p>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1">Monthly Rent</h3>
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-blue-700">{formatCurrency(lease.monthlyRent)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground uppercase">Due on Day {lease.billingDay}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1">Unit Info</h3>
               <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 p-2 rounded border">
                    <p className="text-[10px] text-muted-foreground uppercase">Type</p>
                    <p className="font-medium truncate text-xs">{lease.unit.unitType}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border">
                    <p className="text-[10px] text-muted-foreground uppercase">Size</p>
                    <p className="font-medium truncate text-xs">{lease.unit.squareFootage?.toString() || "N/A"} sqft</p>
                  </div>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
