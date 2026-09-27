"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  HomeIcon,
  CreditCardIcon,
  WrenchIcon,
  FileTextIcon,
  FileCheckIcon,
  BarChart3,
  UserIcon,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: HomeIcon },
  { label: "Invoices", href: "/portal/invoices", icon: FileTextIcon },
  { label: "Payments", href: "/portal/payments", icon: CreditCardIcon },
  { label: "Receipts", href: "/portal/receipts", icon: FileCheckIcon },
  { label: "Lease", href: "/portal/lease", icon: FileTextIcon },
  { label: "Documents", href: "/portal/documents", icon: FileCheckIcon },
  { label: "Tickets", href: "/portal/tickets", icon: WrenchIcon },
  { label: "Reports", href: "/portal/reports", icon: BarChart3 },
  { label: "My Profile", href: "/portal/profile", icon: UserIcon },
];

export function TenantSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30 bg-white border-r border-[#E2E8F0] shadow-sm">
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#E2E8F0] shrink-0">
        <Link href="/portal/dashboard" className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#56A600] text-white shadow-sm">
            <Home className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#1E293B]">
              TMS Tenant
            </span>
            <span className="text-[10px] font-bold text-[#56A600] uppercase tracking-wider">
              Tenant Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/portal/dashboard" && pathname === "/portal") ||
            (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group",
                isActive
                  ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-[#56A600]" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="h-8 w-8 border border-[#56A600]/30 shrink-0">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-[#56A600] text-white font-black text-xs">
                {user?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-extrabold text-slate-800 truncate">
                {user?.name || "Tenant"}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Tenant Account
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
