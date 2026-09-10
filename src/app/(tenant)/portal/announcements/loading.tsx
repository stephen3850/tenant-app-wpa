import { AnnouncementSkeleton } from "@/features/tenant/components/announcement-skeleton";

export default function AnnouncementsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-48 bg-slate-100 animate-pulse rounded" />
        </div>
      </div>
      <AnnouncementSkeleton />
    </div>
  );
}
