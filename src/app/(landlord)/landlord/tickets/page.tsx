import { getMaintenanceDashboard } from "@/actions/landlord-maintenance";
import { LandlordMaintenanceDashboard } from "@/features/landlord/components/landlord-maintenance-dashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordMaintenancePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getMaintenanceDashboard("MTD");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <LandlordMaintenanceDashboard data={data} />
    </div>
  );
}
