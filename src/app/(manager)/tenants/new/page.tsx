import { AddTenantForm } from "@/features/tenants/components/add-tenant-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function NewTenantPage() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) {
    redirect("/login");
  }

  // Check if there are any properties in the organization
  const propertyCount = await db.property.count({
    where: {
      organizationId: organizationId,
    },
  });

  const hasProperties = propertyCount > 0;

  // Check if there are any vacant units in the organization
  const vacantUnit = await db.unit.findFirst({
    where: {
      property: {
        organizationId: organizationId,
      },
      occupancyStatus: "VACANT",
      status: "ACTIVE",
    },
    select: { id: true },
  });

  const hasVacantUnits = !!vacantUnit;

  // Fetch properties for the dropdown
  const properties = await db.property.findMany({
    where: { organizationId: organizationId },
    select: {
      id: true,
      propertyName: true,
    },
    orderBy: { propertyName: "asc" },
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#62A800] uppercase tracking-[0.2em]">PEOPLE</p>
          <h1 className="text-3xl font-black text-[#1A202C] tracking-tight">Add Tenant</h1>
          <p className="text-sm font-medium text-[#718096]">
            Add a tenant in under a minute, then fill optional details later.
          </p>
        </div>

        <Button asChild variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#3182CE] font-bold gap-2 text-xs bg-white shadow-sm transition-all active:scale-95">
          <Link href="/tenants">
            <span className="text-sm">←</span>
            <span>Back to list</span>
          </Link>
        </Button>
      </div>

      <AddTenantForm
        hasProperties={hasProperties}
        hasVacantUnits={hasVacantUnits}
        properties={properties.map(p => ({ id: p.id, name: p.propertyName }))}
      />
    </div>
  );
}
