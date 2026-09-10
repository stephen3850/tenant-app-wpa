import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { accessRepository } from "@/features/access/repositories/access-repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";

export default async function ApprovalCenterPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const pendingApprovals = await accessRepository.findPendingApprovals(user.id, user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/users">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Approval Center</h2>
      </div>

      <div className="space-y-4">
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
             <ClockIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground">No pending approvals for your roles.</p>
          </div>
        ) : (
          pendingApprovals.map((step) => (
            <Card key={step.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                   <div>
                      <CardTitle>{step.workflow.name}</CardTitle>
                      <CardDescription>{step.workflow.description}</CardDescription>
                   </div>
                   <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">Step {step.order}</span>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                 <div className="text-sm">
                    <span className="text-muted-foreground">Entity ID:</span> <code className="bg-muted px-1 rounded">REQ-9923</code>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-success border-success/20 hover:bg-success/10">
                       <CheckCircleIcon className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                       <XCircleIcon className="h-4 w-4 mr-2" /> Reject
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
