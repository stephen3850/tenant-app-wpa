import { TenantWelcome } from "./tenant-welcome";
import { FinancialSummary } from "./financial-summary";
import { RecentPayments } from "./recent-payments";
import { LeaseSummaryCard } from "./lease-summary-card";
import { MaintenanceSummaryCard } from "./maintenance-summary-card";
import { RecentDocumentsCard } from "./recent-documents-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellIcon, MegaphoneIcon, AlertCircleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TenantDashboard({ data }: { data: any }) {
  const {
    tenant,
    activeLease,
    financial,
    payments,
    maintenance,
    announcements,
    notifications,
    documents,
    unreadCount,
    unreadNotificationsCount,
    urgentAnnouncement,
    criticalNotification
  } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <TenantWelcome tenant={tenant} activeLease={activeLease} />

      {(urgentAnnouncement || criticalNotification) && (
        <div className="grid gap-4 md:grid-cols-2">
          {urgentAnnouncement && (
            <Card className="bg-rose-500/5 border-rose-500/20 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
              <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <AlertCircleIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">IMPORTANT: {urgentAnnouncement.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Please review this important notice immediately.</p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" className="rounded-lg shadow-sm" asChild>
                    <Link href={`/announcements/${urgentAnnouncement.id}`}>View Notice</Link>
                  </Button>
              </CardContent>
            </Card>
          )}
          {criticalNotification && (
            <Card className="bg-amber-500/5 border-amber-500/20 animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <BellIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">ACTION REQUIRED: {criticalNotification.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Urgent update on your account status.</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-600" asChild>
                    <Link href={`/notifications/${criticalNotification.id}`}>View Alert</Link>
                  </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <FinancialSummary financial={financial} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-muted/30 border-b">
                <CardTitle className="text-lg font-bold">Recent Payments</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5" asChild>
                    <Link href="/payments">View History</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <RecentPayments payments={payments} />
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="p-6">
               <Tabs defaultValue="announcements" className="w-full">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-bold">Stay Updated</CardTitle>
                    <TabsList className="grid w-full sm:w-[240px] grid-cols-2 rounded-xl h-10 bg-muted/50 p-1">
                        <TabsTrigger value="announcements" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                           <MegaphoneIcon className="h-4 w-4 mr-2" /> News
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                           <BellIcon className="h-4 w-4 mr-2" /> Alerts
                        </TabsTrigger>
                    </TabsList>
                 </div>
                 <TabsContent value="announcements" className="mt-6">
                    <div className="space-y-4">
                        {announcements.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                  <MegaphoneIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">No recent announcements.</p>
                            </div>
                        ) : (
                            announcements.slice(0, 3).map((a: any) => (
                                <Link key={a.id} href={`/announcements/${a.id}`} className="block hover:bg-muted/50 transition-all p-3 rounded-xl border border-transparent hover:border-border group">
                                    <div className="border-l-4 border-primary pl-4 py-1">
                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{a.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content.replace(/<[^>]*>?/gm, '')}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                           <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{new Date(a.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                        {announcements.length > 0 && (
                          <Button variant="outline" size="sm" className="w-full h-10 font-bold uppercase tracking-wider text-[10px] rounded-xl" asChild>
                             <Link href="/announcements">View All Announcements</Link>
                          </Button>
                        )}
                    </div>
                 </TabsContent>
                 <TabsContent value="notifications" className="mt-4">
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">All caught up!</p>
                        ) : (
                            notifications.map((n: any) => (
                                <Link key={n.id} href={`/notifications/${n.id}`} className="block hover:bg-slate-50 transition-colors p-2 rounded-lg">
                                    <div className="flex gap-3 items-start border-b pb-3 last:border-0">
                                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.readAt ? "bg-slate-300" : "bg-blue-600 animate-pulse"}`} />
                                        <div className="space-y-0.5">
                                            <p className={`text-sm ${n.readAt ? "text-slate-500" : "font-bold text-slate-900"}`}>{n.title}</p>
                                            <p className="text-xs text-slate-400 line-clamp-1">{n.message}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-medium mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                        {notifications.length > 0 && (
                          <Button variant="outline" size="sm" className="w-full text-xs font-bold" asChild>
                             <Link href="/notifications">Go to Notification Center</Link>
                          </Button>
                        )}
                    </div>
                 </TabsContent>
               </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <LeaseSummaryCard lease={activeLease} />
          <RecentDocumentsCard documents={documents} />
          <MaintenanceSummaryCard maintenance={maintenance} />

          <Card className="bg-muted/50 border-dashed">
             <CardContent className="pt-6">
                <div className="text-center space-y-2">
                   <p className="text-sm font-medium">Need Help?</p>
                   <p className="text-xs text-muted-foreground">Access our help center for FAQs and tutorials on how to use the tenant portal.</p>
                   <Button variant="link" size="sm" className="text-xs">
                      Go to Help Center
                   </Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
