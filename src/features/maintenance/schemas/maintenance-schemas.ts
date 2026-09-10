import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

export const CreateTicketSchema = z.object({
  propertyId: z.string().cuid(),
  unitId: z.string().cuid().optional(),
  tenantId: z.string().cuid().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  categoryId: z.string().cuid("Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  dueDate: z.date().optional(),
  estimatedCost: z.number().nonnegative().optional(),
});

export const UpdateTicketSchema = z.object({
  id: z.string().cuid(),
  subject: z.string().min(5).optional(),
  categoryId: z.string().cuid().optional(),
  description: z.string().min(10).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  assigneeId: z.string().cuid().optional(),
  dueDate: z.date().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  actualCost: z.number().nonnegative().optional(),
  completionNotes: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
