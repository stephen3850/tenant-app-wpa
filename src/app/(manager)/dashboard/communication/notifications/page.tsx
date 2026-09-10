import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { communicationRepository } from "@/features/communication/repositories/communication-repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, BellIcon, CheckCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markNotificationRead } from "@/actions/communications";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const notifications = await communicationRepository.findNotifications(user.id, user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/communication">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">System Notifications</h2>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
             <BellIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground">You have no notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border flex justify-between items-start ${notif.readAt ? "bg-muted/50" : "bg-card shadow-sm border-blue-100"}`}>
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     {!notif.readAt && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                     <h4 className="font-semibold">{notif.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                     {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
               </div>
               {!notif.readAt && (
                 <form action={async () => {
                   "use server";
                   await markNotificationRead(notif.id);
                 }}>
                    <Button variant="ghost" size="sm">
                       <CheckCircleIcon className="h-4 w-4 mr-2" /> Mark as Read
                    </Button>
                 </form>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
