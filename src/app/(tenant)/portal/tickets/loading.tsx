import { MaintenanceSkeleton } from "@/features/tenant/components/maintenance-skeleton";

export default function TicketsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <MaintenanceSkeleton />
    </div>
  );
}
