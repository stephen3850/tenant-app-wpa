"use client";

import React from "react";
import Link from "next/link";
import { BellIcon, Home } from "lucide-react";
import { UserNav } from "@/components/shared/user-nav";
import { TenantMobileHeaderMenu } from "@/components/tenant/tenant-mobile-nav";

export function TenantTopHeader({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm shadow-2xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <TenantMobileHeaderMenu />
          <Link href="/portal" className="flex items-center space-x-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#56A600] text-white shadow-xs">
              <Home className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              TMS Tenant
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
          </button>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
