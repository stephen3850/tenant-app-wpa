import { db } from "@/lib/db";

export class TenantDashboardRepository {
  async getTenantByUserId(userId: string) {
    // 1. Direct lookup by userId
    let tenant = await db.tenant.findUnique({
      where: { userId },
      include: {
        leases: {
          where: { status: { in: ["ACTIVE", "EXPIRING"] } },
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (tenant) return tenant;

    // 2. Fallback lookup by user email, phone, or name
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, name: true, organizationId: true },
    });

    if (!user) return null;

    const conditions: any[] = [];
    if (user.email) {
      conditions.push({ email: { equals: user.email, mode: "insensitive" } });
    }
    if (user.phone) {
      conditions.push({ phone: user.phone });
      let cleanPhone = user.phone.replace(/\+/g, "").trim();
      if (cleanPhone.startsWith("254")) {
        conditions.push({ phone: "0" + cleanPhone.slice(3) });
      } else if (cleanPhone.startsWith("0")) {
        conditions.push({ phone: "254" + cleanPhone.slice(1) });
      }
    }
    if (user.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        conditions.push({
          AND: [
            { firstName: { equals: parts[0], mode: "insensitive" } },
            { lastName: { equals: parts[parts.length - 1], mode: "insensitive" } },
          ],
        });
      }
    }

    if (conditions.length > 0) {
      tenant = await db.tenant.findFirst({
        where: {
          OR: conditions,
        },
        include: {
          leases: {
            where: { status: { in: ["ACTIVE", "EXPIRING"] } },
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
        },
      });

      if (tenant) {
        // Auto-link tenant profile to user
        await db.tenant.update({
          where: { id: tenant.id },
          data: { userId },
        });
        return tenant;
      }
    }

    // 3. Fallback: Lookup unlinked tenant in user's organization or active default organization
    let targetOrgId: string | undefined = user.organizationId || undefined;
    if (!targetOrgId) {
      const firstOrg = await db.organization.findFirst({
        where: { status: "ACTIVE" },
        select: { id: true },
      });
      targetOrgId = firstOrg?.id;

      if (targetOrgId) {
        await db.user.update({
          where: { id: userId },
          data: { organizationId: targetOrgId },
        });
      }
    }

    if (targetOrgId) {
      const orgTenant = await db.tenant.findFirst({
        where: {
          organizationId: targetOrgId,
          userId: null,
        },
        include: {
          leases: {
            where: { status: { in: ["ACTIVE", "EXPIRING"] } },
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
        },
      });

      if (orgTenant) {
        await db.tenant.update({
          where: { id: orgTenant.id },
          data: { userId },
        });
        return orgTenant;
      }

      // 4. Auto-create tenant profile for this user
      const nameParts = (user.name || "Tenant User").trim().split(" ");
      const firstName = nameParts[0] || "Tenant";
      const lastName = nameParts.slice(1).join(" ") || "User";

      const createdTenant = await db.tenant.create({
        data: {
          organizationId: targetOrgId,
          userId: user.id,
          firstName,
          lastName,
          email: user.email,
          phone: user.phone || `07${Math.floor(10000000 + Math.random() * 90000000)}`,
          tenantCode: `TNT-${Date.now().toString().slice(-6)}`,
          status: "ACTIVE",
        },
        include: {
          leases: {
            where: { status: { in: ["ACTIVE", "EXPIRING"] } },
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
        },
      });

      return createdTenant;
    }

    return null;
  }

  async getFinancialSummary(tenantId: string) {
    const [latestLedger, creditBalance, latestInvoice] = await Promise.all([
      db.tenantLedger.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      }),
      db.creditBalance.findUnique({
        where: { tenantId },
      }),
      db.invoice.findFirst({
        where: { lease: { tenantId } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      currentBalance: latestLedger ? Number(latestLedger.balance) : 0,
      creditBalance: creditBalance ? Number(creditBalance.amount) : 0,
      latestInvoice,
    };
  }

  async getRecentPayments(tenantId: string, limit = 5) {
    return db.payment.findMany({
      where: { tenantId },
      orderBy: { paymentDate: "desc" },
      take: limit,
      include: {
        receipt: true,
      },
    });
  }

  async getMaintenanceSummary(tenantId: string) {
    const tickets = await db.ticket.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    });

    return {
      open: tickets.filter((t) => t.status === "OPEN" || t.status === "UNDER_REVIEW").length,
      inProgress: tickets.filter(
        (t) =>
          t.status === "ASSIGNED" ||
          t.status === "IN_PROGRESS" ||
          t.status === "AWAITING_TENANT" ||
          t.status === "AWAITING_VENDOR"
      ).length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,
      latest: tickets.slice(0, 3),
    };
  }

  async getAnnouncements(organizationId: string, propertyId?: string) {
    return db.announcement.findMany({
      where: {
        organizationId,
        OR: [
          { targetType: "ALL" },
          { targetType: "TENANTS" },
          ...(propertyId ? [{ targetType: "PROPERTY", targetIds: { has: propertyId } }] : []),
        ],
        status: "SENT",
      },
      orderBy: { sentAt: "desc" },
      take: 5,
    });
  }

  async getNotifications(userId: string) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }
}

export const tenantDashboardRepository = new TenantDashboardRepository();
