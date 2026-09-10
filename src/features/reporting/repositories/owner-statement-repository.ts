import { getTenantDb, systemDb } from "@/lib/tenant-db";
import { Prisma } from "@prisma/client";

export class OwnerStatementRepository {
  private db;

  constructor(organizationId?: string) {
    this.db = organizationId ? getTenantDb(organizationId) : systemDb;
  }

  async getStatements(landlordId?: string) {
    return this.db.ownerStatement.findMany({
      where: {
        landlordId,
      },
      orderBy: { startDate: "desc" },
    });
  }

  async getStatementById(id: string) {
    return this.db.ownerStatement.findUnique({
      where: { id },
      include: {
        lineItems: true,
        landlord: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async createStatement(data: Prisma.OwnerStatementUncheckedCreateInput, lineItems: Prisma.OwnerStatementLineCreateManyInput[]) {
    return this.db.$transaction(async (tx) => {
      const statement = await tx.ownerStatement.create({
        data,
      });

      await tx.ownerStatementLine.createMany({
        data: lineItems.map((line) => ({
          ...line,
          ownerStatementId: statement.id,
        })),
      });

      return statement;
    });
  }

  async updateStatement(id: string, data: Prisma.OwnerStatementUncheckedUpdateInput) {
    return this.db.ownerStatement.update({
      where: { id },
      data,
    });
  }
}
