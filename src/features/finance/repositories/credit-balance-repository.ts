import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CreditBalanceRepository {
  async findByTenant(tenantId: string, organizationId: string) {
    return db.creditBalance.findUnique({
      where: { tenantId, organizationId },
    });
  }

  async upsert(tenantId: string, organizationId: string, amount: number, tx: Prisma.TransactionClient) {
    return tx.creditBalance.upsert({
      where: { tenantId },
      update: { amount: { increment: amount } },
      create: { tenantId, organizationId, amount },
    });
  }
}

export const creditBalanceRepository = new CreditBalanceRepository();
