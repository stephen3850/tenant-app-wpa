import { db } from "@/lib/db";
import { InvoiceStatus, Prisma } from "@prisma/client";

export class TenantInvoiceRepository {
  async findManyByTenantId(tenantId: string, filters: { status?: InvoiceStatus; search?: string }) {
    const where: Prisma.InvoiceWhereInput = {
      lease: { tenantId },
      status: { not: InvoiceStatus.DRAFT }, // Hide drafts from tenants
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.invoiceNumber = { contains: filters.search, mode: "insensitive" };
    }

    return db.invoice.findMany({
      where,
      include: {
        lease: {
          include: {
            unit: {
              include: { property: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, tenantId: string) {
    return db.invoice.findUnique({
      where: {
        id,
        lease: { tenantId } // Enforce tenant isolation
      },
      include: {
        lineItems: true,
        payments: true,
        lease: {
          include: {
            unit: {
              include: { property: true }
            },
            tenant: true
          }
        }
      },
    });
  }

  async getLatestInvoice(tenantId: string) {
    return db.invoice.findFirst({
      where: {
        lease: { tenantId },
        status: { not: InvoiceStatus.DRAFT }
      },
      orderBy: { createdAt: "desc" },
      include: {
        lineItems: true
      }
    });
  }
}

export const tenantInvoiceRepository = new TenantInvoiceRepository();
