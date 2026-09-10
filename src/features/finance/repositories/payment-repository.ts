import { db } from "@/lib/db";
import { Prisma, PaymentStatus } from "@prisma/client";

export class PaymentRepository {
  async findById(id: string, organizationId: string) {
    return db.payment.findUnique({
      where: { id, organizationId },
      include: {
        tenant: true,
        allocations: { include: { invoice: true } },
        ledgerEntries: true,
      },
    });
  }

  async findMany(organizationId: string, filters?: { tenantId?: string; status?: PaymentStatus }) {
    return db.payment.findMany({
      where: {
        organizationId,
        ...(filters?.tenantId && { tenantId: filters.tenantId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        tenant: true,
      },
      orderBy: { paymentDate: "desc" },
    });
  }

  async create(data: Prisma.PaymentCreateUncheckedInput, tx?: Prisma.TransactionClient) {
    const client = tx || db;
    return client.payment.create({ data });
  }

  async updateStatus(id: string, status: PaymentStatus, tx?: Prisma.TransactionClient) {
    const client = tx || db;
    return client.payment.update({
      where: { id },
      data: { status },
    });
  }

  async getMetrics(organizationId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const metrics = await db.$transaction([
      db.payment.aggregate({
        where: { organizationId, status: "COMPLETED", paymentDate: { gte: startOfDay } },
        _sum: { amount: true },
      }),
      db.payment.aggregate({
        where: { organizationId, status: "COMPLETED", paymentDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      db.invoice.aggregate({
        where: { organizationId, status: { notIn: ["PAID", "CANCELLED"] } },
        _sum: { balanceDue: true },
      }),
      db.creditBalance.aggregate({
        where: { organizationId },
        _sum: { amount: true },
      }),
    ]);

    return {
      collectionsToday: Number(metrics[0]._sum.amount || 0),
      collectionsThisMonth: Number(metrics[1]._sum.amount || 0),
      outstandingReceivables: Number(metrics[2]._sum.balanceDue || 0),
      totalTenantCredits: Number(metrics[3]._sum.amount || 0),
    };
  }
}

export const paymentRepository = new PaymentRepository();
