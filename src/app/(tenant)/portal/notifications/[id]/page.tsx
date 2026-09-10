import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { tenantNotificationService } from "@/features/tenant/services/tenant-notification-service";
import { NotificationDetail } from "@/features/tenant/components/notification-detail";
import { Suspense } from "react";
import { NotificationDetailSkeleton } from "@/features/tenant/components/notification-skeleton";

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const { id } = await params;

  try {
    const notification = await tenantNotificationService.getNotificationDetails(
      id,
      user.id,
      user.organizationId
    );

    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <Suspense fallback={<NotificationDetailSkeleton />}>
          <NotificationDetail notification={notification} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Notification Detail Error:", error);
    notFound();
  }
}
