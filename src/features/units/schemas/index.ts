import { z } from "zod";
import { OccupancyStatus, UnitStatus } from "@prisma/client";

export const UnitFormSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  unitCode: z.string().optional().nullable(),

  // Classification
  unitType: z.string().min(1, "Unit type is required"),
  block: z.string().optional().nullable(),
  floor: z.string().optional().nullable(),

  // Rental
  monthlyRent: z.coerce.number().min(0, "Rent must be at least 0"),
  securityDeposit: z.coerce.number().min(0, "Deposit must be at least 0"),
  serviceCharge: z.coerce.number().min(0, "Service charge must be at least 0").default(0),

  // Physical
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  squareFootage: z.coerce.number().min(0).optional().nullable(),

  // Status
  occupancyStatus: z.nativeEnum(OccupancyStatus).default(OccupancyStatus.VACANT),
  status: z.nativeEnum(UnitStatus).default(UnitStatus.ACTIVE),
});

export type UnitFormValues = z.infer<typeof UnitFormSchema>;

export const UnitFilterSchema = z.object({
  propertyId: z.string().optional(),
  unitType: z.string().optional(),
  occupancyStatus: z.nativeEnum(OccupancyStatus).optional(),
  status: z.nativeEnum(UnitStatus).optional(),
  minRent: z.coerce.number().optional(),
  maxRent: z.coerce.number().optional(),
  search: z.string().optional(),
});

export type UnitFilterValues = z.infer<typeof UnitFilterSchema>;
