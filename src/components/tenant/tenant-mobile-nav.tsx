"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  HomeIcon,
  CreditCardIcon,
  WrenchIcon,
  FileTextIcon,
  FileCheckIcon,
  BarChart3,
  BellIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function TenantMobileHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-xl h-10 w-10 text-slate-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white text-slate-900 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <Link href="/portal" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-sm">
                  <Home className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">TMS Tenant</span>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                      isActive
                        ? "bg-[#F0FDF4] text-[#12B76A] ring-1 ring-[#12B76A]/10 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-[#12B76A]" : "text-slate-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

export function TenantMobileBottomNav() {
  const pathname = usePathname();
  // Top 5 primary links for quick bottom nav bar
  const bottomNavItems = [
    { label: "Home", href: "/portal", icon: HomeIcon },
    { label: "Invoices", href: "/portal/invoices", icon: FileTextIcon },
    { label: "Payments", href: "/portal/payments", icon: CreditCardIcon },
    { label: "Tickets", href: "/portal/tickets", icon: WrenchIcon },
    { label: "Lease", href: "/portal/lease", icon: FileCheckIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full border-t bg-white flex justify-around py-2 px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] justify-center",
              isActive ? "text-[#56A600]" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-[#56A600]" : "text-slate-400")} />
            <span className="truncate max-w-[60px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
