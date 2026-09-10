"use server";

import { auth } from "@/auth";
import { tenantNotificationService } from "@/features/tenant/services/tenant-notification-service";
import { NotificationPriority } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getNotifications(params: {
  filters?: {
    type?: string;
    priority?: NotificationPriority;
    isRead?: boolean;
    isArchived?: boolean;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;
  offset?: number;
}) {
  const user = await getSession();
  return tenantNotificationService.getNotifications(
    user.id,
    user.organizationId,
    params.filters,
    params.limit,
    params.offset
  );
}

export async function getNotificationDetails(id: string) {
  const user = await getSession();
  return tenantNotificationService.getNotificationDetails(id, user.id, user.organizationId);
}

export async function markNotificationAsRead(id: string) {
  const user = await getSession();
  const result = await tenantNotificationService.markAsRead(id, user.id, user.organizationId);
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  return result;
}

export async function markAllNotificationsAsRead() {
  const user = await getSession();
  const result = await tenantNotificationService.markAllAsRead(user.id, user.organizationId);
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  return result;
}

export async function archiveNotification(id: string) {
  const user = await getSession();
  const result = await tenantNotificationService.archiveNotification(id, user.id, user.organizationId);
  revalidatePath("/notifications");
  return result;
}

export async function getUnreadNotificationsCount() {
  const user = await getSession();
  return tenantNotificationService.getUnreadCount(user.id, user.organizationId);
}
