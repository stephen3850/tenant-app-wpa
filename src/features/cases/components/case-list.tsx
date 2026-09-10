import { Case, Property, Unit, Tenant, User, CaseCategory } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CaseStatusBadge } from "./case-status-badge";
import { CaseSeverityBadge } from "./case-severity-badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

type CaseWithRelations = Case & {
  property: Property;
  unit: Unit | null;
  tenant: Tenant | null;
  category: CaseCategory;
  assignee: User | null;
};

export function CaseList({ cases }: { cases: CaseWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case #</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Property/Unit</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Opened</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No cases found.
              </TableCell>
            </TableRow>
          ) : (
            cases.map((caseRecord) => (
              <TableRow key={caseRecord.id}>
                <TableCell className="font-medium">{caseRecord.caseNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{caseRecord.subject}</span>
                    <span className="text-xs text-muted-foreground">{caseRecord.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{caseRecord.property.propertyName}</span>
                    <span className="text-xs text-muted-foreground">
                      {caseRecord.unit ? `Unit ${caseRecord.unit.unitNumber}` : "Common Area"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <CaseSeverityBadge severity={caseRecord.severity} />
                </TableCell>
                <TableCell>
                  <CaseStatusBadge status={caseRecord.status} />
                </TableCell>
                <TableCell>
                  {caseRecord.assignee?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                </TableCell>
                <TableCell>{format(new Date(caseRecord.openedAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/cases/${caseRecord.id}`}>
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
