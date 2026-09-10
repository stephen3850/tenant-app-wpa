import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantAnnouncementService } from "@/features/tenant/services/tenant-announcement-service";
import { AnnouncementList } from "@/features/tenant/components/announcement-list";
import { AnnouncementFilters } from "@/features/tenant/components/announcement-filters";
import { MegaphoneIcon } from "lucide-react";
import { AnnouncementCategory, AnnouncementPriority } from "@prisma/client";

export default async function TenantAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: AnnouncementCategory;
    priority?: AnnouncementPriority;
    isRead?: string;
    search?: string
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const announcements = await tenantAnnouncementService.getAnnouncements(session.user.id, {
    category: params.category,
    priority: params.priority,
    isRead: params.isRead === "true" ? true : params.isRead === "false" ? false : undefined,
    search: params.search,
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <MegaphoneIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Announcement Center</h2>
            <p className="text-muted-foreground">
              Official communications and news from property management.
            </p>
          </div>
        </div>
      </div>

      <AnnouncementFilters />

      <AnnouncementList announcements={announcements} />
    </div>
  );
}
