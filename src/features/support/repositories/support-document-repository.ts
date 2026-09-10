import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class SupportDocumentRepository {
  async findMany(organizationId: string, filters: { category?: string; search?: string }) {
    const where: Prisma.SupportDocumentWhereInput = {
      organizationId,
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.supportDocument.findMany({
      where,
      include: {
        uploadedBy: { select: { name: true } },
        _count: { select: { downloadLogs: true } }
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async create(data: Prisma.SupportDocumentUncheckedCreateInput) {
    return db.supportDocument.create({ data });
  }

  async logDownload(documentId: string, userId: string) {
    return db.downloadLog.create({
      data: {
        documentId,
        userId,
      }
    });
  }

  async findById(id: string, organizationId: string) {
    return db.supportDocument.findUnique({
      where: { id, organizationId }
    });
  }
}

export const supportDocumentRepository = new SupportDocumentRepository();
