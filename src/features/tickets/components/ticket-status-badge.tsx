import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@prisma/client";

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  OPEN: { label: "Open", variant: "outline" },
  ASSIGNED: { label: "Assigned", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  AWAITING_TENANT: { label: "Awaiting Tenant", variant: "warning" },
  AWAITING_VENDOR: { label: "Awaiting Vendor", variant: "warning" },
  ESCALATED: { label: "Escalated", variant: "destructive" },
  RESOLVED: { label: "Resolved", variant: "success" },
  UNDER_REVIEW: { label: "Under Review", variant: "outline" },
  CLOSED: { label: "Closed", variant: "default" },
  REOPENED: { label: "Reopened", variant: "outline" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
