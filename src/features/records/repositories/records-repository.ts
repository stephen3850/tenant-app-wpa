import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class RecordsRepository {
  async searchRecords(organizationId: string, query: string) {
    // This is a simplified global search across multiple entities.
    // In a real production app, you might use full-text search or a search service.

    const [tenants, leases, invoices, tickets, cases, security] = await Promise.all([
      db.tenant.findMany({
        where: {
          organizationId,
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } },
            { email: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      db.lease.findMany({
        where: {
          organizationId,
          leaseNumber: { contains: query, mode: "insensitive" }
        },
        include: { tenant: true, property: true },
        take: 10
      }),
      db.invoice.findMany({
        where: {
          organizationId,
          invoiceNumber: { contains: query, mode: "insensitive" }
        },
        take: 10
      }),
      db.ticket.findMany({
        where: {
          organizationId,
          OR: [
            { ticketNumber: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      db.case.findMany({
        where: {
          organizationId,
          OR: [
            { caseNumber: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      db.securityIncident.findMany({
        where: {
          organizationId,
          OR: [
            { logNumber: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      })
    ]);

    return {
      tenants,
      leases,
      invoices,
      tickets,
      cases,
      security
    };
  }

  async getComplianceRecords(organizationId: string) {
    return db.complianceRecord.findMany({
      where: { organizationId },
      include: { property: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async createComplianceRecord(data: Prisma.ComplianceRecordUncheckedCreateInput) {
    return db.complianceRecord.create({ data });
  }

  async getRetentionPolicies(organizationId: string) {
    return db.retentionPolicy.findMany({
      where: { organizationId }
    });
  }

  async updateRetentionPolicy(organizationId: string, entityType: string, periodYears: number) {
    return db.retentionPolicy.upsert({
      where: { organizationId_entityType: { organizationId, entityType } },
      create: { organizationId, entityType, periodYears },
      update: { periodYears }
    });
  }

  async logAccess(data: Prisma.RecordAccessLogUncheckedCreateInput) {
    return db.recordAccessLog.create({ data });
  }

  async getAccessHistory(organizationId: string) {
    return db.recordAccessLog.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
}

export const recordsRepository = new RecordsRepository();
