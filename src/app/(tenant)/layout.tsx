export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantTopHeader } from "@/components/tenant/tenant-top-header";
import { TenantMobileBottomNav } from "@/components/tenant/tenant-mobile-nav";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlertIcon, LayoutDashboardIcon } from "lucide-react";

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

  let isTenantUser =
    roleNames.includes("TENANT") ||
    roleNames.includes("PLATFORM_ADMIN") ||
    roleNames.includes("SUPER_ADMIN");

  if (!isTenantUser) {
    // Check if session user has a tenant profile in db
    const tenantProfile = await db.tenant.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          ...(session.user.email ? [{ email: { equals: session.user.email.toLowerCase().trim(), mode: "insensitive" as const } }] : [])
        ]
      }
    });

    if (tenantProfile) {
      isTenantUser = true;
      if (!tenantProfile.userId) {
        await db.tenant.update({
          where: { id: tenantProfile.id },
          data: { userId: session.user.id }
        });
      }
    }
  }

  // If user is not a tenant profile, render a non-redirecting friendly notice inside the portal shell
  if (!isTenantUser) {
    return (
      <div className="flex min-h-screen bg-[#F8F9FB] font-sans items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlertIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Tenant Account Required</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your logged-in account (<strong>{session.user.email}</strong>) does not have an active tenant profile or lease linked to it.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Button className="w-full bg-slate-900 hover:bg-black font-bold h-11 rounded-xl" asChild>
              <Link href="/dashboard">
                <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                Go to Manager Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full font-bold h-11 rounded-xl border-slate-200" asChild>
              <Link href="/login">Switch Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
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
