import { LeaseSkeleton } from "@/features/tenant/components/lease-skeleton";

export default function LeaseLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-48 bg-slate-200 animate-pulse rounded" />
      </div>
      <LeaseSkeleton />
    </div>
  );
}
