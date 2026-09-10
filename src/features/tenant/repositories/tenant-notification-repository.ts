import { db } from "@/lib/db";
import { NotificationPriority, Prisma } from "@prisma/client";

export class TenantNotificationRepository {
  async findAll(params: {
    userId: string;
    organizationId: string;
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
    const { userId, organizationId, filters, limit = 20, offset = 0 } = params;

    const where: Prisma.NotificationWhereInput = {
      userId,
      organizationId,
      archivedAt: filters?.isArchived ? { not: null } : null,
    };

    if (filters?.type && filters.type !== "ALL") {
      where.type = filters.type;
    }

    if (filters?.priority && filters.priority as any !== "ALL") {
      where.priority = filters.priority;
    }

    if (filters?.isRead !== undefined) {
      where.readAt = filters.isRead ? { not: null } : null;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { message: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
      }),
      db.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async findById(id: string, userId: string, organizationId: string) {
    return db.notification.findFirst({
      where: {
        id,
        userId,
        organizationId,
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    return db.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string, organizationId: string) {
    return db.notification.updateMany({
      where: { userId, organizationId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async archive(id: string, userId: string) {
    return db.notification.updateMany({
      where: { id, userId },
      data: { archivedAt: new Date() },
    });
  }

  async getUnreadCount(userId: string, organizationId: string) {
    return db.notification.count({
      where: {
        userId,
        organizationId,
        readAt: null,
        archivedAt: null,
      },
    });
  }
}

export const tenantNotificationRepository = new TenantNotificationRepository();
