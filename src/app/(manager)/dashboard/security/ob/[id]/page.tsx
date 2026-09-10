import { auth } from "@/auth";
import { securityRepository } from "@/features/security/repositories/security-repository";
import { IncidentStatusBadge } from "@/features/security/components/incident-status-badge";
import { IncidentSeverityBadge } from "@/features/security/components/incident-severity-badge";
import { IncidentActivityFeed } from "@/features/security/components/incident-activity-feed";
import { format } from "date-fns";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldAlertIcon, FileIcon, ClockIcon } from "lucide-react";

export default async function IncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const incident = await securityRepository.findIncidentById(id, user.organizationId);

  if (!incident) notFound();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <ShieldAlertIcon className="h-6 w-6 text-destructive" />
             <h2 className="text-3xl font-bold tracking-tight">{incident.logNumber}</h2>
             <IncidentStatusBadge status={incident.status} />
             <IncidentSeverityBadge severity={incident.severity} />
          </div>
          <p className="text-muted-foreground">{incident.subject}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{incident.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <CardTitle>Occurrence Timeline</CardTitle>
              </div>
              <CardDescription>Chronological log of all actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentActivityFeed activities={incident.activities as any} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Occurrence Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium">{incident.property.propertyName}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{incident.category.name}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Reported By</span>
                <span className="font-medium">{incident.reportedBy || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Recorded By</span>
                <span className="font-medium">{incident.recordedBy.name}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Logged On</span>
                <span className="font-medium">{format(new Date(incident.createdAt), "PPP p")}</span>
              </div>
              {incident.closedAt && (
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Closed On</span>
                  <span className="font-medium">{format(new Date(incident.closedAt), "PPP p")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence & Media</CardTitle>
            </CardHeader>
            <CardContent>
              {incident.evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">No evidence attached.</p>
              ) : (
                <div className="space-y-2">
                    {incident.evidence.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                            </div>
                            <a href={file.url} target="_blank" className="text-xs text-blue-600 hover:underline">View</a>
                        </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
