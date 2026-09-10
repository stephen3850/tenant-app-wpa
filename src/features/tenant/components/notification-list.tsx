"use client";

import { useState } from "react";
import { NotificationItem } from "./notification-item";
import { Button } from "@/components/ui/button";
import { CheckCheckIcon, InboxIcon } from "lucide-react";
import { markAllNotificationsAsRead } from "@/actions/tenant-notifications";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function NotificationList({
  notifications,
  total,
  hasUnread
}: {
  notifications: any[],
  total: number,
  hasUnread: boolean
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <InboxIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Your inbox is empty</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-[250px] text-center">
          We'll notify you when something important happens.
        </p>
      </div>
    );
  }

  const handleLoadMore = () => {
    const params = new URLSearchParams(window.location.search);
    const currentLimit = parseInt(params.get("limit") || "20");
    params.set("limit", (currentLimit + 20).toString());
    router.push(`/notifications?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {notifications.length} of {total} Notifications
        </p>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            <CheckCheckIcon className="h-3 w-3 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>

      {total > notifications.length && (
        <div className="pt-4 flex justify-center">
           <Button
            variant="outline"
            className="w-full md:w-auto font-bold px-8"
            onClick={handleLoadMore}
           >
              Load More Notifications
           </Button>
        </div>
      )}
    </div>
  );
}
