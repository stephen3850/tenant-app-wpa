import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class PaymentAllocationRepository {
  async create(data: Prisma.PaymentAllocationCreateUncheckedInput, tx: Prisma.TransactionClient) {
    return tx.paymentAllocation.create({ data });
  }

  async findByPaymentId(paymentId: string) {
    return db.paymentAllocation.findMany({
      where: { paymentId },
      include: { invoice: true },
    });
  }

  async deleteMany(paymentId: string, tx: Prisma.TransactionClient) {
    return tx.paymentAllocation.deleteMany({
      where: { paymentId },
    });
  }
}

export const paymentAllocationRepository = new PaymentAllocationRepository();
