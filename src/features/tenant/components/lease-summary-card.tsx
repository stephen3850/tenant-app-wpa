import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileCheckIcon, ClockIcon, ExternalLinkIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LeaseSummaryCard({ lease }: any) {
  if (!lease) return null;

  const daysRemaining = lease.endDate ? differenceInDays(new Date(lease.endDate), new Date()) : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining < 60;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileCheckIcon className="h-4 w-4 text-blue-600" />
            Active Lease
          </span>
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border-blue-200">
            {lease.leaseNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <CalendarIcon className="h-4 w-4 text-slate-400 mt-1" />
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Lease Period</p>
            <p className="text-xs font-medium">
              {formatDate(lease.startDate)} — {lease.endDate ? formatDate(lease.endDate) : "Indefinite"}
            </p>
          </div>
        </div>

        {daysRemaining !== null && (
          <div className="flex items-start gap-3">
            <ClockIcon className={`h-4 w-4 mt-1 ${isExpiringSoon ? "text-destructive animate-pulse" : "text-green-500"}`} />
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Time Remaining</p>
              <p className={`text-xs font-bold ${isExpiringSoon ? "text-destructive" : "text-slate-900"}`}>
                {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
           <Button variant="outline" size="sm" className="text-[10px] h-8 px-2" asChild>
             <Link href="/lease">
               <ExternalLinkIcon className="h-3 w-3 mr-1" />
               View Details
             </Link>
           </Button>
           <Button variant="secondary" size="sm" className="text-[10px] h-8 px-2" asChild disabled={!lease.signedLeaseUrl}>
             <a href={lease.signedLeaseUrl || "#"} target="_blank" rel="noopener noreferrer">
               <FileCheckIcon className="h-3 w-3 mr-1" />
               Agreement
             </a>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
