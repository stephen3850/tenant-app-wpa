import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { utilityRepository } from "@/features/utilities/repositories/utility-repository";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReadingStatusBadge } from "@/features/utilities/components/reading-status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { approveReading, voidReading } from "@/actions/utilities";

export default async function ApprovalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const readings = await utilityRepository.findReadings(user.organizationId, { status: "PENDING_APPROVAL" });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/utilities">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Approval Queue</h2>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meter #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Consumption</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No readings awaiting approval.
                </TableCell>
              </TableRow>
            ) : (
              readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell className="font-medium">{reading.meter.meterNumber}</TableCell>
                  <TableCell>{reading.meter.utilityType.name}</TableCell>
                  <TableCell>{reading.previousReading.toString()}</TableCell>
                  <TableCell>{reading.currentReading.toString()}</TableCell>
                  <TableCell className="font-bold text-blue-600">{reading.consumption.toString()}</TableCell>
                  <TableCell>{format(new Date(reading.readingDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{reading.recordedBy.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={async () => {
                        "use server";
                        await approveReading(reading.id);
                    }} className="inline">
                        <Button size="sm" variant="outline" className="text-success hover:text-success border-success/20 hover:bg-success/10">
                            <CheckCircleIcon className="h-4 w-4 mr-2" /> Approve
                        </Button>
                    </form>
                    <form action={async () => {
                        "use server";
                        await voidReading(reading.id);
                    }} className="inline">
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <XCircleIcon className="h-4 w-4 mr-2" /> Void
                        </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
