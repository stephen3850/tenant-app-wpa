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
    propertyId?: string;
    unitId?: string;
    category: string;
    amount: number;
    description: string;
    date: Date;
  }) {
    const user = await this.getSession();
    await checkPermission("create", "expense");

    return db.expense.create({
      data: {
        ...data,
        organizationId: user.organizationId,
      },
    });
  }

  async listExpenses(propertyId?: string) {
    const user = await this.getSession();
    await checkPermission("read", "expense");

    return db.expense.findMany({
      where: {
        organizationId: user.organizationId,
        ...(propertyId && { propertyId })
      },
      include: { property: true, unit: true },
      orderBy: { date: "desc" },
    });
  }
}

export const expenseService = new ExpenseService();
