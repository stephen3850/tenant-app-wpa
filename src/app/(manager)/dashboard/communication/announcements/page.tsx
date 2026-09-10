import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { communicationRepository } from "@/features/communication/repositories/communication-repository";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MegaphoneIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const announcements = await communicationRepository.findAnnouncements(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/communication">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/communication/announcements/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New Announcement
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No announcements found.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((ann) => (
                <TableRow key={ann.id}>
                  <TableCell className="font-medium">{ann.title}</TableCell>
                  <TableCell>{ann.targetType}</TableCell>
                  <TableCell>
                    <Badge variant={ann.status === "SENT" ? "success" as any : "secondary"}>
                      {ann.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ann.creator.name}</TableCell>
                  <TableCell>{format(new Date(ann.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/communication/announcements/${ann.id}`}>View</Link>
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
