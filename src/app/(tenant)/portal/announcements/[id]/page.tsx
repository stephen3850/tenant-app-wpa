import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { tenantAnnouncementService } from "@/features/tenant/services/tenant-announcement-service";
import { AnnouncementDetail } from "@/features/tenant/components/announcement-detail";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  try {
    const announcement = await tenantAnnouncementService.getAnnouncementDetails(session.user.id, id);
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-blue-600" asChild>
            <Link href="/announcements">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Announcement Center
            </Link>
          </Button>

          <AnnouncementDetail announcement={announcement} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Announcement Detail Error:", error);
    notFound();
  }
}
