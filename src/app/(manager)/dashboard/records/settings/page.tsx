import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { recordsRepository } from "@/features/records/repositories/records-repository";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function RetentionSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const policies = await recordsRepository.getRetentionPolicies(user.organizationId);

  const entities = [
    { type: "LEASE", label: "Lease Records" },
    { type: "TENANT", label: "Tenant Records" },
    { type: "INVOICE", label: "Financial Records (Invoices)" },
    { type: "PAYMENT", label: "Financial Records (Payments)" },
    { type: "TICKET", label: "Operational Records (Tickets)" },
    { type: "CASE", label: "Operational Records (Cases)" },
    { type: "SECURITY", label: "Security Records" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/records">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Retention Policies</h2>
      </div>

      <div className="grid gap-6">
        {entities.map((entity) => {
          const policy = policies.find(p => p.entityType === entity.type);
          return (
            <Card key={entity.type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{entity.label}</CardTitle>
                <CardDescription>Configure how long these records are kept in the active archive.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Retention Period:</span>
                  <Badge variant="outline">{policy ? `${policy.periodYears} Years` : "Permanent"}</Badge>
                </div>
                <Button variant="outline" size="sm">
                   Update Policy
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
