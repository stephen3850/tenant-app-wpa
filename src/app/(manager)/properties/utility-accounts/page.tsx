import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { UtilityAccountsView } from "@/features/properties/components/utility-accounts-view";

export default async function UtilityAccountsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const [properties, utilityTypes, meters] = await Promise.all([
    db.property.findMany({
      where: { deletedAt: null },
      select: { id: true, propertyName: true }
    }),
    db.utilityType.findMany({
      where: { organizationId }
    }),
    db.utilityMeter.findMany({
      where: { organizationId },
      include: {
        property: { select: { propertyName: true } },
        utilityType: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <UtilityAccountsView
      properties={serialize(properties)}
      utilityTypes={serialize(utilityTypes)}
      initialMeters={serialize(meters)}
    />
  );
}
