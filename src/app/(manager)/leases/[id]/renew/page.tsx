import { getLease } from "@/features/leases/actions/lease-actions";
import { LeaseForm } from "@/features/leases/components/lease-form";
import { getProperties } from "@/actions/property-actions";
import { getUnits } from "@/features/units/actions/unit-actions";
import { getTenants } from "@/features/tenants/actions/tenant-actions";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function RenewLeasePage({
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

  // Adjust pre-filled data for renewal
  const initialData = {
    ...lease,
    leaseNumber: `${lease.leaseNumber}-REV`,
    startDate: new Date(),
    endDate: lease.endDate ? new Date(new Date(lease.endDate).setFullYear(new Date().getFullYear() + 1)) : null,
    status: "ACTIVE",
  } as any;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Renew Lease: {lease.leaseNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">This will close the current lease and create a new one with updated terms.</p>
        </CardHeader>
        <CardContent>
          <LeaseForm
            initialData={initialData}
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
              // Renewal logic
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
