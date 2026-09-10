import * as z from "zod";

export const PropertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  code: z.string().min(1, "Property code is required"),
  type: z.string().min(1, "Property type is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  county: z.string().optional(),
  description: z.string().optional(),
});

export const UnitSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  type: z.string().optional(),
  rentAmount: z.coerce.number().min(0, "Rent amount must be positive"),
  status: z.enum(["VACANT", "OCCUPIED", "MAINTENANCE"]).default("VACANT"),
});
