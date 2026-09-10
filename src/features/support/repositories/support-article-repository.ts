import { db } from "@/lib/db";
import { Prisma, SupportArticleStatus } from "@prisma/client";

export class SupportArticleRepository {
  async findMany(organizationId: string, filters: { categoryId?: string; status?: SupportArticleStatus; search?: string }) {
    const where: Prisma.SupportArticleWhereInput = {
      organizationId,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.supportArticle.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { name: true, image: true }
        },
        tags: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string, organizationId: string) {
    return db.supportArticle.findUnique({
      where: { id, organizationId },
      include: {
        category: true,
        author: true,
        tags: true,
        versions: {
          orderBy: { version: "desc" },
          include: { author: { select: { name: true } } }
        }
      },
    });
  }

  async findBySlug(slug: string, organizationId: string) {
    return db.supportArticle.findUnique({
      where: { organizationId_slug: { organizationId, slug } },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });
  }

  async create(data: Prisma.SupportArticleUncheckedCreateInput) {
    return db.supportArticle.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.SupportArticleUncheckedUpdateInput) {
    return db.supportArticle.update({
      where: { id, organizationId },
      data,
    });
  }

  async createVersion(data: Prisma.SupportArticleVersionUncheckedCreateInput) {
    return db.supportArticleVersion.create({ data });
  }

  async getVersions(articleId: string) {
    return db.supportArticleVersion.findMany({
      where: { articleId },
      orderBy: { version: "desc" },
      include: { author: { select: { name: true } } }
    });
  }

  async findVersion(articleId: string, version: number) {
    return db.supportArticleVersion.findUnique({
      where: { articleId_version: { articleId, version } }
    });
  }
}

export const supportArticleRepository = new SupportArticleRepository();
