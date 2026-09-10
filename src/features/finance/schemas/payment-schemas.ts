import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const RecordPaymentSchema = z.object({
  tenantId: z.string().cuid(),
  leaseId: z.string().cuid().optional(),
  amount: z.number().positive("Amount must be positive"),
  method: z.nativeEnum(PaymentMethod),
  transactionRef: z.string().optional(),
  paymentDate: z.date().optional(),
  notes: z.string().optional(),
});

export const ReversePaymentSchema = z.object({
  paymentId: z.string().cuid(),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export const ApplyCreditSchema = z.object({
  tenantId: z.string().cuid(),
  invoiceId: z.string().cuid(),
  amount: z.number().positive(),
});

export const ManualAllocationSchema = z.object({
  paymentId: z.string().cuid(),
  invoiceId: z.string().cuid(),
  amount: z.number().positive(),
});

export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>;
export type ReversePaymentInput = z.infer<typeof ReversePaymentSchema>;
export type ApplyCreditInput = z.infer<typeof ApplyCreditSchema>;
export type ManualAllocationInput = z.infer<typeof ManualAllocationSchema>;
