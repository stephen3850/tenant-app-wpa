import { auth } from "@/auth";
import { caseRepository } from "@/features/cases/repositories/case-repository";
import { CaseStatusBadge } from "@/features/cases/components/case-status-badge";
import { CaseSeverityBadge } from "@/features/cases/components/case-severity-badge";
import { CaseActivityFeed } from "@/features/cases/components/case-activity-feed";
import { format } from "date-fns";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, Gavel, ClockIcon } from "lucide-react";

export default async function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const caseRecord = await caseRepository.findById(id, user.organizationId);

  if (!caseRecord) notFound();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h2 className="text-3xl font-bold tracking-tight">{caseRecord.caseNumber}</h2>
             <CaseStatusBadge status={caseRecord.status} />
             <CaseSeverityBadge severity={caseRecord.severity} />
          </div>
          <p className="text-muted-foreground">{caseRecord.subject}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">
                <ClockIcon className="mr-2 h-4 w-4" /> Activity Feed
              </TabsTrigger>
              <TabsTrigger value="evidence">
                <FileIcon className="mr-2 h-4 w-4" /> Evidence Center
              </TabsTrigger>
              <TabsTrigger value="decisions">
                <Gavel className="mr-2 h-4 w-4" /> Decisions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Case Timeline</CardTitle>
                        <CardDescription>Full history of the case investigation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CaseActivityFeed activities={caseRecord.activities as any} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Evidence Center</CardTitle>
                        <CardDescription>Attached files, photos and documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {caseRecord.evidence.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-8">No evidence attached yet.</p>
                        ) : (
                            <div className="grid gap-2">
                                {caseRecord.evidence.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                                        <div className="flex items-center gap-2">
                                            <FileIcon className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-medium">{file.name}</span>
                                        </div>
                                        <a href={file.url} target="_blank" className="text-xs text-blue-600 hover:underline">Download</a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="decisions" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Decision Log</CardTitle>
                        <CardDescription>Official outcomes and resolutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {caseRecord.decisions.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-8">No decisions recorded yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {caseRecord.decisions.map((decision) => (
                                    <div key={decision.id} className="space-y-2 pb-6 border-b last:border-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-sm">Decision by {decision.decidedBy.name}</h4>
                                            <span className="text-xs text-muted-foreground">{format(new Date(decision.createdAt), "PPP")}</span>
                                        </div>
                                        <p className="text-sm">{decision.summary}</p>
                                        {decision.resolutionNotes && (
                                            <div className="bg-muted p-2 rounded text-sm italic">
                                                {decision.resolutionNotes}
                                            </div>
                                        )}
                                        {decision.financialImpact && (
                                            <div className="text-sm font-medium">
                                                Financial Impact: <span className={Number(decision.financialImpact) > 0 ? "text-destructive" : "text-success"}>KES {decision.financialImpact.toString()}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium">{caseRecord.property.propertyName}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Unit</span>
                <span className="font-medium">{caseRecord.unit?.unitNumber || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{caseRecord.category.name}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Tenant</span>
                <span className="font-medium">{caseRecord.tenant ? `${caseRecord.tenant.firstName} ${caseRecord.tenant.lastName}` : "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-medium">{caseRecord.creator.name}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Opened On</span>
                <span className="font-medium">{format(new Date(caseRecord.openedAt), "PPP")}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2">
                    {caseRecord.assignee ? (
                        <span className="text-sm font-medium">{caseRecord.assignee.name}</span>
                    ) : (
                        <span className="text-sm text-muted-foreground italic">Unassigned</span>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm whitespace-pre-wrap">{caseRecord.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
