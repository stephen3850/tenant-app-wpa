import { getLandlordProperties } from "@/actions/landlord";
import { LandlordPropertiesList } from "@/features/landlord/components/landlord-properties-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const properties = await getLandlordProperties({
    status: searchParams.status,
    search: searchParams.search,
  });

  return <LandlordPropertiesList properties={properties} />;
}
