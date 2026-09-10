import { Badge } from "@/components/ui/badge";
import { MeterStatus } from "@prisma/client";

const statusConfig: Record<MeterStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  ACTIVE: { label: "Active", variant: "success" as any },
  INACTIVE: { label: "Inactive", variant: "secondary" },
  FAULTY: { label: "Faulty", variant: "destructive" },
  REPLACED: { label: "Replaced", variant: "outline" },
};

export function MeterStatusBadge({ status }: { status: MeterStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
