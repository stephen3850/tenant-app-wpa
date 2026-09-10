import { systemDb } from "@/lib/tenant-db";
import { invoiceGeneratorService } from "@/features/finance/services/invoice-generator-service";
import { invoiceService } from "@/features/finance/services/invoice-service";
import { systemAuditLog } from "@/lib/audit";
import { InvoiceStatus, LeaseStatus } from "@prisma/client";

export class JobService {
  /**
   * Fan-out: Publishes a message for each active organization.
   */
  async fanOutMonthlyInvoices() {
    const orgs = await systemDb.organization.findMany({ where: { isActive: true } });
    return orgs.map(org => org.id);
  }

  /**
   * Generates invoices for a specific organization for the current month.
   */
  async processOrgMonthlyInvoices(organizationId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const results = await invoiceGeneratorService.generateMonthlyInvoices(organizationId, month, year);

    await systemAuditLog({
      action: "JOB_MONTHLY_INVOICES_COMPLETED",
      entity: "Organization",
      entityId: organizationId,
      organizationId,
      newData: results,
    });

    return results;
  }

  /**
   * Marks posted invoices as overdue if their due date has passed.
   */
  async processOverdueInvoices() {
    const now = new Date();
    const overdueInvoices = await systemDb.invoice.findMany({
      where: {
        status: { in: [InvoiceStatus.POSTED, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: { lt: now },
      },
      select: { id: true, organizationId: true }
    });

    for (const inv of overdueInvoices) {
      await invoiceService.markOverdue(inv.organizationId, inv.id);
    }

    return { processed: overdueInvoices.length };
  }

  /**
   * Checks for leases expiring in the next 30 days and logs/notifies.
   */
  async checkLeaseExpiries() {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const expiringLeases = await systemDb.lease.findMany({
      where: {
        status: LeaseStatus.ACTIVE,
        endDate: { lte: nextMonth, gte: new Date() },
      },
      include: { tenant: true, property: true }
    });

    for (const lease of expiringLeases) {
      // Logic for notification would go here (SMS/Email)
      await systemAuditLog({
        action: "LEASE_EXPIRY_REMINDER",
        entity: "Lease",
        entityId: lease.id,
        organizationId: lease.organizationId,
        newData: { tenant: lease.tenant.lastName, endDate: lease.endDate },
      });
    }

    return { remindersSent: expiringLeases.length };
  }

  /**
   * Retries reconciliation for pending M-Pesa transactions that are stuck.
   */
  async retryFailedMpesaReconciliations() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const stuckTransactions = await systemDb.mpesaTransaction.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: oneHourAgo },
      }
    });

    // In a real scenario, we might call Daraja Query API here
    return { pendingCount: stuckTransactions.length };
  }
}

export const jobService = new JobService();
