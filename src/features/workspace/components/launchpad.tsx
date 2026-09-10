"use client";

import {
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function Launchpad() {
  const modules = [
    { label: "Properties", href: "/properties", icon: Building2, color: "text-amber-500" },
    { label: "Units", href: "/units", icon: Home, color: "text-violet-500" },
    { label: "Tenants", href: "/tenants", icon: Users, color: "text-blue-500" },
    { label: "Leases", href: "/leases", icon: FileText, color: "text-indigo-500" },
    { label: "Invoices", href: "/finance/invoices", icon: Receipt, color: "text-rose-500" },
    { label: "Payments", href: "/finance/payments", icon: CreditCard, color: "text-emerald-500" },
    { label: "Reports", href: "/reports", icon: BarChart3, color: "text-zinc-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-border border-b sm:grid-cols-4 lg:grid-cols-7">
      {modules.map((module) => (
        <Link
          key={module.label}
          href={module.href}
          className="group relative bg-card p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-background transition-colors group-hover:shadow-sm ${module.color}`}>
              <module.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {module.label}
              </h3>
            </div>
          </div>
          <span
            className="pointer-events-none absolute right-4 top-4 text-muted-foreground/30 group-hover:text-primary transition-colors"
            aria-hidden="true"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
