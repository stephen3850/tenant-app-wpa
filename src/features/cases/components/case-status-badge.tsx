import { Badge } from "@/components/ui/badge";
import { CaseStatus } from "@prisma/client";

const statusConfig: Record<CaseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  OPEN: { label: "Open", variant: "outline" },
  UNDER_REVIEW: { label: "Under Review", variant: "secondary" },
  INVESTIGATING: { label: "Investigating", variant: "warning" as any },
  AWAITING_INFORMATION: { label: "Awaiting Info", variant: "warning" as any },
  ESCALATED: { label: "Escalated", variant: "destructive" },
  RESOLVED: { label: "Resolved", variant: "success" as any },
  CLOSED: { label: "Closed", variant: "default" },
  REOPENED: { label: "Reopened", variant: "outline" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
