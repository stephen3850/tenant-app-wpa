import { LeaseForm } from "@/features/leases/components/lease-form";
import { getProperties } from "@/actions/property-actions";
import { getUnits } from "@/features/units/actions/unit-actions";
import { getTenants } from "@/features/tenants/actions/tenant-actions";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLeasePage() {
  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  const [properties, units, tenants] = await Promise.all([
    getProperties(orgId),
    getUnits({}), // Need a way to fetch all units for org
    getTenants({}),
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Lease</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaseForm
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
              // Submission handled by client-side or action
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
