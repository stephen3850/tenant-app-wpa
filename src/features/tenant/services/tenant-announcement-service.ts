import { tenantAnnouncementRepository } from "../repositories/tenant-announcement-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { AnnouncementCategory, AnnouncementPriority } from "@prisma/client";
import { db } from "@/lib/db";

export class TenantAnnouncementService {
  private async getTenantContext(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const activeLease = tenant.leases.find(
      (l) => l.status === "ACTIVE" || l.status === "EXPIRING"
    );

    // Fetch user roles from the database to be sure they are up to date
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    const roles = user?.userRoles.map(ur => ur.role.name) || [];

    return {
      organizationId: tenant.organizationId,
      propertyId: activeLease?.propertyId,
      unitId: activeLease?.unitId,
      groupId: tenant.groupId || undefined,
      roles: roles,
    };
  }

  async getAnnouncements(
    userId: string,
    filters?: {
      category?: AnnouncementCategory;
      priority?: AnnouncementPriority;
      isRead?: boolean;
      search?: string;
    }
  ) {
    const context = await this.getTenantContext(userId);
    return tenantAnnouncementRepository.findAllByTarget({
      organizationId: context.organizationId,
      propertyId: context.propertyId,
      unitId: context.unitId,
      groupId: context.groupId,
      roles: context.roles,
      userId,
      filters,
    });
  }

  async getAnnouncementDetails(userId: string, announcementId: string) {
    const context = await this.getTenantContext(userId);
    const announcement = await tenantAnnouncementRepository.findById(
      announcementId,
      userId,
      context.organizationId
    );

    if (!announcement) throw new Error("Announcement not found or access denied");

    // Implicitly mark as read when viewing details if not already read
    if (announcement.reads.length === 0) {
      await this.markAsRead(userId, announcementId);
    }

    await createAuditLog({
      action: "ANNOUNCEMENT_VIEWED",
      entity: "Announcement",
      entityId: announcementId,
      organizationId: context.organizationId,
      userId: userId,
    } as any);

    return announcement;
  }

  async markAsRead(userId: string, announcementId: string) {
    const context = await this.getTenantContext(userId);
    const result = await tenantAnnouncementRepository.markAsRead(announcementId, userId);

    await createAuditLog({
      action: "ANNOUNCEMENT_READ",
      entity: "Announcement",
      entityId: announcementId,
      organizationId: context.organizationId,
      userId: userId,
    } as any);

    return result;
  }

  async acknowledge(userId: string, announcementId: string) {
    const context = await this.getTenantContext(userId);
    const result = await tenantAnnouncementRepository.acknowledge(announcementId, userId);

    await createAuditLog({
      action: "ANNOUNCEMENT_ACKNOWLEDGED",
      entity: "Announcement",
      entityId: announcementId,
      organizationId: context.organizationId,
      userId: userId,
    } as any);

    return result;
  }

  async getUnreadCount(userId: string) {
    const context = await this.getTenantContext(userId);
    return tenantAnnouncementRepository.getUnreadCount({
        organizationId: context.organizationId,
        propertyId: context.propertyId,
        unitId: context.unitId,
        groupId: context.groupId,
        roles: context.roles,
        userId
    });
  }
}

export const tenantAnnouncementService = new TenantAnnouncementService();
