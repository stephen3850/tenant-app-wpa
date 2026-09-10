import { getUnits, getUnitStats } from "@/features/units/actions/unit-actions";
import { getProperties } from "@/actions/property-actions";
import { redirect } from "next/navigation";
// Refreshing imports
import { auth } from "@/auth";
import { UnitHeader } from "@/features/units/components/unit-header";
import { UnitStatsCards } from "@/features/units/components/unit-stats-cards";
import { UnitCommandCenter } from "@/features/units/components/unit-command-center";

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  if (!orgId) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters = {
    propertyId: params.propertyId as string,
    unitType: params.unitType as string,
    occupancyStatus: params.occupancyStatus as any,
    status: params.status as any,
    search: params.search as string,
  };

  const [units, stats, properties] = await Promise.all([
    getUnits(filters),
    getUnitStats(),
    getProperties(orgId),
  ]);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      <UnitHeader />

      <UnitCommandCenter
        initialUnits={units}
        properties={properties.map(p => ({ id: p.id, propertyName: p.propertyName || (p as any).name }))}
        initialFilters={filters}
        stats={{
            total: stats.totalUnits,
            occupied: stats.occupiedUnits,
            vacant: stats.vacantUnits
        }}
      />
    </div>
  );
}
