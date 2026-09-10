"use client";

import { TicketStatus, TicketPriority } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  property: { propertyName: string };
  assignee?: { name: string | null } | null;
  createdAt: Date;
  dueDate?: Date | null;
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "OPEN": return "bg-slate-100 text-slate-800";
      case "ASSIGNED": return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT": return "text-red-600 font-bold";
      case "HIGH": return "text-orange-600";
      case "MEDIUM": return "text-blue-600";
      case "LOW": return "text-slate-600";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No maintenance tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  <div>{ticket.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(ticket.createdAt), "PP")}</div>
                </TableCell>
                <TableCell>{ticket.property.propertyName}</TableCell>
                <TableCell className={getPriorityColor(ticket.priority)}>{ticket.priority}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.assignee?.name || "Unassigned"}</TableCell>
                <TableCell>
                  {ticket.dueDate ? format(new Date(ticket.dueDate), "PP") : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
