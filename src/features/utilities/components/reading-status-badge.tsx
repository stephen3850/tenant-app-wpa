import { Badge } from "@/components/ui/badge";
import { ReadingStatus } from "@prisma/client";

const statusConfig: Record<ReadingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" as any },
  APPROVED: { label: "Approved", variant: "success" as any },
  VOIDED: { label: "Voided", variant: "destructive" },
  BILLED: { label: "Billed", variant: "default" },
};

export function ReadingStatusBadge({ status }: { status: ReadingStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
