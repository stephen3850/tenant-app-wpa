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
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-card">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-10">
              <Link href="/landlord/dashboard" className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-sm">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <span className="inline-block font-bold text-xl tracking-tight">TMS Owner</span>
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
            <div className="flex items-center space-x-4">
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

        {/* Mobile Navigation */}
        <nav className="lg:hidden sticky bottom-0 z-40 w-full border-t bg-white flex justify-around py-3 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center text-[10px] font-bold text-slate-500 transition-colors hover:text-blue-600"
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.label}
              </Link>
            ))}
        </nav>
      </div>
    </TenantProvider>
  );
}
