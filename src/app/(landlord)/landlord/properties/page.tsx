import { getLandlordProperties } from "@/actions/landlord";
import { LandlordPropertiesList } from "@/features/landlord/components/landlord-properties-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const properties = await getLandlordProperties({
    status: params.status,
    search: params.search,
  });

  return <LandlordPropertiesList properties={properties} />;
}
