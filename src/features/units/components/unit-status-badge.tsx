import { Badge } from "@/components/ui/badge";
import { UnitStatus } from "@prisma/client";

export function UnitStatusBadge({ status }: { status: UnitStatus }) {
  const variants: Record<UnitStatus, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "outline",
    INACTIVE: "destructive",
  };

  return (
    <Badge variant={variants[status]} className={status === "ACTIVE" ? "border-green-500 text-green-700" : ""}>
      {status}
    </Badge>
  );
}
