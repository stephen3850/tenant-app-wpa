import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { tenantDocumentRepository } from "../repositories/tenant-document-repository";
import { tenantAnnouncementService } from "./tenant-announcement-service";
import { tenantNotificationService } from "./tenant-notification-service";
import { createAuditLog } from "@/lib/audit";

export class TenantDashboardService {
  async getTenantData(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const activeLease = tenant.leases.find(l => l.status === "ACTIVE" || l.status === "EXPIRING");

    const [financial, payments, maintenance, announcements, notificationsData, documents] = await Promise.all([
      tenantDashboardRepository.getFinancialSummary(tenant.id),
      tenantDashboardRepository.getRecentPayments(tenant.id),
      tenantDashboardRepository.getMaintenanceSummary(tenant.id),
      tenantAnnouncementService.getAnnouncements(userId),
      tenantNotificationService.getNotifications(userId, tenant.organizationId, { isArchived: false }, 5),
      tenantDocumentRepository.getRecentDocuments(tenant.id),
    ]);

    const notifications = notificationsData.notifications;
    const unreadAnnouncements = announcements.filter(a => a.reads.length === 0);
    const unreadNotificationsCount = await tenantNotificationService.getUnreadCount(userId, tenant.organizationId);

    await createAuditLog({
      action: "DASHBOARD_VIEW",
      entity: "Tenant",
      entityId: tenant.id,
      organizationId: tenant.organizationId,
      userId: userId
    } as any);

    return {
      tenant,
      activeLease,
      financial,
      payments,
      maintenance,
      announcements,
      notifications,
      documents,
      unreadCount: unreadAnnouncements.length,
      unreadNotificationsCount,
      urgentAnnouncement: unreadAnnouncements.find(a => a.priority === 'URGENT'),
      criticalNotification: notifications.find(n => n.priority === 'CRITICAL' && !n.readAt)
    };
  }

  async getLeaseDetails(userId: string) {
     const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
     if (!tenant) throw new Error("Tenant profile not found");

     await createAuditLog({
        action: "LEASE_VIEW",
        entity: "Tenant",
        entityId: tenant.id,
        organizationId: tenant.organizationId,
        userId: userId
     } as any);

     return tenant.leases;
  }
}

export const tenantDashboardService = new TenantDashboardService();
