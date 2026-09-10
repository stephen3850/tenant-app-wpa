import { Badge } from "@/components/ui/badge";
import { CaseSeverity } from "@prisma/client";

const severityConfig: Record<CaseSeverity, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  LOW: { label: "Low", variant: "secondary" },
  MEDIUM: { label: "Medium", variant: "outline" },
  HIGH: { label: "High", variant: "warning" as any },
  CRITICAL: { label: "Critical", variant: "destructive" },
};

export function CaseSeverityBadge({ severity }: { severity: CaseSeverity }) {
  const config = severityConfig[severity] || { label: severity, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
