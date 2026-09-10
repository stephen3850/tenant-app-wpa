import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getNotificationsAction, markNotificationReadAction } from "@/features/communication/actions/communication-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, Info, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await getNotificationsAction();

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">Notifications</h1>
              <p className="text-[13px] font-medium text-[#667085]">Manage your system alerts and activity updates.</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
               <Bell className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-dashed border-2 border-[#DCE3EA] bg-transparent shadow-none rounded-2xl">
            <CardContent className="p-16 flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-[#98A2B3] shadow-sm">
                <Bell className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#1F2937]">All caught up!</h3>
                <p className="text-sm text-[#667085] font-medium">You don't have any new notifications at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: any) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  const isUnread = !notification.readAt;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="h-5 w-5 text-[#12B76A]" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-[#E67E22]" />;
      case 'ERROR': return <AlertTriangle className="h-5 w-5 text-[#D92D20]" />;
      default: return <Info className="h-5 w-5 text-[#3B82F6]" />;
    }
  };

  return (
    <Card className={cn(
      "border-none shadow-sm rounded-2xl transition-all hover:shadow-md",
      isUnread ? "bg-white ring-1 ring-[#12B76A]/20" : "bg-white/80"
    )}>
      <CardContent className="p-5 flex items-start gap-4">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
          isUnread ? "bg-[#F0FDF4]" : "bg-slate-50"
        )}>
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn("text-sm font-black tracking-tight truncate", isUnread ? "text-[#1F2937]" : "text-[#667085]")}>
              {notification.title}
            </h4>
            <span className="text-[10px] font-bold text-[#98A2B3] flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-[12px] font-medium text-[#667085] leading-relaxed">
            {notification.message}
          </p>
          {isUnread && (
            <form action={async () => {
              'use server';
              await markNotificationReadAction(notification.id);
            }} className="pt-2">
              <Button type="submit" variant="ghost" className="h-7 text-[10px] font-black text-[#12B76A] hover:bg-[#F0FDF4] px-3 rounded-lg">
                Mark as read
              </Button>
            </form>
          )}
        </div>
        {isUnread && (
          <div className="h-2 w-2 rounded-full bg-[#12B76A] mt-2 shrink-0" />
        )}
      </CardContent>
    </Card>
  );
}
