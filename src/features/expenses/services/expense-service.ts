import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { systemAuditLog } from "@/lib/audit";
import { expenseRepository } from "../repositories/expense-repository";
import { ExpenseStatus, Prisma } from "@prisma/client";
import { CreateExpenseInput, UpdateExpenseInput } from "../schemas/expense-schemas";

export class ExpenseService {
  async createExpense(organizationId: string, userId: string, input: CreateExpenseInput) {
    await checkPermission("create", "all"); // Should be expenses:create

    const expenseNumber = `EXP-${Date.now()}`;
    const totalAmount = new Prisma.Decimal(input.amount).add(new Prisma.Decimal(input.taxAmount || 0));

    const expense = await expenseRepository.create({
      organizationId,
      expenseNumber,
      propertyId: input.propertyId,
      unitId: input.unitId,
      vendorId: input.vendorId,
      categoryId: input.categoryId,
      expenseDate: input.expenseDate,
      dueDate: input.dueDate,
      amount: new Prisma.Decimal(input.amount),
      taxAmount: new Prisma.Decimal(input.taxAmount || 0),
      totalAmount,
      notes: input.notes,
      createdById: userId,
      status: ExpenseStatus.DRAFT,
    });

    await systemAuditLog({
      action: "EXPENSE_CREATED",
      entity: "Expense",
      entityId: expense.id,
      organizationId,
      newData: expense,
    });

    return expense;
  }

  async updateExpense(organizationId: string, expenseId: string, input: UpdateExpenseInput) {
    await checkPermission("update", "all");

    const existing = await expenseRepository.findById(expenseId, organizationId);
    if (!existing) throw new Error("Expense not found");
    if (existing.status !== ExpenseStatus.DRAFT && existing.status !== ExpenseStatus.REJECTED) {
      throw new Error("Only draft or rejected expenses can be edited");
    }

    const totalAmount = new Prisma.Decimal(input.amount || existing.amount)
      .add(new Prisma.Decimal(input.taxAmount || existing.taxAmount));

    const updated = await expenseRepository.update(expenseId, organizationId, {
      propertyId: input.propertyId,
      unitId: input.unitId,
      vendorId: input.vendorId,
      categoryId: input.categoryId,
      expenseDate: input.expenseDate,
      dueDate: input.dueDate,
      amount: input.amount ? new Prisma.Decimal(input.amount) : undefined,
      taxAmount: input.taxAmount ? new Prisma.Decimal(input.taxAmount) : undefined,
      totalAmount,
      notes: input.notes,
    });

    await systemAuditLog({
      action: "EXPENSE_UPDATED",
      entity: "Expense",
      entityId: expenseId,
      organizationId,
      oldData: existing,
      newData: updated,
    });

    return updated;
  }

  async submitExpense(organizationId: string, expenseId: string) {
    await checkPermission("update", "all");
    const updated = await this.updateStatus(organizationId, expenseId, ExpenseStatus.SUBMITTED, "EXPENSE_SUBMITTED");
    return updated;
  }

  async approveExpense(organizationId: string, expenseId: string, userId: string) {
    await checkPermission("manage", "all"); // Should be expenses:approve

    const existing = await expenseRepository.findById(expenseId, organizationId);
    if (!existing) throw new Error("Expense not found");

    const updated = await expenseRepository.update(expenseId, organizationId, {
      status: ExpenseStatus.APPROVED,
      approvedById: userId,
      approvalDate: new Date(),
    });

    await systemAuditLog({
      action: "EXPENSE_APPROVED",
      entity: "Expense",
      entityId: expenseId,
      organizationId,
      newData: { status: ExpenseStatus.APPROVED, approver: userId },
    });

    return updated;
  }

  async rejectExpense(organizationId: string, expenseId: string, reason: string) {
    await checkPermission("manage", "all");

    const updated = await expenseRepository.update(expenseId, organizationId, {
      status: ExpenseStatus.REJECTED,
      rejectionReason: reason,
    });

    await systemAuditLog({
      action: "EXPENSE_REJECTED",
      entity: "Expense",
      entityId: expenseId,
      organizationId,
      newData: { status: ExpenseStatus.REJECTED, reason },
    });

    return updated;
  }

  async markExpensePaid(organizationId: string, expenseId: string, paymentMethod: any) {
    await checkPermission("update", "all");

    const updated = await expenseRepository.update(expenseId, organizationId, {
      status: ExpenseStatus.PAID,
      paymentStatus: "PAID",
      paymentMethod,
    });

    await systemAuditLog({
      action: "EXPENSE_PAID",
      entity: "Expense",
      entityId: expenseId,
      organizationId,
      newData: { status: ExpenseStatus.PAID, paymentStatus: "PAID" },
    });

    return updated;
  }

  async voidExpense(organizationId: string, expenseId: string) {
    await checkPermission("update", "all");
    return this.updateStatus(organizationId, expenseId, ExpenseStatus.VOIDED, "EXPENSE_VOIDED");
  }

  async archiveExpense(organizationId: string, expenseId: string) {
    await checkPermission("delete", "all");
    const updated = await expenseRepository.update(expenseId, organizationId, { isArchived: true });

    await systemAuditLog({
      action: "EXPENSE_ARCHIVED",
      entity: "Expense",
      entityId: expenseId,
      organizationId,
    });

    return updated;
  }

  private async updateStatus(organizationId: string, expenseId: string, status: ExpenseStatus, action: string) {
    const updated = await expenseRepository.update(expenseId, organizationId, { status });

    await systemAuditLog({
      action,
      entity: "Expense",
      entityId: expenseId,
      organizationId,
      newData: { status },
    });

    return updated;
  }
}

export const expenseService = new ExpenseService();
