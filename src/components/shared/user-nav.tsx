"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { logout } from "@/actions/auth";

export function UserNav({ user }: { user: any }) {
  const roleNames = user?.roles || [];
  const primaryRole = roleNames[0] || "Business Owner";

  // Determine the profile link based on user roles
  let profileHref = "/dashboard/settings/profile";
  if (roleNames.includes("TENANT")) {
    profileHref = "/portal/profile";
  } else if (roleNames.includes("LANDLORD")) {
    profileHref = "/landlord/profile";
  } else if (roleNames.includes("PLATFORM_ADMIN")) {
    profileHref = "/admin/settings/profile";
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex h-10 items-center gap-2 rounded-lg px-2 hover:bg-[#F9FAFB] transition-all outline-none">
          <Avatar className="h-8 w-8 border-2 border-[#56A600]/20">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-[#56A600] text-white font-bold text-xs">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start text-left md:flex">
            <span className="text-[11px] font-black leading-none text-[#1F2937] uppercase tracking-tight">
              {user?.name || "User"}
            </span>
            <span className="mt-1 text-[10px] font-bold text-[#667085]">
              {primaryRole === "MANAGER" ? "Business Owner" : primaryRole}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl shadow-2xl border-[#DCE3EA] bg-white p-2" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black text-[#1F2937]">{user?.name}</p>
            <p className="text-[11px] text-[#667085] font-bold">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#F2F4F7] my-1" />
        <div className="space-y-1">
          <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-bold text-[11px] py-3 px-4 focus:bg-[#F9FAFB] focus:text-[#56A600] uppercase tracking-wide">
             <Link href={profileHref}>Profile Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleLogout}
            className="rounded-lg cursor-pointer font-bold text-[11px] py-3 px-4 text-rose-500 focus:text-rose-600 focus:bg-rose-50 uppercase tracking-wide"
          >
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
