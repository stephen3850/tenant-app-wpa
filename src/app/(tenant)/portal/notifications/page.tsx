import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantNotificationService } from "@/features/tenant/services/tenant-notification-service";
import { NotificationList } from "@/features/tenant/components/notification-list";
import { NotificationFilters } from "@/features/tenant/components/notification-filters";
import { BellIcon } from "lucide-react";
import { NotificationPriority } from "@prisma/client";
import { Suspense } from "react";
import { NotificationSkeleton } from "@/features/tenant/components/notification-skeleton";

export default async function TenantNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    priority?: NotificationPriority;
    isRead?: string;
    isArchived?: string;
    search?: string;
    limit?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const params = await searchParams;

  const filters = {
    type: params.type,
    priority: params.priority,
    isRead: params.isRead === "true" ? true : params.isRead === "false" ? false : undefined,
    isArchived: params.isArchived === "true",
    search: params.search,
  };

  const limit = params.limit ? parseInt(params.limit) : 20;

  const { notifications, total } = await tenantNotificationService.getNotifications(
    user.id,
    user.organizationId,
    filters,
    limit
  );

  const unreadCount = await tenantNotificationService.getUnreadCount(user.id, user.organizationId);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <BellIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
            <p className="text-muted-foreground">
              Personal alerts, system updates, and task reminders.
            </p>
          </div>
        </div>
      </div>

      <NotificationFilters />

      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationList
          notifications={notifications}
          total={total}
          hasUnread={unreadCount > 0}
        />
      </Suspense>
    </div>
  );
}
