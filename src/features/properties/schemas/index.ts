import { z } from "zod";

export const PropertyStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]);

export const PropertyFormSchema = z.object({
  propertyName: z.string().min(2, "Name must be at least 2 characters"),
  propertyCode: z.string().min(2, "Code must be at least 2 characters"),
  propertyType: z.string().min(1, "Type is required"),
  description: z.string().optional(),

  // Location
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  county: z.string().min(1, "County is required"),
  postalCode: z.string().optional(),
  country: z.string().default("Kenya"),

  // Ownership
  landlordId: z.string().optional().nullable(),
  caretakerId: z.string().optional().nullable(),

  status: PropertyStatusSchema.default("ACTIVE"),
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

export const PropertyFilterSchema = z.object({
  search: z.string().optional(),
  landlordId: z.string().optional(),
  status: PropertyStatusSchema.optional(),
  county: z.string().optional(),
});

export type PropertyFilterValues = z.infer<typeof PropertyFilterSchema>;
