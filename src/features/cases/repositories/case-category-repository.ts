import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CaseCategoryRepository {
  async findMany(organizationId: string) {
    return db.caseCategory.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.CaseCategoryUncheckedCreateInput) {
    return db.caseCategory.create({ data });
  }

  async delete(id: string, organizationId: string) {
    return db.caseCategory.delete({
      where: { id, organizationId, isSystem: false },
    });
  }
}

export const caseCategoryRepository = new CaseCategoryRepository();
