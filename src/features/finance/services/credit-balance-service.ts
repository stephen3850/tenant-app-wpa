import { Prisma } from "@prisma/client";
import { creditBalanceRepository } from "../repositories/credit-balance-repository";

export class CreditBalanceService {
  async addCredit(tenantId: string, organizationId: string, amount: number, tx: Prisma.TransactionClient) {
    return creditBalanceRepository.upsert(tenantId, organizationId, amount, tx);
  }

  async useCredit(tenantId: string, organizationId: string, amount: number, tx: Prisma.TransactionClient) {
    const credit = await creditBalanceRepository.findByTenant(tenantId, organizationId);
    if (!credit || Number(credit.amount) < amount) throw new Error("Insufficient credit");

    return tx.creditBalance.update({
      where: { tenantId },
      data: { amount: { decrement: amount } },
    });
  }
}

export const creditBalanceService = new CreditBalanceService();
