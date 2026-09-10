import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantLeaseService } from "@/features/tenant/services/tenant-lease-service";
import { LeaseOverview } from "@/features/tenant/components/lease-overview";
import { LeaseDetails } from "@/features/tenant/components/lease-details";
import { LeaseTimeline } from "@/features/tenant/components/lease-timeline";
import { RenewalCenter } from "@/features/tenant/components/renewal-center";
import { LeaseNotices } from "@/features/tenant/components/lease-notices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, HistoryIcon, BellIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { differenceInDays } from "date-fns";

export default async function TenantLeasePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const lease = await tenantLeaseService.getActiveLease(session.user.id);
  const history = await tenantLeaseService.getLeaseHistory(session.user.id);

  const daysRemaining = lease?.endDate ? differenceInDays(new Date(lease.endDate), new Date()) : null;
  const isExpiring = daysRemaining !== null && daysRemaining <= 90;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Lease Information</h2>
      </div>

      <LeaseOverview lease={lease} />

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="details">
            <InfoIcon className="mr-2 h-4 w-4" /> Lease Details
          </TabsTrigger>
          <TabsTrigger value="renewal">
            <RefreshCwIcon className="mr-2 h-4 w-4" /> Renewal Center
          </TabsTrigger>
          <TabsTrigger value="notices">
            <BellIcon className="mr-2 h-4 w-4" /> Notices
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <HistoryIcon className="mr-2 h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="history">
            <InfoIcon className="mr-2 h-4 w-4" /> Historical Leases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
            <LeaseDetails lease={lease} />
        </TabsContent>

        <TabsContent value="renewal" className="space-y-4">
            <RenewalCenter
              renewals={lease?.renewals || []}
              leaseId={lease?.id}
              isExpiring={isExpiring}
            />
        </TabsContent>

        <TabsContent value="notices" className="space-y-4">
            <LeaseNotices notices={lease?.notices || []} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
            <LeaseTimeline events={lease?.timeline || []} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4">
                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12 border rounded-lg bg-slate-50">No historical leases found.</p>
                ) : (
                    history.map((h: any) => (
                        <div key={h.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                           <div>
                              <p className="font-bold text-sm">{h.leaseNumber}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(h.startDate)} — {formatDate(h.endDate)}</p>
                           </div>
                           <Badge variant="secondary">{h.status}</Badge>
                        </div>
                    ))
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
