import { SecurityVisitor, Tenant } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LogOutIcon, UserCheckIcon } from "lucide-react";
import { recordVisitorExit } from "@/actions/security";

type VisitorWithRelations = SecurityVisitor & {
  hostTenant: Tenant | null;
};

export function VisitorRegister({ visitors }: { visitors: VisitorWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visitor Name</TableHead>
            <TableHead>ID/Passport</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Host/Unit</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No visitors recorded.
              </TableCell>
            </TableRow>
          ) : (
            visitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-medium">{visitor.visitorName}</TableCell>
                <TableCell>{visitor.idNumber || "-"}</TableCell>
                <TableCell>{visitor.phoneNumber || "-"}</TableCell>
                <TableCell>{visitor.vehicleReg || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{visitor.hostTenant ? `${visitor.hostTenant.firstName} ${visitor.hostTenant.lastName}` : "-"}</span>
                    <span className="text-xs text-muted-foreground">{visitor.unitVisited || "-"}</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(visitor.checkInTime), "HH:mm")}</TableCell>
                <TableCell>
                  {visitor.checkOutTime ? format(new Date(visitor.checkOutTime), "HH:mm") : (
                    <span className="text-success font-medium flex items-center gap-1">
                      <UserCheckIcon className="h-3 w-3" /> On Site
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!visitor.checkOutTime && (
                    <form action={async () => {
                        "use server";
                        await recordVisitorExit(visitor.id);
                    }}>
                        <Button variant="outline" size="sm">
                            <LogOutIcon className="mr-2 h-4 w-4" /> Check-out
                        </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
