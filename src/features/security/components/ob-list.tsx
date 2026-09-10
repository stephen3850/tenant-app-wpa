import { SecurityIncident, Property, User, SecurityIncidentCategory } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IncidentStatusBadge } from "./incident-status-badge";
import { IncidentSeverityBadge } from "./incident-severity-badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

type IncidentWithRelations = SecurityIncident & {
  property: Property;
  category: SecurityIncidentCategory;
  recordedBy: User;
};

export function OBList({ incidents }: { incidents: IncidentWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Log #</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No incidents recorded in the OB.
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.logNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{incident.subject}</span>
                    <span className="text-xs text-muted-foreground">{incident.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>{incident.property.propertyName}</TableCell>
                <TableCell>
                  <IncidentSeverityBadge severity={incident.severity} />
                </TableCell>
                <TableCell>
                  <IncidentStatusBadge status={incident.status} />
                </TableCell>
                <TableCell>{incident.recordedBy.name}</TableCell>
                <TableCell>{format(new Date(incident.createdAt), "MMM d, HH:mm")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/security/ob/${incident.id}`}>
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
