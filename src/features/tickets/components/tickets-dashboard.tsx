import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketRepository } from "../repositories/ticket-repository";
import { TicketStatusBadge } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";

export async function TicketsDashboard({ organizationId }: { organizationId: string }) {
  const stats = await ticketRepository.getDashboardStats(organizationId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueTickets}</div>
          </CardContent>
        </Card>
        {/* Add more summary cards here */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.byStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <TicketStatusBadge status={s.status} />
                  <span className="text-sm font-medium">{s._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>By Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.byPriority.map((p) => (
                <div key={p.priority} className="flex items-center justify-between">
                  <TicketPriorityBadge priority={p.priority} />
                  <span className="text-sm font-medium">{p._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
