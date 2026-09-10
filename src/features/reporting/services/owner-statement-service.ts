import { OwnerStatementRepository } from "../repositories/owner-statement-repository";
import { Prisma } from "@prisma/client";
import { Prisma as PrismaType } from "@prisma/client";

export class OwnerStatementService {
  private repository: OwnerStatementRepository;

  constructor(organizationId: string) {
    this.repository = new OwnerStatementRepository(organizationId);
  }

  async generateStatement(landlordId: string, propertyId: string, startDate: Date, endDate: Date) {
    // 1. Get all revenue (payments) for units in the property belonging to the landlord
    // 2. Get all expenses for the property/units
    // 3. Calculate opening balance (previous statement's closing balance)
    // 4. Create line items
    // 5. Create statement

    // This is a simplified implementation
    const revenue = new PrismaType.Decimal(0);
    const expenses = new PrismaType.Decimal(0);
    const netIncome = revenue.minus(expenses);

    const statementNumber = `STMT-${Date.now()}`;

    const statementData: Prisma.OwnerStatementUncheckedCreateInput = {
      organizationId: "", // Will be set by repository's tenant db
      landlordId,
      statementNumber,
      startDate,
      endDate,
      revenue,
      expenses,
      netIncome,
      disbursements: new PrismaType.Decimal(0),
      openingBalance: new PrismaType.Decimal(0),
      closingBalance: netIncome,
      status: "PUBLISHED",
    };

    const lineItems: Prisma.OwnerStatementLineCreateManyInput[] = [
      {
        date: new Date(),
        description: "Rent Collection",
        type: "INCOME",
        amount: revenue,
      }
    ];

    return this.repository.createStatement(statementData, lineItems);
  }

  async getStatements(landlordId?: string) {
    return this.repository.getStatements(landlordId);
  }

  async getStatement(id: string) {
    return this.repository.getStatementById(id);
  }
}
