import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantRoutes } from "@/lib/routes";

export default async function PortalIndexPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Always redirect to tenant portal dashboard
  redirect(tenantRoutes.dashboard());
}
