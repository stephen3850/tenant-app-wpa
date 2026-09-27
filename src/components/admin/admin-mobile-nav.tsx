"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  Activity,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/admin/organizations", icon: Building2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Security", href: "/admin/security", icon: ShieldCheck },
  { label: "System Health", href: "/admin/health", icon: Activity },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
];

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-xl h-10 w-10 text-slate-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
              <Link href="/admin/dashboard" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                <div className="bg-[#56A600] p-2 rounded-xl">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter">TMS PLATFORM</span>
              </Link>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-xl" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                      isActive
                        ? "bg-[#56A600] text-white shadow-lg shadow-[#56A600]/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  SA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Super Admin</p>
                  <p className="text-[10px] text-slate-400 truncate">Platform Control</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
