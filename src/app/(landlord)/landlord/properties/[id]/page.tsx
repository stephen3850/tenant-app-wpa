import {
  getLandlordProperty,
  getPropertyPerformance,
  getPropertyUnits,
  getPropertyDocuments,
  getTenancyInsights,
  getMaintenanceInsights
} from "@/actions/landlord";
import { LandlordPropertyDetails } from "@/features/landlord/components/landlord-property-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [property, performance, units, documents, tenancy, maintenance] = await Promise.all([
    getLandlordProperty(id),
    getPropertyPerformance(id),
    getPropertyUnits(id),
    getPropertyDocuments(id),
    getTenancyInsights(id),
    getMaintenanceInsights(id)
  ]);

  if (!property) {
    notFound();
  }

  return (
    <LandlordPropertyDetails
      property={property}
      performance={performance}
      units={units}
      documents={documents}
      tenancy={tenancy}
      maintenance={maintenance}
    />
  );
}
