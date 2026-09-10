import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { recordsRepository } from "@/features/records/repositories/records-repository";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function CompliancePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const records = await recordsRepository.getComplianceRecords(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/records">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Compliance Records</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/records/compliance/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New Compliance Record
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No compliance records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.property?.propertyName || "All Properties"}</TableCell>
                  <TableCell>{format(new Date(record.effectiveDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "ACTIVE" ? "success" as any : "secondary"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={record.documentUrl} target="_blank" rel="noopener noreferrer">
                        <FileIcon className="h-4 w-4" />
                      </a>
                    </Button>
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
