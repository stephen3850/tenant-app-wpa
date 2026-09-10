import { getTenantDb, systemDb } from "@/lib/tenant-db";
import { Prisma } from "@prisma/client";

export class OwnerStatementRepository {
  private db: any;

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

  async createStatement(data: Prisma.OwnerStatementUncheckedCreateInput, lineItems: any[]) {
    const statement = await this.db.ownerStatement.create({ data });

    await this.db.ownerStatementLine.createMany({
      data: lineItems.map((line) => ({
        ...line,
        ownerStatementId: statement.id,
      })),
    });

    return statement;
  }

  async updateStatement(id: string, data: Prisma.OwnerStatementUncheckedUpdateInput) {
    return this.db.ownerStatement.update({
      where: { id },
      data,
    });
  }
}
