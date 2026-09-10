"use server";

import { auth } from "@/auth";
import { expenseService } from "../services/expense-service";
import { expenseRepository } from "../repositories/expense-repository";
import { CreateExpenseSchema, UpdateExpenseSchema, RejectExpenseSchema } from "../schemas/expense-schemas";
import { revalidatePath } from "next/cache";

async function getContext() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return {
    organizationId: (session.user as any).organizationId as string,
    userId: session.user.id as string,
  };
}

export async function createExpenseAction(input: any) {
  const { organizationId, userId } = await getContext();
  const validated = CreateExpenseSchema.parse(input);
  const result = await expenseService.createExpense(organizationId, userId, validated);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/landlord/dashboard");
  revalidatePath("/landlord/financials");

  return result;
}

export async function updateExpenseAction(id: string, input: any) {
  const { organizationId } = await getContext();
  const validated = UpdateExpenseSchema.parse(input);
  const result = await expenseService.updateExpense(organizationId, id, validated);
  revalidatePath(`/expenses/${id}`);
  return result;
}

export async function submitExpenseAction(id: string) {
  const { organizationId } = await getContext();
  const result = await expenseService.submitExpense(organizationId, id);
  revalidatePath("/expenses");
  return result;
}

export async function approveExpenseAction(id: string) {
  const { organizationId, userId } = await getContext();
  const result = await expenseService.approveExpense(organizationId, id, userId);
  revalidatePath("/expenses");
  return result;
}

export async function rejectExpenseAction(input: any) {
  const { organizationId } = await getContext();
  const validated = RejectExpenseSchema.parse(input);
  const result = await expenseService.rejectExpense(organizationId, validated.expenseId, validated.reason);
  revalidatePath("/expenses");
  return result;
}

export async function markExpensePaidAction(id: string, paymentMethod: any) {
  const { organizationId } = await getContext();
  const result = await expenseService.markExpensePaid(organizationId, id, paymentMethod);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/landlord/dashboard");
  revalidatePath("/landlord/financials");

  return result;
}

export async function voidExpenseAction(id: string) {
  const { organizationId } = await getContext();
  const result = await expenseService.voidExpense(organizationId, id);
  revalidatePath("/expenses");
  return result;
}

export async function archiveExpenseAction(id: string) {
  const { organizationId } = await getContext();
  const result = await expenseService.archiveExpense(organizationId, id);
  revalidatePath("/expenses");
  return result;
}

export async function getExpenseStatsAction() {
  const { organizationId } = await getContext();
  return await expenseRepository.getDashboardStats(organizationId);
}
