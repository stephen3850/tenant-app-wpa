import { UtilityMeter, Property, Unit, UtilityType } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeterStatusBadge } from "./meter-status-badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

type MeterWithRelations = UtilityMeter & {
  property: Property;
  unit: Unit | null;
  utilityType: UtilityType;
};

export function MeterList({ meters }: { meters: MeterWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meter #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Property/Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Installed On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No meters found.
              </TableCell>
            </TableRow>
          ) : (
            meters.map((meter) => (
              <TableRow key={meter.id}>
                <TableCell className="font-medium">{meter.meterNumber}</TableCell>
                <TableCell>{meter.utilityType.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{meter.property.propertyName}</span>
                    <span className="text-xs text-muted-foreground">
                      {meter.unit ? `Unit ${meter.unit.unitNumber}` : "Common Area"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <MeterStatusBadge status={meter.status} />
                </TableCell>
                <TableCell>
                  {meter.installationDate ? format(new Date(meter.installationDate), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/utilities/meters/${meter.id}`}>
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
