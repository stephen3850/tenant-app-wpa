import { getLandlordTenancy } from "@/actions/landlord-tenancy";
import { LandlordTenancyDetails } from "@/features/landlord/components/landlord-tenancy-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordTenancyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const tenancy = await getLandlordTenancy(id);

  if (!tenancy) {
    notFound();
  }

  return <LandlordTenancyDetails lease={tenancy} />;
}
