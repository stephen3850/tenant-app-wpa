export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/components/shared/user-nav";
import { Footer } from "@/components/shared/footer";
import {
  LayoutDashboardIcon,
  Home as HomeIcon,
  WalletIcon,
  WrenchIcon,
  KeyIcon,
  BellIcon,
  FileBarChartIcon,
  Building as BuildingIcon
} from "lucide-react";
import { TenantProvider } from "@/providers/tenant-provider";
import { LandlordMobileHeaderMenu, LandlordMobileBottomNav } from "@/components/landlord/landlord-mobile-nav";

export default async function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/landlord/dashboard", icon: LayoutDashboardIcon },
    { label: "Properties", href: "/landlord/properties", icon: BuildingIcon },
    { label: "Financials", href: "/landlord/financials", icon: WalletIcon },
    { label: "Tenancies", href: "/landlord/tenancies", icon: KeyIcon },
    { label: "Tickets", href: "/landlord/tickets", icon: WrenchIcon },
    { label: "Documents", href: "/landlord/documents", icon: FileBarChartIcon },
    { label: "Reports", href: "/landlord/reports", icon: FileBarChartIcon },
  ];

  return (
    <TenantProvider>
      <div className="flex min-h-screen flex-col bg-background font-sans pb-16 lg:pb-0">
        <header className="sticky top-0 z-40 w-full border-b bg-card">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:gap-10">
              <LandlordMobileHeaderMenu />
              <Link href="/landlord/dashboard" className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-sm">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <span className="inline-block font-bold text-lg sm:text-xl tracking-tight">TMS Owner</span>
              </Link>
              <nav className="hidden lg:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground rounded-lg transition-all hover:bg-muted hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-3">
               <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-background" />
               </button>
               <UserNav user={session.user} />
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Mobile Navigation Bottom Bar */}
        <LandlordMobileBottomNav />
      </div>
    </TenantProvider>
  );
}
