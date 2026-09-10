import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class MpesaTransactionRepository {
  async findById(id: string, organizationId: string) {
    return db.mpesaTransaction.findUnique({
      where: { id, organizationId },
    });
  }

  async findByCheckoutRequestId(checkoutRequestId: string) {
    return db.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
    });
  }

  async findByReceiptNumber(mpesaReceiptNumber: string) {
    return db.mpesaTransaction.findUnique({
      where: { mpesaReceiptNumber },
    });
  }

  async create(data: Prisma.MpesaTransactionCreateUncheckedInput) {
    return db.mpesaTransaction.create({ data });
  }

  async update(id: string, data: Prisma.MpesaTransactionUpdateInput) {
    return db.mpesaTransaction.update({
      where: { id },
      data,
    });
  }

  async findMany(organizationId: string, limit = 50) {
      return db.mpesaTransaction.findMany({
          where: { organizationId },
          orderBy: { createdAt: "desc" },
          take: limit,
          include: { tenant: true }
      });
  }

  async getMetrics(organizationId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [today, month, failed, pending] = await Promise.all([
      db.mpesaTransaction.aggregate({
        where: { organizationId, status: "SUCCESS", createdAt: { gte: startOfDay } },
        _sum: { amount: true },
      }),
      db.mpesaTransaction.aggregate({
        where: { organizationId, status: "SUCCESS", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      db.mpesaTransaction.count({
        where: { organizationId, status: "FAILED", createdAt: { gte: startOfMonth } },
      }),
      db.mpesaTransaction.count({
        where: { organizationId, status: "PENDING" },
      }),
    ]);

    const successCount = await db.mpesaTransaction.count({
        where: { organizationId, status: "SUCCESS", createdAt: { gte: startOfMonth } }
    });

    const totalCount = successCount + failed;
    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;

    return {
      collectionsToday: Number(today._sum.amount || 0),
      collectionsThisMonth: Number(month._sum.amount || 0),
      successRate: Number(successRate.toFixed(2)),
      failedTransactions: failed,
      pendingSTKRequests: pending,
    };
  }
}

export const mpesaTransactionRepository = new MpesaTransactionRepository();
