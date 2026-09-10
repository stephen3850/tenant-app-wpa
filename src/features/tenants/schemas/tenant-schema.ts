import { z } from "zod";
import { TenantStatus } from "@prisma/client";

export const tenantSchema = z.object({
  id: z.string().optional(),
  tenantCode: z.string().optional().nullable(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),

  // Identification
  idNumber: z.string().min(1, "National ID is required"),
  passportNumber: z.string().optional().nullable(),

  // Contact
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().min(10, "Valid phone number is required"),
  alternativePhone: z.string().optional().nullable(),

  // Address
  postalAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),

  // Emergency Contact
  emergencyName: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  relationship: z.string().optional().nullable(),

  // Employment
  employer: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),

  // System
  profilePhoto: z.string().optional().nullable(),
  status: z.nativeEnum(TenantStatus).default(TenantStatus.ACTIVE),

  // Dates
  moveInDate: z.coerce.date().optional().nullable(),
  moveOutDate: z.coerce.date().optional().nullable(),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;

export const tenantFilterSchema = z.object({
  status: z.nativeEnum(TenantStatus).optional(),
  propertyId: z.string().optional(),
  unitId: z.string().optional(),
  search: z.string().optional(),
  moveInDateStart: z.coerce.date().optional(),
  moveInDateEnd: z.coerce.date().optional(),
});

export type TenantFilters = z.infer<typeof tenantFilterSchema>;
