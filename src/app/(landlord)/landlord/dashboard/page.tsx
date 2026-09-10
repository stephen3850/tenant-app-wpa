import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { landlordDashboardService } from "@/features/landlord/services/landlord-dashboard-service";
import { LandlordDashboard } from "@/features/landlord/components/landlord-dashboard";

export default async function LandlordDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  try {
    const data = await landlordDashboardService.getLandlordDashboard(user.id, user.organizationId);

    // If landlord has no properties, maybe we should show an onboarding or specific message
    // but the component should handle empty states.

    return <LandlordDashboard data={data} />;
  } catch (error) {
    console.error("Landlord Dashboard Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">Unable to load dashboard</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          There was an error retrieving your portfolio data. Please ensure you are assigned as an owner to your properties.
        </p>
      </div>
    );
  }
}
