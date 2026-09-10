import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

export const InvoiceLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().positive("Unit price must be positive"),
});

export const CreateInvoiceSchema = z.object({
  leaseId: z.string().cuid(),
  billingMonth: z.number().min(1).max(12),
  billingYear: z.number().min(2024),
  dueDate: z.date(),
  lineItems: z.array(InvoiceLineItemSchema).min(1, "At least one line item is required"),
  taxAmount: z.number().nonnegative().default(0),
});

export const UpdateInvoiceStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.nativeEnum(InvoiceStatus),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type InvoiceLineItemInput = z.infer<typeof InvoiceLineItemSchema>;
