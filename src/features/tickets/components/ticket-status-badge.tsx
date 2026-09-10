import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@prisma/client";

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  OPEN: { label: "Open", variant: "outline" },
  ASSIGNED: { label: "Assigned", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" as any },
  AWAITING_TENANT: { label: "Awaiting Tenant", variant: "warning" as any },
  AWAITING_VENDOR: { label: "Awaiting Vendor", variant: "warning" as any },
  ESCALATED: { label: "Escalated", variant: "destructive" },
  RESOLVED: { label: "Resolved", variant: "success" as any },
  CLOSED: { label: "Closed", variant: "default" },
  REOPENED: { label: "Reopened", variant: "outline" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
