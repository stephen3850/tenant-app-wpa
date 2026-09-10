"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, UserIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ProfileHeader({ user }: { user: any }) {
  const tenant = user.tenantProfile;

  return (
    <Card className="overflow-hidden border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center gap-8 py-8 px-4">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={user.image || tenant?.profilePhoto} />
              <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 border-2 border-white"
            >
              <CameraIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-extrabold text-slate-900">{user.name}</h2>
                <Badge variant="success" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 uppercase font-bold tracking-wider text-[10px]">
                   {tenant?.status || "ACTIVE"}
                </Badge>
             </div>

             <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-500 font-medium text-sm">
                <div className="flex items-center gap-2">
                   <MailIcon className="h-4 w-4 text-blue-500" />
                   {user.email}
                </div>
                <div className="flex items-center gap-2">
                   <PhoneIcon className="h-4 w-4 text-emerald-500" />
                   {user.phone || tenant?.phone || "No phone linked"}
                </div>
                {tenant?.city && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-red-500" />
                    {tenant.city}, {tenant.county}
                  </div>
                )}
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenant ID</p>
                   <p className="text-sm font-bold text-slate-700">#{tenant?.tenantCode || "N/A"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Move-In Date</p>
                   <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-blue-400" />
                      {tenant?.moveInDate ? formatDate(tenant.moveInDate) : "Not set"}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Language</p>
                   <p className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                      {user.preferredLanguage || "English"}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timezone</p>
                   <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                      {user.preferredTimeZone || "UTC"}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
