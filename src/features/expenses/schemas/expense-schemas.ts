import { z } from "zod";

export const CreateExpenseSchema = z.object({
  propertyId: z.string().cuid(),
  unitId: z.string().cuid().optional().nullable(),
  vendorId: z.string().cuid(),
  categoryId: z.string().cuid(),
  expenseDate: z.date(),
  dueDate: z.date().optional().nullable(),
  amount: z.number().positive(),
  taxAmount: z.number().nonnegative().optional().default(0),
  notes: z.string().optional().nullable(),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export const RejectExpenseSchema = z.object({
  expenseId: z.string().cuid(),
  reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>;
