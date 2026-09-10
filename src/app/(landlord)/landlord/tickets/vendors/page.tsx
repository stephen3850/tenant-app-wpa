import { getVendorPerformance } from "@/actions/landlord-maintenance";
import { LandlordVendorPerformance } from "@/features/landlord/components/landlord-vendor-performance";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordVendorsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const vendors = await getVendorPerformance();

  return <LandlordVendorPerformance vendors={vendors} />;
}
