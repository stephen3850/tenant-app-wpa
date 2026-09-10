import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class TicketCategoryRepository {
  async findMany(organizationId: string) {
    return db.ticketCategory.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.TicketCategoryUncheckedCreateInput) {
    return db.ticketCategory.create({ data });
  }

  async delete(id: string, organizationId: string) {
    return db.ticketCategory.delete({
      where: { id, organizationId, isSystem: false },
    });
  }
}

export const ticketCategoryRepository = new TicketCategoryRepository();
