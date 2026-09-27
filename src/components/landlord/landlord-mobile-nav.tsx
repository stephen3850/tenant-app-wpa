"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home as HomeIcon,
  LayoutDashboardIcon,
  Building as BuildingIcon,
  WalletIcon,
  KeyIcon,
  WrenchIcon,
  FileBarChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/landlord/dashboard", icon: LayoutDashboardIcon },
  { label: "Properties", href: "/landlord/properties", icon: BuildingIcon },
  { label: "Financials", href: "/landlord/financials", icon: WalletIcon },
  { label: "Tenancies", href: "/landlord/tenancies", icon: KeyIcon },
  { label: "Tickets", href: "/landlord/tickets", icon: WrenchIcon },
  { label: "Documents", href: "/landlord/documents", icon: FileBarChartIcon },
  { label: "Reports", href: "/landlord/reports", icon: FileBarChartIcon },
];

export function LandlordMobileHeaderMenu() {
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
          <aside className="fixed inset-y-0 left-0 w-72 bg-white text-slate-900 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <Link href="/landlord/dashboard" className="flex items-center space-x-2.5" onClick={() => setIsOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-sm">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">TMS Owner</span>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/landlord/dashboard" && pathname.startsWith(item.href));
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

export function LandlordMobileBottomNav() {
  const pathname = usePathname();
  const bottomNavItems = navItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 w-full border-t bg-white flex justify-around py-2 px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/landlord/dashboard" && pathname.startsWith(item.href));
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
            <span className="truncate max-w-[64px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
