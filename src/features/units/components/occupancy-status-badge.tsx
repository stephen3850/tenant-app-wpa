import { Badge } from "@/components/ui/badge";
import { OccupancyStatus } from "@prisma/client";

export function OccupancyStatusBadge({ status }: { status: OccupancyStatus }) {
  const variants: Record<OccupancyStatus, "default" | "secondary" | "destructive" | "outline"> = {
    VACANT: "secondary",
    OCCUPIED: "default",
    RESERVED: "outline",
    MAINTENANCE: "destructive",
  };

  const labels: Record<OccupancyStatus, string> = {
    VACANT: "Vacant",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
    MAINTENANCE: "Maintenance",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
