import { auth } from "@/auth";
import { ticketRepository } from "@/features/tickets/repositories/ticket-repository";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketActivityFeed } from "@/features/tickets/components/ticket-activity-feed";
import { format } from "date-fns";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const ticket = await ticketRepository.findById(id, user.organizationId);

  if (!ticket) notFound();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h2 className="text-3xl font-bold tracking-tight">{ticket.ticketNumber}</h2>
             <TicketStatusBadge status={ticket.status} />
             <TicketPriorityBadge priority={ticket.priority} />
          </div>
          <p className="text-muted-foreground">{ticket.subject}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Threaded view of comments and status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <TicketActivityFeed activities={ticket.activities as any} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium">{ticket.property.propertyName}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Unit</span>
                <span className="font-medium">{ticket.unit?.unitNumber || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{ticket.category.name}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Reported By</span>
                <span className="font-medium">{ticket.reportedBy || "Tenant"}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-medium">{ticket.creator.name}</span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Created On</span>
                <span className="font-medium">{format(new Date(ticket.createdAt), "PPP")}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Response Target</span>
                <span className="font-medium text-orange-600">
                    {ticket.responseTimeTarget ? format(new Date(ticket.responseTimeTarget), "MMM d, HH:mm") : "-"}
                </span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <span className="text-muted-foreground">Resolution Target</span>
                <span className="font-medium text-orange-600">
                    {ticket.resolutionTarget ? format(new Date(ticket.resolutionTarget), "MMM d, HH:mm") : "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.assignee ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{ticket.assignee.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No one assigned yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
