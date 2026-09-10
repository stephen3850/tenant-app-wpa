import { z } from "zod";

export const VendorSchema = z.object({
  name: z.string().min(2, "Vendor name is required"),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  taxPin: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type VendorInput = z.infer<typeof VendorSchema>;
