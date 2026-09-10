"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeftIcon,
    ExternalLinkIcon,
    GlobeIcon,
    MailIcon,
    PhoneIcon,
    BuildingIcon
} from "lucide-react";
import Link from "next/link";

export function OrganizationHeader({ org }: { org: any }) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-12 w-12 hover:bg-white shadow-sm"
        >
            <ChevronLeftIcon className="h-6 w-6 text-slate-600" />
        </Button>
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border shadow-md">
                <AvatarImage src={org.logo || ""} />
                <AvatarFallback className="bg-slate-100 text-slate-500 text-xl font-bold">
                    {org.name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{org.name}</h1>
                    <Badge
                        className={`font-black text-[10px] uppercase tracking-widest border-none ${
                            org.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {org.status}
                    </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <GlobeIcon className="h-3.5 w-3.5 text-slate-400" />
                        {org.slug}.tms.com
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                        {org.country}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MailIcon className="h-3.5 w-3.5 text-slate-400" />
                        {org.contactEmail || "No contact email"}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-slate-200">
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Visit Org
          </Button>
          <Button className="bg-slate-900 hover:bg-black text-white font-bold">
              Impersonate Admin
          </Button>
      </div>
    </div>
  );
}
