import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@prisma/client";

const statusConfig: Record<UserStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  INVITED: { label: "Invited", variant: "outline" },
  ACTIVE: { label: "Active", variant: "success" as any },
  SUSPENDED: { label: "Suspended", variant: "warning" as any },
  DEACTIVATED: { label: "Deactivated", variant: "destructive" },
  LOCKED: { label: "Locked", variant: "destructive" },
  ARCHIVED: { label: "Archived", variant: "secondary" },
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const config = statusConfig[status] || { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
