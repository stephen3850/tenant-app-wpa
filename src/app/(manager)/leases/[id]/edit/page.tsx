import { getLease } from "@/features/leases/actions/lease-actions";
import { LeaseForm } from "@/features/leases/components/lease-form";
import { getProperties } from "@/actions/property-actions";
import { getUnits } from "@/features/units/actions/unit-actions";
import { getTenants } from "@/features/tenants/actions/tenant-actions";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditLeasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lease = await getLease(id);

  if (!lease) notFound();

  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  const [properties, units, tenants] = await Promise.all([
    getProperties(orgId),
    getUnits({}),
    getTenants({}),
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Lease: {lease.leaseNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaseForm
            initialData={lease as any}
            properties={properties.map(p => ({ id: p.id, propertyName: p.propertyName || (p as any).name }))}
            units={units.map(u => ({
              id: u.id,
              unitNumber: u.unitNumber,
              propertyId: u.propertyId,
              monthlyRent: Number(u.monthlyRent),
              securityDeposit: Number(u.securityDeposit)
            }))}
            tenants={tenants.map(t => ({ id: t.id, firstName: t.firstName, lastName: t.lastName }))}
            onSubmit={async (values) => {
              "use server";
              // Update logic
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
