export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/components/shared/user-nav";
import { Footer } from "@/components/shared/footer";
import { HomeIcon, CreditCardIcon, WrenchIcon, FileTextIcon, BellIcon, FileCheckIcon, Home, BarChart3 } from "lucide-react";
import { TenantMobileHeaderMenu, TenantMobileBottomNav } from "@/components/tenant/tenant-mobile-nav";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/portal", icon: HomeIcon },
    { label: "Invoices", href: "/portal/invoices", icon: FileTextIcon },
    { label: "Payments", href: "/portal/payments", icon: CreditCardIcon },
    { label: "Receipts", href: "/portal/receipts", icon: FileCheckIcon },
    { label: "Lease", href: "/portal/lease", icon: FileTextIcon },
    { label: "Documents", href: "/portal/documents", icon: FileCheckIcon },
    { label: "Tickets", href: "/portal/tickets", icon: WrenchIcon },
    { label: "Reports", href: "/portal/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans pb-16 md:pb-0">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between py-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 md:gap-10">
            <TenantMobileHeaderMenu />
            <Link href="/portal" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-sm">
                <Home className="h-5 w-5" />
              </div>
              <span className="inline-block font-bold text-lg sm:text-xl tracking-tight">TMS Tenant</span>
            </Link>
            <nav className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-sm font-semibold text-muted-foreground transition-all hover:text-primary"
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
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />

      {/* Mobile Navigation Bottom Bar */}
      <TenantMobileBottomNav />
    </div>
  );
}
