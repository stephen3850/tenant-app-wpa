import { UnitNewClient } from "./unit-new-client";
import { getProperties } from "@/actions/property-actions";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewUnitPage() {
  const session = await auth();
  const orgId = (session?.user as any)?.organizationId;

  if (!orgId) {
    throw new Error("Unauthorized: No organization context found");
  }

  const properties = await getProperties(orgId);

  const formattedProperties = properties.map(p => ({
    id: p.id,
    propertyName: p.propertyName || (p as any).name || "Unnamed Property"
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <Card className="border-[#DCE3EA] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-[#DCE3EA] px-8 py-6">
          <CardTitle className="text-2xl font-black text-[#1F2937]">Create New Unit</CardTitle>
          <p className="text-sm text-[#667085] mt-1">Add a new rental unit to your portfolio.</p>
        </CardHeader>
        <CardContent className="p-8">
          <UnitNewClient properties={formattedProperties} />
        </CardContent>
      </Card>
    </div>
  );
}
