export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { Shell } from "@/components/shared/shell";
import { redirect } from "next/navigation";
import { TenantProvider } from "@/providers/tenant-provider";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const organizationStatus = (session.user as any).organizationStatus;

  return (
    <TenantProvider>
      <Shell user={session.user} organizationStatus={organizationStatus}>
        {children}
      </Shell>
    </TenantProvider>
  );
}
