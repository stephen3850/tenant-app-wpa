import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantDashboardService } from "@/features/tenant/services/tenant-dashboard-service";
import { TenantDashboard } from "@/features/tenant/components/tenant-dashboard";

export default async function TenantDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  try {
    const data = await tenantDashboardService.getTenantData(user.id);
    return <TenantDashboard data={data} />;
  } catch (error: any) {
    console.error("Tenant Dashboard Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Tenant Profile Loading</h2>
        <p className="text-slate-500 max-w-md">
          {error?.message || "There was an issue loading your tenant dashboard. Please try refreshing or contact support."}
        </p>
      </div>
    );
  }
}
