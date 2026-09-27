export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantTopHeader } from "@/components/tenant/tenant-top-header";
import { TenantMobileBottomNav } from "@/components/tenant/tenant-mobile-nav";
import { getDashboardForRole } from "@/lib/routes";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roleNames = (session.user as any).roles || [];

  // Strict role guard: Only TENANT or PLATFORM_ADMIN can access /portal/* layout
  if (!roleNames.includes("TENANT") && !roleNames.includes("PLATFORM_ADMIN") && !roleNames.includes("SUPER_ADMIN")) {
    const dest = getDashboardForRole(roleNames);
    redirect(dest);
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans">
      {/* Desktop Vertical Sidebar */}
      <TenantSidebar user={session.user} />

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0 transition-all duration-300">
        <TenantTopHeader user={session.user} />

        <main className="flex-1 p-4 lg:p-6 pb-20 md:pb-8 max-w-full overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <TenantMobileBottomNav />
    </div>
  );
}
