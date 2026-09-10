import { z } from "zod";

export const STKPushSchema = z.object({
  phoneNumber: z.string().regex(/^(254)\d{9}$/, "Phone number must be in the format 2547XXXXXXXX"),
  amount: z.number().positive(),
  tenantId: z.string().cuid(),
  leaseId: z.string().cuid().optional(),
  invoiceIds: z.array(z.string().cuid()).optional(),
  accountReference: z.string().min(1).max(12),
});

export const MpesaConfigurationSchema = z.object({
  consumerKey: z.string().min(1),
  consumerSecret: z.string().min(1),
  shortCode: z.string().min(1),
  passkey: z.string().min(1),
  environment: z.enum(["sandbox", "production"]),
  callbackUrl: z.string().url().optional(),
});

export const ReversalSchema = z.object({
  transactionId: z.string().cuid(),
  reason: z.string().min(5),
});

export type STKPushInput = z.infer<typeof STKPushSchema>;
export type MpesaConfigurationInput = z.infer<typeof MpesaConfigurationSchema>;
export type ReversalInput = z.infer<typeof ReversalSchema>;
