import { Prisma, LedgerEntryType } from "@prisma/client";
import { tenantLedgerRepository } from "../repositories/tenant-ledger-repository";

export class TenantLedgerService {
  async recordEntry(
    tx: Prisma.TransactionClient,
    data: {
      organizationId: string;
      tenantId: string;
      type: LedgerEntryType;
      description: string;
      debit?: number;
      credit?: number;
      reference?: string;
      paymentId?: string;
      invoiceId?: string;
    }
  ) {
    const lastEntry = await tenantLedgerRepository.findLastEntry(data.tenantId, data.organizationId);
    const currentBalance = Number(lastEntry?.balance || 0);

    const dr = data.debit || 0;
    const cr = data.credit || 0;

    // In property management:
    // Invoices (Debits) increase balance.
    // Payments (Credits) decrease balance.
    const newBalance = currentBalance + dr - cr;

    return tenantLedgerRepository.create({
      ...data,
      debit: new Prisma.Decimal(dr),
      credit: new Prisma.Decimal(cr),
      balance: new Prisma.Decimal(newBalance),
    }, tx);
  }

  async getStatement(tenantId: string, organizationId: string) {
    return tenantLedgerRepository.getStatement(tenantId, organizationId);
  }
}

export const tenantLedgerService = new TenantLedgerService();
