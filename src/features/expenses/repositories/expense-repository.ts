import { db } from "@/lib/db";
import { Prisma, ExpenseStatus } from "@prisma/client";

export class ExpenseRepository {
  async findById(id: string, organizationId: string) {
    return db.expense.findUnique({
      where: { id, organizationId },
      include: {
        property: true,
        unit: true,
        vendor: true,
        category: true,
        creator: true,
        approver: true,
        attachments: true,
      },
    });
  }

  async findMany(organizationId: string, filters?: {
    propertyId?: string;
    status?: ExpenseStatus;
    vendorId?: string;
    isArchived?: boolean;
  }) {
    return db.expense.findMany({
      where: {
        organizationId,
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.vendorId && { vendorId: filters.vendorId }),
        isArchived: filters?.isArchived ?? false,
      },
      include: {
        property: true,
        vendor: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    return db.expense.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.ExpenseUncheckedUpdateInput) {
    return db.expense.update({
      where: { id, organizationId },
      data,
    });
  }

  async getDashboardStats(organizationId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [thisMonth, outstanding, pending, categories] = await Promise.all([
      db.expense.aggregate({
        where: { organizationId, createdAt: { gte: startOfMonth }, status: { not: "VOIDED" } },
        _sum: { totalAmount: true }
      }),
      db.expense.aggregate({
        where: { organizationId, paymentStatus: { in: ["UNPAID", "PARTIAL"] }, status: "APPROVED" },
        _sum: { totalAmount: true }
      }),
      db.expense.count({
        where: { organizationId, status: "SUBMITTED" }
      }),
      db.expense.groupBy({
        by: ['categoryId'],
        where: { organizationId, status: "PAID" },
        _sum: { totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5
      })
    ]);

    return {
      expensesThisMonth: Number(thisMonth._sum.totalAmount || 0),
      outstandingExpenses: Number(outstanding._sum.totalAmount || 0),
      pendingApprovals: pending,
      topCategories: categories
    };
  }
}

export const expenseRepository = new ExpenseRepository();
