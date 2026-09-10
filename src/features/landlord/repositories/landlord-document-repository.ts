import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class LandlordDocumentRepository {
  async getDocuments(userId: string, organizationId: string, filters?: { propertyId?: string; category?: string; search?: string }) {
    const where: Prisma.PropertyDocumentWhereInput = {
      organizationId,
      property: {
        landlordId: userId,
      },
      parentId: null, // Only get main versions
    };

    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.propertyDocument.findMany({
      where,
      include: {
        property: { select: { propertyName: true } },
        favorites: {
          where: { userId }
        }
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  async getDocumentById(documentId: string, userId: string, organizationId: string) {
    return db.propertyDocument.findFirst({
      where: {
        id: documentId,
        organizationId,
        property: {
          landlordId: userId,
        },
      },
      include: {
        property: { select: { propertyName: true } },
        uploadedBy: { select: { name: true } },
        favorites: {
          where: { userId }
        },
        versions: {
          orderBy: { version: "desc" }
        }
      }
    });
  }

  async getDocumentVersions(documentId: string, userId: string, organizationId: string) {
    const doc = await db.propertyDocument.findFirst({
       where: { id: documentId, property: { landlordId: userId } },
       select: { id: true, parentId: true }
    });

    if (!doc) return [];

    const rootId = doc.parentId || doc.id;

    return db.propertyDocument.findMany({
      where: {
        OR: [
          { id: rootId },
          { parentId: rootId }
        ],
        organizationId,
      },
      orderBy: { version: "desc" }
    });
  }

  async toggleFavorite(documentId: string, userId: string) {
    const existing = await db.landlordFavoriteDocument.findUnique({
      where: {
        userId_documentId: {
          userId,
          documentId
        }
      }
    });

    if (existing) {
      await db.landlordFavoriteDocument.delete({
        where: { id: existing.id }
      });
      return false;
    } else {
      await db.landlordFavoriteDocument.create({
        data: {
          userId,
          documentId
        }
      });
      return true;
    }
  }

  async getRecentlyAccessed(userId: string, organizationId: string, limit = 5) {
     // This would normally come from an AccessLog table or similar.
     // For now, we'll use AuditLogs or just return the most recently published for assigned properties
     return db.propertyDocument.findMany({
        where: {
           organizationId,
           property: { landlordId: userId },
           parentId: null
        },
        include: {
           property: { select: { propertyName: true } }
        },
        orderBy: { publishedAt: "desc" },
        take: limit
     });
  }
}

export const landlordDocumentRepository = new LandlordDocumentRepository();
