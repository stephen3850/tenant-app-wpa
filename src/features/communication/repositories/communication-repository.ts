import { db } from "@/lib/db";
import { Prisma, CommunicationType, CommunicationStatus } from "@prisma/client";

export class CommunicationRepository {
  async findMany(organizationId: string, filters?: { type?: CommunicationType; status?: CommunicationStatus }) {
    return db.communication.findMany({
      where: {
        organizationId,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.CommunicationUncheckedCreateInput) {
    return db.communication.create({ data });
  }

  async update(id: string, data: Prisma.CommunicationUpdateInput) {
    return db.communication.update({ where: { id }, data });
  }

  async findTemplates(organizationId: string) {
    return db.communicationTemplate.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" }
    });
  }

  async createTemplate(data: Prisma.CommunicationTemplateUncheckedCreateInput) {
    return db.communicationTemplate.create({ data });
  }

  async findNotifications(userId: string, organizationId: string) {
    return db.notification.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  async markNotificationRead(id: string, userId: string) {
    return db.notification.update({
      where: { id, userId },
      data: { readAt: new Date() }
    });
  }

  async findAnnouncements(organizationId: string) {
    return db.announcement.findMany({
      where: { organizationId },
      include: { creator: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async createAnnouncement(data: Prisma.AnnouncementUncheckedCreateInput) {
    return db.announcement.create({ data });
  }

  async getDashboardStats(organizationId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sentToday, failed, scheduled, unread] = await Promise.all([
      db.communication.count({
        where: { organizationId, createdAt: { gte: today }, status: "SENT" }
      }),
      db.communication.count({
        where: { organizationId, status: "FAILED" }
      }),
      db.announcement.count({
        where: { organizationId, status: "SCHEDULED" }
      }),
      db.notification.count({
        where: { organizationId, readAt: null }
      })
    ]);

    return {
      sentToday,
      failedDeliveries: failed,
      scheduledMessages: scheduled,
      unreadNotifications: unread
    };
  }
}

export const communicationRepository = new CommunicationRepository();
