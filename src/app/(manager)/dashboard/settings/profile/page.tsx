import { getManagerProfile } from "@/features/workspace/actions/profile-actions";
import { ProfileForm } from "./profile-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, Calendar, ShieldCheck, User as UserIcon, Building } from "lucide-react";

export default async function ProfilePage() {
  const profile = await getManagerProfile();

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      <Card className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
        <div className="h-32 bg-[#1E293B]" />
        <CardContent className="relative pt-0 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={profile.image || ""} />
              <AvatarFallback className="text-3xl font-black bg-slate-100">{profile.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">{profile.name}</h2>
                <Badge className="bg-[#12B76A] font-black uppercase tracking-widest text-[10px]">Business Owner</Badge>
              </div>
              <p className="text-[#667085] font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> {profile.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t pt-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#667085]">
                  <Building className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#98A2B3]">Organization</p>
                    <p className="font-black text-[#1F2937]">{profile.organization?.name || "No Organization"}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 text-[#667085]">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#98A2B3]">Member Since</p>
                    <p className="font-black text-[#1F2937]">{formatDate(profile.createdAt)}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#667085]">
                  <UserIcon className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#98A2B3]">User ID</p>
                    <p className="font-mono text-xs font-black text-[#1F2937]">#{profile.id.substring(profile.id.length - 8).toUpperCase()}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 text-[#667085]">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#98A2B3]">Phone Number</p>
                    <p className="font-black text-[#1F2937]">{profile.phone || "Not set"}</p>
                  </div>
               </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] flex flex-col justify-center items-center text-center">
               <div className="h-12 w-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center mb-3 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[#12B76A]" />
               </div>
               <p className="text-lg font-black text-[#1F2937]">Security Profile</p>
               <p className="text-xs font-bold text-[#667085]">Your account is currently active and secure.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-2xl bg-white">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-xl font-black text-[#1F2937]">Edit Personal Information</CardTitle>
          <CardDescription className="font-medium text-[#667085]">Update your name, contact details, and localization preferences.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
