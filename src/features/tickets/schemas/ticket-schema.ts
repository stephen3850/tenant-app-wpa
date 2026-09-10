import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

export const ticketSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  unitId: z.string().optional(),
  tenantId: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  reportedBy: z.string().optional(),
  dueDate: z.date().optional(),
});

export type TicketInput = z.infer<typeof ticketSchema>;
