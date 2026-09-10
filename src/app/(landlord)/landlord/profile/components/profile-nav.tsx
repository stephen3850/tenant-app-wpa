"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const items = [
  {
    title: "Overview",
    href: "/landlord/profile",
  },
  {
    title: "Personal Information",
    href: "/landlord/profile/personal",
  },
  {
    title: "Security Settings",
    href: "/landlord/profile/security",
  },
  {
    title: "Notifications",
    href: "/landlord/profile/notifications",
  },
  {
    title: "Communication Prefs",
    href: "/landlord/profile/preferences",
  },
  {
    title: "Sessions",
    href: "/landlord/profile/sessions",
  },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium",
            "justify-start transition-all"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
