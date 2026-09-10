import { db } from "@/lib/db";

export class TenantDashboardRepository {
  async getTenantByUserId(userId: string) {
    return db.tenant.findUnique({
      where: { userId },
      include: {
        leases: {
          where: { status: { in: ["ACTIVE", "EXPIRING"] } },
          include: {
            unit: {
              include: {
                property: true
              }
            }
          }
        }
      }
    });
  }

  async getFinancialSummary(tenantId: string) {
    const [latestLedger, creditBalance, latestInvoice] = await Promise.all([
      db.tenantLedger.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" }
      }),
      db.creditBalance.findUnique({
        where: { tenantId }
      }),
      db.invoice.findFirst({
        where: { lease: { tenantId } },
        orderBy: { createdAt: "desc" }
      })
    ]);

    return {
      currentBalance: latestLedger?.balance || 0,
      creditBalance: creditBalance?.amount || 0,
      latestInvoice
    };
  }

  async getRecentPayments(tenantId: string, limit = 5) {
    return db.payment.findMany({
      where: { tenantId },
      orderBy: { paymentDate: "desc" },
      take: limit,
      include: {
        receipt: true
      }
    });
  }

  async getMaintenanceSummary(tenantId: string) {
    const tickets = await db.ticket.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      include: { category: true }
    });

    return {
      open: tickets.filter(t => t.status === "OPEN" || t.status === "UNDER_REVIEW").length,
      inProgress: tickets.filter(t => t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "AWAITING_TENANT" || t.status === "AWAITING_VENDOR").length,
      resolved: tickets.filter(t => t.status === "RESOLVED").length,
      closed: tickets.filter(t => t.status === "CLOSED").length,
      latest: tickets.slice(0, 3)
    };
  }

  async getAnnouncements(organizationId: string, propertyId?: string) {
    return db.announcement.findMany({
      where: {
        organizationId,
        OR: [
          { targetType: "ALL" },
          { targetType: "TENANTS" },
          ...(propertyId ? [{ targetType: "PROPERTY", targetIds: { has: propertyId } }] : [])
        ],
        status: "SENT"
      },
      orderBy: { sentAt: "desc" },
      take: 5
    });
  }

  async getNotifications(userId: string) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10
    });
  }
}

export const tenantDashboardRepository = new TenantDashboardRepository();
