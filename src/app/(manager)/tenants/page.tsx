import { getTenants, getTenantStats } from "@/features/tenants/actions/tenant-actions";
import { TenantPageClient } from "@/features/tenants/components/tenant-page-client";
import { auth } from "@/auth";

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  const params = await searchParams;
  const filters = {
    status: params.status as any,
    search: params.search as string,
  };

  const [tenants, stats] = await Promise.all([
    getTenants(filters),
    getTenantStats(),
  ]);

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      <TenantPageClient
        initialTenants={tenants}
        stats={{
          totalTenants: stats.totalTenants || 0,
          activeTenants: stats.activeTenants || 0,
          formerTenants: stats.formerTenants || 0,
          blacklistedTenants: stats.blacklistedTenants || 0
        }}
        initialFilters={filters}
      />
    </div>
  );
}
