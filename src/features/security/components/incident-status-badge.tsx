import { Badge } from "@/components/ui/badge";
import { SecurityIncidentStatus } from "@prisma/client";

const statusConfig: Record<SecurityIncidentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  OPEN: { label: "Open", variant: "outline" },
  UNDER_INVESTIGATION: { label: "Investigating", variant: "warning" as any },
  MONITORING: { label: "Monitoring", variant: "secondary" },
  ESCALATED: { label: "Escalated", variant: "destructive" },
  RESOLVED: { label: "Resolved", variant: "success" as any },
  CLOSED: { label: "Closed", variant: "default" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function IncidentStatusBadge({ status }: { status: SecurityIncidentStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
