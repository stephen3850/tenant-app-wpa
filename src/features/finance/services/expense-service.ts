import { db } from "@/lib/db";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";

export class ExpenseService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async recordExpense(data: {
    propertyId: string;
    categoryId: string;
    vendorId: string;
    unitId?: string;
    amount: number;
    description: string;
    expenseDate: Date;
    createdById: string;
  }) {
    const user = await this.getSession();
    await checkPermission("create", "expenses");

    return db.expense.create({
      data: {
        ...data,
        expenseNumber: `EXP-${Date.now()}`,
        organizationId: user.organizationId,
        totalAmount: data.amount,
      },
    });
  }

  async listExpenses(propertyId?: string) {
    const user = await this.getSession();
    await checkPermission("read", "expenses");

    return db.expense.findMany({
      where: {
        organizationId: user.organizationId,
        ...(propertyId && { propertyId })
      },
      include: { property: true, unit: true },
      orderBy: { expenseDate: "desc" },
    });
  }
}

export const expenseService = new ExpenseService();
