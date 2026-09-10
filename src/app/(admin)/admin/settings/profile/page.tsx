import { getSuperAdminProfile } from "@/features/admin-profile/actions/admin-profile-actions";
import { ProfileForm } from "../components/profile-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, Calendar, ShieldCheck, User as UserIcon } from "lucide-react";

export default async function ProfilePage() {
  const profile = await getSuperAdminProfile();

  return (
    <div className="space-y-8">
      <Card className="border-2 shadow-sm overflow-hidden">
        <div className="h-32 bg-slate-900" />
        <CardContent className="relative pt-0 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={profile.image || ""} />
              <AvatarFallback className="text-3xl font-black bg-slate-100">{profile.name?.[0] || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900">{profile.name}</h2>
                <Badge className="bg-slate-900 font-black uppercase tracking-widest text-[10px]">Super Admin</Badge>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> {profile.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t pt-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-500">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</p>
                    <p className="font-black text-slate-900">{profile.status}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 text-slate-500">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member Since</p>
                    <p className="font-black text-slate-900">{formatDate(profile.createdAt)}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-500">
                  <UserIcon className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Super Admin ID</p>
                    <p className="font-mono text-sm font-black text-slate-900">#{profile.id.substring(profile.id.length - 8).toUpperCase()}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 text-slate-500">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</p>
                    <p className="font-black text-slate-900">{profile.phone || "Not set"}</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center">
               <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
               </div>
               <p className="text-lg font-black text-slate-900">MFA Protected</p>
               <p className="text-xs font-bold text-slate-500">Account secured with multi-factor authentication.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black">Edit Personal Information</CardTitle>
          <CardDescription className="font-medium text-slate-500">Update your name, contact details, and localization preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
