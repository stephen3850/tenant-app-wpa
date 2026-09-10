import { getLandlordTenancy } from "@/actions/landlord-tenancy";
import { LandlordTenancyDetails } from "@/features/landlord/components/landlord-tenancy-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordTenancyPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const tenancy = await getLandlordTenancy(params.id);

  if (!tenancy) {
    notFound();
  }

  return <LandlordTenancyDetails lease={tenancy} />;
}
