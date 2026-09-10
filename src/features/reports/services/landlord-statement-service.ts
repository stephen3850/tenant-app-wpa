import { db } from "@/lib/db";
import { auth } from "@/auth";

export class LandlordStatementService {
  async generateStatement(propertyId: string, startDate: Date, endDate: Date) {
    const session = await auth();
    const orgId = (session?.user as any).organizationId;

    // 1. Get Income (Payments for this property's units)
    const payments = await db.payment.findMany({
      where: {
        organizationId: orgId,
        paymentDate: { gte: startDate, lte: endDate },
        invoice: {
          lease: {
            unit: { propertyId }
          }
        }
      },
      include: {
        invoice: {
          include: {
            lease: {
              include: {
                tenant: true,
                unit: true
              }
            }
          }
        }
      }
    });

    // 2. Get Expenses for this property
    const expenses = await db.expense.findMany({
      where: {
        organizationId: orgId,
        propertyId,
        date: { gte: startDate, lte: endDate }
      }
    });

    const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netAmount = totalIncome - totalExpenses;

    return {
      propertyId,
      period: { startDate, endDate },
      income: payments,
      expenses,
      summary: {
        totalIncome,
        totalExpenses,
        netAmount,
      }
    };
  }
}

export const landlordStatementService = new LandlordStatementService();
