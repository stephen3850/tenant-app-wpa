import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class TenantLedgerRepository {
  async getStatement(tenantId: string, organizationId: string) {
    return db.tenantLedger.findMany({
      where: { tenantId, organizationId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findLastEntry(tenantId: string, organizationId: string) {
    return db.tenantLedger.findFirst({
      where: { tenantId, organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.TenantLedgerCreateUncheckedInput, tx?: Prisma.TransactionClient) {
    const client = tx || db;
    return client.tenantLedger.create({ data });
  }
}

export const tenantLedgerRepository = new TenantLedgerRepository();
