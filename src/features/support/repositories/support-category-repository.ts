import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class SupportCategoryRepository {
  async findMany(organizationId: string) {
    return db.supportCategory.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.SupportCategoryUncheckedCreateInput) {
    return db.supportCategory.create({ data });
  }

  async findById(id: string, organizationId: string) {
    return db.supportCategory.findUnique({
      where: { id, organizationId }
    });
  }
}

export const supportCategoryRepository = new SupportCategoryRepository();
