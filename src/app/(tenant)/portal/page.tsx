import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantDashboardService } from "@/features/tenant/services/tenant-dashboard-service";
import { TenantDashboard } from "@/features/tenant/components/tenant-dashboard";

export default async function TenantDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roleNames = (session.user as any).roles || [];

  if (!roleNames.includes("TENANT") && !roleNames.includes("PLATFORM_ADMIN")) {
    redirect("/dashboard");
  }

  try {
    const data = await tenantDashboardService.getTenantData(session.user.id);
    return <TenantDashboard data={data} />;
  } catch (error) {
    console.error("Dashboard Error:", error);
    // If no tenant profile, maybe redirect or show a setup page
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold text-destructive">Dashboard Unavailable</h2>
        <p className="text-muted-foreground mt-2">
          We couldn't find a tenant profile linked to your account.
          Please contact your property manager if you believe this is an error.
        </p>
      </div>
    );
  }
}
