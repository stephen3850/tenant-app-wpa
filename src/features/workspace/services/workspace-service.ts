import { getTenantDb, systemDb } from "@/lib/tenant-db";
import { checkPermission } from "@/lib/permissions";
import { OccupancyStatus, InvoiceStatus, LeaseStatus, TenantStatus } from "@prisma/client";

export class WorkspaceService {
  async getDashboardData(organizationId: string) {
    await checkPermission("read", "property");

    const tenantDb = getTenantDb(organizationId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get 6 months range for trend
    const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      propertyCount,
      unitCount,
      tenantCount,
      leaseCount,
      occupiedUnits,
      outstandingInvoices,
      collectionsThisMonth,
      openMaintenanceRequests,
      expensesResult,
      expectedRevenueResult,
      recentActivities,
      unreadNotifications,

      // Additional for V2.5
      totalCredit,
      totalRefunds,
      utilityBilled,

      // V2.5 Specifics
      organization,
      collectionAccountsCount,
      totalInvoicesCount,
      totalPaymentsCount,
      tenantStats,
      invoiceStats,
      movementStats,
      monthlyCollectionByType,
      trendData,
      dailyStats
    ] = await Promise.all([
      tenantDb.property.count({ where: { deletedAt: null, status: { not: "ARCHIVED" } } }),
      tenantDb.unit.count({ where: { deletedAt: null, property: { organizationId } } }),
      tenantDb.tenant.count({ where: { organizationId } }),
      tenantDb.lease.count({ where: { organizationId, status: "ACTIVE", deletedAt: null } }),
      tenantDb.unit.count({ where: { deletedAt: null, occupancyStatus: OccupancyStatus.OCCUPIED, property: { organizationId } } }),
      tenantDb.invoice.aggregate({
        where: { organizationId, status: { in: [InvoiceStatus.POSTED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] } },
        _sum: { balanceDue: true }
      }),
      tenantDb.payment.aggregate({
        where: { organizationId, status: "COMPLETED", paymentDate: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true }
      }),
      tenantDb.ticket.count({ where: { organizationId, status: { not: "CLOSED" } } }),
      tenantDb.expense.aggregate({
        where: { organizationId, status: "PAID", expenseDate: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { totalAmount: true }
      }),
      tenantDb.unit.aggregate({ where: { deletedAt: null, status: "ACTIVE", property: { organizationId } }, _sum: { monthlyRent: true } }),
      tenantDb.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { user: { select: { name: true } } } }),
      systemDb.notification.count({ where: { organizationId, readAt: null } }),

      // Additional for V2.5
      tenantDb.creditBalance.aggregate({ where: { organizationId }, _sum: { amount: true } }),
      tenantDb.payment.aggregate({
        where: { organizationId, status: "REVERSED", updatedAt: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true }
      }),
      tenantDb.invoice.aggregate({
        where: {
            organizationId,
            createdAt: { gte: startOfMonth, lte: endOfMonth },
            lineItems: { some: { description: { contains: "Utility" } } }
        },
        _sum: { totalAmount: true }
      }),

      // V2.5 Specifics
      systemDb.organization.findUnique({ where: { id: organizationId }, select: { name: true, logo: true, contactEmail: true, taxNumber: true } }),
      tenantDb.mpesaCredential.count({ where: { organizationId } }),
      tenantDb.invoice.count({ where: { organizationId, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      tenantDb.payment.count({ where: { organizationId, status: "COMPLETED", createdAt: { gte: startOfMonth, lte: endOfMonth } } }),

      // Tenant status breakdown
      tenantDb.tenant.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: true
      }),

      // Invoice status breakdown
      tenantDb.invoice.groupBy({
        by: ['status'],
        where: { organizationId, createdAt: { gte: startOfMonth, lte: endOfMonth } },
        _count: true
      }),

      // Movement stats
      Promise.all([
        tenantDb.tenant.count({ where: { organizationId, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
        tenantDb.tenant.count({ where: { organizationId, status: "FORMER", updatedAt: { gte: startOfMonth, lte: endOfMonth } } }),
      ]),

      // Collections by type (simplified for now as payment methods or categories)
      tenantDb.payment.aggregate({
        where: { organizationId, status: "COMPLETED", paymentDate: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true }
      }),

      // Trend data (last 6 months)
      tenantDb.payment.groupBy({
        by: ['paymentDate'],
        where: { organizationId, status: "COMPLETED", paymentDate: { gte: trendStart } },
        _sum: { amount: true }
      }),

      // Daily stats
      tenantDb.payment.aggregate({
        where: {
            organizationId,
            status: "COMPLETED",
            paymentDate: {
                gte: new Date(now.setHours(0,0,0,0)),
                lte: new Date(now.setHours(23,59,59,999))
            }
        },
        _sum: { amount: true }
      })
    ]);

    // Process Trend Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push({
            month: months[d.getMonth()],
            amount: 0
        });
    }

    trendData.forEach(item => {
        const d = new Date(item.paymentDate);
        const monthName = months[d.getMonth()];
        const entry = last6Months.find(m => m.month === monthName);
        if (entry) entry.amount += Number(item._sum.amount || 0);
    });

    const isBusinessProfileComplete = !!(organization?.name && organization?.contactEmail);
    const hasCollectionAccount = collectionAccountsCount > 0;
    const hasProperty = propertyCount > 0;
    const hasUnit = unitCount > 0;
    const hasTenant = tenantCount > 0;
    const hasLease = leaseCount > 0;
    const hasInvoice = totalInvoicesCount > 0;
    const hasPayment = totalPaymentsCount > 0;

    const setupSteps = [
      { id: "business-profile", label: "Business profile", description: "Name, contact details, VAT, and logo basics.", completed: isBusinessProfileComplete, action: "Open settings", href: "/settings?tab=general", icon: "Business" },
      { id: "collection-account", label: "Collection account", description: "Set Paybill, bank, and account format once for the business.", completed: hasCollectionAccount, action: "Complete profile first", href: "/api-integrations/collections", icon: "Bank" },
      { id: "first-property", label: "First property", description: "Add property name, location, and billing defaults.", completed: hasProperty, action: "Ready", href: "/properties", icon: "Property" },
      { id: "first-units", label: "First units", description: "Add rent amounts and expected deposits for units.", completed: hasUnit, action: "Ready", href: "/units", icon: "Unit" },
      { id: "deposit-setup", label: "Deposit Invoice Setup", description: "Expected deposits are invoiced separately from rent.", completed: false, action: "Deposit Invoice Setup", href: "/settings?tab=deposits", icon: "Wallet" },
      { id: "first-tenant", label: "First tenant", description: "Attach tenant to a property and unit.", completed: hasTenant, action: "Ready", href: "/tenants", icon: "Tenant" },
      { id: "lease-record", label: "Lease record", description: "Lease start date, rent cycle, and deposit invoice.", completed: hasLease, action: "Ready", href: "/leases", icon: "Lease" },
      { id: "first-invoice", label: "First invoice", description: "Create or auto-generate rent/deposit invoices.", completed: hasInvoice, action: "Ready", href: "/invoices", icon: "Invoice" },
      { id: "first-payment", label: "First payment", description: "Record rent or deposit and confirm the balance updates.", completed: hasPayment, action: "Record payment", href: "/payments", icon: "Payment" },
    ];

    const completedSteps = setupSteps.filter(s => s.completed).length;
    const progressPercentage = Math.round((completedSteps / setupSteps.length) * 100);

    return {
      stats: {
        propertyCount,
        unitCount,
        tenantCount,
        leaseCount,
        occupiedUnits,
        vacantUnits: unitCount - occupiedUnits,
        occupancyRate: unitCount > 0 ? Math.round((occupiedUnits / unitCount) * 100) : 0,
        outstandingBalance: Number(outstandingInvoices._sum.balanceDue || 0),
        collectionsThisMonth: Number(collectionsThisMonth._sum.amount || 0),
        openMaintenanceRequests,
        expenses: Number(expensesResult._sum.totalAmount || 0),
        expectedRevenue: Number(expectedRevenueResult._sum.monthlyRent || 0),
        unreadNotifications,
        // Detailed breakdowns
        tenantStatus: {
            active: tenantStats.find(s => s.status === "ACTIVE")?._count || 0,
            inactive: tenantStats.find(s => s.status === "INACTIVE")?._count || 0,
            blacklisted: tenantStats.find(s => s.status === "BLACKLISTED")?._count || 0,
            former: tenantStats.find(s => s.status === "FORMER")?._count || 0,
        },
        invoiceStatus: {
            paid: invoiceStats.find(s => s.status === "PAID")?._count || 0,
            pending: invoiceStats.reduce((acc, s) => ["DRAFT", "POSTED", "PARTIALLY_PAID", "OVERDUE"].includes(s.status) ? acc + s._count : acc, 0),
            cancelled: invoiceStats.find(s => s.status === "CANCELLED")?._count || 0,
        },
        movement: {
            new: movementStats[0],
            vacated: movementStats[1],
            pendingMoveOut: 0, // Placeholder
        },
        trend: last6Months,
        daily: {
            rent: Number(dailyStats._sum.amount || 0),
            deposit: 0,
            other: 0
        },
        totalCredit: Number(totalCredit._sum.amount || 0),
        totalRefunds: Number(totalRefunds._sum.amount || 0),
        utilityBilled: Number(utilityBilled._sum.totalAmount || 0),
      },
      progress: {
        steps: setupSteps,
        completedCount: completedSteps,
        totalSteps: setupSteps.length,
        percentage: progressPercentage,
        isComplete: completedSteps === setupSteps.length,
      },
      recentActivities: recentActivities.map(log => ({
        title: log.action.replace(/_/g, ' '),
        desc: `${log.action} ${log.entity}`,
        time: log.createdAt,
        user: log.user?.name || "System"
      }))
    };
  }
}

export const workspaceService = new WorkspaceService();
