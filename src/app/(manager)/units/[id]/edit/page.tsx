import { getUnit } from "@/features/units/actions/unit-actions";
import { getProperties } from "@/actions/property-actions";
import { UnitEditClient } from "./unit-edit-client";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  if (!orgId) {
    throw new Error("Unauthorized: No organization context found");
  }

  const [unit, properties] = await Promise.all([
    getUnit(id),
    getProperties(orgId),
  ]);

  if (!unit) {
    notFound();
  }

  const formattedProperties = properties.map(p => ({
    id: p.id,
    propertyName: p.propertyName || (p as any).name || "Unnamed Property"
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <Card className="border-[#DCE3EA] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-[#DCE3EA] px-8 py-6">
          <CardTitle className="text-2xl font-black text-[#1F2937]">Edit Unit: {unit.unitNumber}</CardTitle>
          <p className="text-sm text-[#667085] mt-1">Update details for this rental unit.</p>
        </CardHeader>
        <CardContent className="p-8">
          <UnitEditClient unit={unit} properties={formattedProperties} />
        </CardContent>
      </Card>
    </div>
  );
}
