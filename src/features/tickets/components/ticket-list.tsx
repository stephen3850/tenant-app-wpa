import { Ticket, Property, Unit, Tenant, User, TicketCategory } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TicketStatusBadge } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

type TicketWithRelations = Ticket & {
  property: Property;
  unit: Unit | null;
  tenant: Tenant | null;
  category: TicketCategory;
  assignee: User | null;
};

export function TicketList({ tickets }: { tickets: TicketWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket #</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Property/Unit</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{ticket.subject}</span>
                    <span className="text-xs text-muted-foreground">{ticket.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{ticket.property.propertyName}</span>
                    <span className="text-xs text-muted-foreground">
                      {ticket.unit ? `Unit ${ticket.unit.unitNumber}` : "Common Area"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <TicketPriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  {ticket.assignee?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                </TableCell>
                <TableCell>{format(new Date(ticket.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/tickets/${ticket.id}`}>
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
