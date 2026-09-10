import { tenantNotificationRepository } from "../repositories/tenant-notification-repository";
import { createAuditLog } from "@/lib/audit";
import { NotificationPriority } from "@prisma/client";

export class TenantNotificationService {
  async getNotifications(
    userId: string,
    organizationId: string,
    filters?: {
      type?: string;
      priority?: NotificationPriority;
      isRead?: boolean;
      isArchived?: boolean;
      search?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit?: number,
    offset?: number
  ) {
    return tenantNotificationRepository.findAll({
      userId,
      organizationId,
      filters,
      limit,
      offset,
    });
  }

  async getNotificationDetails(id: string, userId: string, organizationId: string) {
    const notification = await tenantNotificationRepository.findById(id, userId, organizationId);
    if (!notification) throw new Error("Notification not found");

    if (!notification.readAt) {
      await this.markAsRead(id, userId, organizationId);
    }

    await createAuditLog({
      action: "NOTIFICATION_VIEWED",
      entity: "Notification",
      entityId: id,
      organizationId,
      userId,
    } as any);

    return notification;
  }

  async markAsRead(id: string, userId: string, organizationId: string) {
    const result = await tenantNotificationRepository.markAsRead(id, userId);

    await createAuditLog({
      action: "NOTIFICATION_READ",
      entity: "Notification",
      entityId: id,
      organizationId,
      userId,
    } as any);

    return result;
  }

  async markAllAsRead(userId: string, organizationId: string) {
    const result = await tenantNotificationRepository.markAllAsRead(userId, organizationId);

    await createAuditLog({
      action: "NOTIFICATIONS_MARKED_READ",
      entity: "Notification",
      entityId: userId, // Using userId as entityId for bulk action
      organizationId,
      userId,
    } as any);

    return result;
  }

  async archiveNotification(id: string, userId: string, organizationId: string) {
    const result = await tenantNotificationRepository.archive(id, userId);

    await createAuditLog({
      action: "NOTIFICATION_ARCHIVED",
      entity: "Notification",
      entityId: id,
      organizationId,
      userId,
    } as any);

    return result;
  }

  async getUnreadCount(userId: string, organizationId: string) {
    return tenantNotificationRepository.getUnreadCount(userId, organizationId);
  }
}

export const tenantNotificationService = new TenantNotificationService();
