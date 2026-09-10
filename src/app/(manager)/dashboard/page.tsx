import { auth } from "@/auth";
import { OwnerDashboard } from "@/features/workspace/components/owner-dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roleNames = (session.user as any).roles || [];

  if (roleNames.includes("TENANT")) {
    redirect("/portal");
  }

  if (roleNames.includes("PLATFORM_ADMIN")) {
    redirect("/admin/dashboard");
  }

  if (roleNames.includes("LANDLORD")) {
    redirect("/landlord/dashboard");
  }

  const permissions = (session.user as any).permissions || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OwnerDashboard permissions={permissions} />
    </div>
  );
}
