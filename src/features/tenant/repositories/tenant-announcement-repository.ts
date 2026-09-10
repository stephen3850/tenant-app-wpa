import { db } from "@/lib/db";
import { AnnouncementPriority, AnnouncementCategory, Prisma } from "@prisma/client";

export class TenantAnnouncementRepository {
  async findAllByTarget(params: {
    organizationId: string;
    propertyId?: string;
    unitId?: string;
    groupId?: string;
    roles?: string[];
    userId: string;
    filters?: {
      category?: AnnouncementCategory;
      priority?: AnnouncementPriority;
      isRead?: boolean;
      search?: string;
    };
  }) {
    const { organizationId, propertyId, unitId, groupId, roles, userId, filters } = params;

    const where: Prisma.AnnouncementWhereInput = {
      organizationId,
      status: "SENT",
      OR: [
        { targetType: "ALL" },
        { targetType: "TENANTS" },
        ...(propertyId ? [{ targetType: "PROPERTY", targetIds: { has: propertyId } }] : []),
        ...(unitId ? [{ targetType: "UNIT", targetIds: { has: unitId } }] : []),
        ...(groupId ? [{ targetType: "GROUP", targetIds: { has: groupId } }] : []),
        ...(roles && roles.length > 0 ? [{ targetType: "ROLE", targetIds: { hasSome: roles } }] : []),
      ],
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.search) {
      where.OR?.push({
        title: { contains: filters.search, mode: "insensitive" },
      });
      where.OR?.push({
        content: { contains: filters.search, mode: "insensitive" },
      });
    }

    if (filters?.isRead !== undefined) {
      if (filters.isRead) {
        where.reads = { some: { userId } };
      } else {
        where.reads = { none: { userId } };
      }
    }

    return db.announcement.findMany({
      where,
      include: {
        reads: {
          where: { userId },
        },
        attachments: true,
        creator: {
          select: { name: true, image: true },
        },
      },
      orderBy: [
        { priority: "desc" }, // Urgent first (assuming enum order or mapped logic)
        { sentAt: "desc" },
      ],
    });
  }

  async findById(id: string, userId: string, organizationId: string) {
    return db.announcement.findFirst({
      where: {
        id,
        organizationId,
        status: "SENT",
      },
      include: {
        reads: {
          where: { userId },
        },
        attachments: true,
        creator: {
          select: { name: true, image: true },
        },
      },
    });
  }

  async markAsRead(announcementId: string, userId: string) {
    return db.announcementRead.upsert({
      where: {
        announcementId_userId: {
          announcementId,
          userId,
        },
      },
      create: {
        announcementId,
        userId,
        readAt: new Date(),
      },
      update: {
        readAt: new Date(),
      },
    });
  }

  async acknowledge(announcementId: string, userId: string) {
    return db.announcementRead.upsert({
      where: {
        announcementId_userId: {
          announcementId,
          userId,
        },
      },
      create: {
        announcementId,
        userId,
        readAt: new Date(),
        acknowledgedAt: new Date(),
      },
      update: {
        acknowledgedAt: new Date(),
      },
    });
  }

  async getUnreadCount(params: {
    organizationId: string;
    propertyId?: string;
    unitId?: string;
    groupId?: string;
    roles?: string[];
    userId: string;
  }) {
      const { organizationId, propertyId, unitId, groupId, roles, userId } = params;
      if (!userId) return 0;

      const where: Prisma.AnnouncementWhereInput = {
        organizationId,
        status: "SENT",
        OR: [
          { targetType: "ALL" },
          { targetType: "TENANTS" },
          ...(propertyId ? [{ targetType: "PROPERTY", targetIds: { has: propertyId } }] : []),
          ...(unitId ? [{ targetType: "UNIT", targetIds: { has: unitId } }] : []),
          ...(groupId ? [{ targetType: "GROUP", targetIds: { has: groupId } }] : []),
          ...(roles && roles.length > 0 ? [{ targetType: "ROLE", targetIds: { hasSome: roles } }] : []),
        ],
        reads: {
          none: { userId }
        },
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        ],
      };

      return db.announcement.count({ where });
  }
}

export const tenantAnnouncementRepository = new TenantAnnouncementRepository();
