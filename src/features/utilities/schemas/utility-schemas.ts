import { z } from "zod";
import { MeterStatus, BillingBasis } from "@prisma/client";

export const meterSchema = z.object({
  meterNumber: z.string().min(1, "Meter number is required"),
  propertyId: z.string().min(1, "Property is required"),
  unitId: z.string().optional(),
  utilityTypeId: z.string().min(1, "Utility type is required"),
  status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE),
  installationDate: z.date().optional(),
  notes: z.string().optional(),
});

export const readingSchema = z.object({
  meterId: z.string().min(1, "Meter is required"),
  currentReading: z.number().min(0, "Current reading must be non-negative"),
  readingDate: z.date().default(() => new Date()),
  notes: z.string().optional(),
  readingImage: z.string().optional(),
});

export const billingRuleSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  utilityTypeId: z.string().min(1, "Utility type is required"),
  basis: z.nativeEnum(BillingBasis),
  fixedAmount: z.number().optional(),
  unitPrice: z.number().optional(),
  minimumCharge: z.number().optional(),
  taxPercentage: z.number().min(0).max(100).default(0),
  tiers: z.array(z.object({
      min: z.number(),
      max: z.number().nullable(),
      price: z.number()
  })).optional(),
});
