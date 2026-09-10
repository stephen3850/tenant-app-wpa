import { getLandlordProfile } from "@/actions/landlord-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ProfileOverviewPage() {
  const profile = await getLandlordProfile();

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-6 bg-white border rounded-xl shadow-sm">
        <Avatar className="h-24 w-24 border-4 border-slate-50">
          <AvatarImage src={profile.image || ""} />
          <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
            {profile.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
          <p className="text-slate-500 font-medium">{profile.email}</p>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold uppercase tracking-wider text-[10px]">
              {profile.status}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase tracking-wider text-[10px]">
              Landlord
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Landlord ID</span>
              <span className="text-sm font-mono font-medium text-slate-900">{profile.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Last Login</span>
              <span className="text-sm font-medium text-slate-900">
                {profile.lastLoginAt ? format(profile.lastLoginAt, "PPP p") : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Member Since</span>
              <span className="text-sm font-medium text-slate-900">{format(profile.createdAt, "PPP")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Language</span>
              <span className="text-sm font-medium text-slate-900">{profile.preferredLanguage || "English"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Asset Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-center">
             <div className="py-4">
                <p className="text-4xl font-black text-blue-600">{(profile as any)._count.ownedProperties}</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter mt-1">Managed Properties</p>
             </div>
             <p className="text-xs text-slate-400 font-medium italic">
               Access restricted to properties registered under your name.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
