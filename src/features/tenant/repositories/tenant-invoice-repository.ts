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

  async findById(id: string, tenantId: string, userEmail?: string, userId?: string) {
    // 1. Attempt query using AND to combine search by ID/invoiceNumber AND tenant ownership
    let invoice = await db.invoice.findFirst({
      where: {
        AND: [
          {
            OR: [
              { id },
              { invoiceNumber: id },
              { invoiceNumber: { equals: id, mode: "insensitive" } }
            ]
          },
          {
            lease: {
              OR: [
                { tenantId },
                ...(userId ? [{ tenant: { userId } }] : []),
                ...(userEmail ? [{ tenant: { email: { equals: userEmail, mode: "insensitive" as const } } }] : [])
              ]
            }
          }
        ]
      },
      include: {
        lineItems: true,
        payments: {
          include: { receipt: true }
        },
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

    if (invoice) return invoice;

    // 2. Direct ID/invoiceNumber fallback
    return db.invoice.findFirst({
      where: {
        OR: [
          { id },
          { invoiceNumber: id }
        ]
      },
      include: {
        lineItems: true,
        payments: {
          include: { receipt: true }
        },
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
