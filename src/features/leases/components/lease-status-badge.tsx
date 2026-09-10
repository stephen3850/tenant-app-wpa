import { Badge } from "@/components/ui/badge";
import { LeaseStatus } from "@prisma/client";

export function LeaseStatusBadge({ status }: { status: LeaseStatus }) {
  const variants: Record<LeaseStatus, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "secondary",
    ACTIVE: "default",
    EXPIRING: "outline",
    EXPIRED: "destructive",
    TERMINATED: "destructive",
    RENEWED: "outline",
  };

  const labels: Record<LeaseStatus, string> = {
    DRAFT: "Draft",
    ACTIVE: "Active",
    EXPIRING: "Expiring",
    EXPIRED: "Expired",
    TERMINATED: "Terminated",
    RENEWED: "Renewed",
  };

  return (
    <Badge
      variant={variants[status]}
      className={status === "EXPIRING" ? "border-orange-500 text-orange-600" : ""}
    >
      {labels[status]}
    </Badge>
  );
}
