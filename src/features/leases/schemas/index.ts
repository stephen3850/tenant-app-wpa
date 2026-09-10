import { z } from "zod";
import { LeaseStatus } from "@prisma/client";

export const LeaseFormSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  unitId: z.string().min(1, "Unit is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  leaseNumber: z.string().min(1, "Lease number is required"),

  // Financial
  monthlyRent: z.coerce.number().min(0, "Rent must be positive"),
  securityDeposit: z.coerce.number().min(0, "Deposit must be positive"),
  serviceCharge: z.coerce.number().min(0, "Service charge must be positive").default(0),
  lateFee: z.coerce.number().min(0, "Late fee must be positive").default(0),
  billingDay: z.coerce.number().int().min(1).max(31).default(1),

  // Dates
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  moveInDate: z.coerce.date().optional().nullable(),
  moveOutDate: z.coerce.date().optional().nullable(),

  // Terms
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY"),
  leaseTermMonths: z.coerce.number().int().optional().nullable(),
  noticePeriodDays: z.coerce.number().int().min(0).default(30),

  status: z.nativeEnum(LeaseStatus).default(LeaseStatus.ACTIVE),
  signedLeaseUrl: z.string().optional().nullable(),
});

export type LeaseFormValues = z.infer<typeof LeaseFormSchema>;

export const LeaseFilterSchema = z.object({
  propertyId: z.string().optional(),
  unitId: z.string().optional(),
  tenantId: z.string().optional(),
  status: z.nativeEnum(LeaseStatus).optional(),
  search: z.string().optional(),
  expiringSoon: z.boolean().optional(),
});

export type LeaseFilterValues = z.infer<typeof LeaseFilterSchema>;

export const TerminationSchema = z.object({
  moveOutDate: z.coerce.date(),
  terminationReason: z.string().min(1, "Reason is required"),
});

export type TerminationValues = z.infer<typeof TerminationSchema>;
