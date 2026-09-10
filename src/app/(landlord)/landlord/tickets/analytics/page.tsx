import { getMaintenanceAnalytics } from "@/actions/landlord-maintenance";
import { LandlordMaintenanceAnalytics } from "@/features/landlord/components/landlord-maintenance-analytics";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordMaintenanceAnalyticsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getMaintenanceAnalytics("YTD");

  return <LandlordMaintenanceAnalytics data={data} />;
}
