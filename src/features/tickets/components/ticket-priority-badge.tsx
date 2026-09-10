import { Badge } from "@/components/ui/badge";
import { TicketPriority } from "@prisma/client";

const priorityConfig: Record<TicketPriority, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  LOW: { label: "Low", variant: "secondary" },
  MEDIUM: { label: "Medium", variant: "outline" },
  HIGH: { label: "High", variant: "warning" as any },
  URGENT: { label: "Urgent", variant: "destructive" },
  EMERGENCY: { label: "Emergency", variant: "destructive" },
};

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority] || { label: priority, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
