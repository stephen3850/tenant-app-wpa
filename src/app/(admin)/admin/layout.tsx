export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  ShieldCheck,
  Activity,
  LifeBuoy,
  Settings,
  Building2
} from "lucide-react";
import { UserNav } from "@/components/shared/user-nav";
import { Footer } from "@/components/shared/footer";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Basic security check for Super Admin
  if (!session?.user) {
    redirect("/login");
  }

  // Assuming null organizationId or special flag marks a Super Admin
  // if (session.user.organizationId) {
  //   redirect("/dashboard");
  // }

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Organizations", href: "/admin/organizations", icon: Building2 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Billing", href: "/admin/billing", icon: CreditCard },
    { label: "Security", href: "/admin/security", icon: ShieldCheck },
    { label: "System Health", href: "/admin/health", icon: Activity },
    { label: "Support", href: "/admin/support", icon: LifeBuoy },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-slate-900 text-white">
        <div className="p-8">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="bg-[#56A600] p-2 rounded-xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">TMS PLATFORM</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                 SA
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold truncate">Super Admin</p>
                 <p className="text-xs text-slate-500 truncate">Platform Control</p>
              </div>
           </div>
        </div>
      </aside>

      <div className="lg:pl-72 flex flex-col flex-1">
        <ImpersonationBanner />
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Super Admin Console</h2>
            <div className="flex items-center gap-4">
              <UserNav user={session.user} />
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
        <Footer className="bg-transparent border-t-0" />
      </div>
    </div>
  );
}
