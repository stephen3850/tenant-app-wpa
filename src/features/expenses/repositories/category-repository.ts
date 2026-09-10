import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CategoryRepository {
  async findMany(organizationId: string) {
    return db.expenseCategory.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.ExpenseCategoryCreateUncheckedInput) {
    return db.expenseCategory.create({ data });
  }

  async delete(id: string, organizationId: string) {
    return db.expenseCategory.delete({
      where: { id, organizationId, isSystem: false },
    });
  }
}

export const categoryRepository = new CategoryRepository();
