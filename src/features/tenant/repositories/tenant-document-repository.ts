import { db } from "@/lib/db";
import { DocumentStatus, DocumentCategory, Prisma } from "@prisma/client";

export class TenantDocumentRepository {
  async findAllByTenantId(tenantId: string, filters?: {
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string;
  }) {
    const where: Prisma.DocumentWhereInput = {
      tenantId,
      parentId: null, // Only get top-level documents (latest versions or main entries)
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    return db.document.findMany({
      where,
      include: {
        uploadedBy: {
          select: { name: true }
        },
        _count: {
          select: { versions: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string, tenantId: string) {
    return db.document.findUnique({
      where: { id, tenantId },
      include: {
        uploadedBy: {
          select: { name: true }
        },
        versions: {
          orderBy: { version: "desc" },
          include: {
            uploadedBy: {
              select: { name: true }
            }
          }
        }
      }
    });
  }

  async getRecentDocuments(tenantId: string, limit = 5) {
    return db.document.findMany({
      where: { tenantId, parentId: null },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        uploadedBy: {
          select: { name: true }
        }
      }
    });
  }

  async getExpiringDocuments(tenantId: string) {
    return db.document.findMany({
      where: {
        tenantId,
        parentId: null,
        expiryDate: {
          gt: new Date(),
          lt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
        }
      },
      orderBy: { expiryDate: "asc" }
    });
  }
}

export const tenantDocumentRepository = new TenantDocumentRepository();
