import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantProfileService } from "@/features/tenant/services/tenant-profile-service";
import { ProfileHeader } from "@/features/tenant/components/profile-header";
import { PersonalInfoForm } from "@/features/tenant/components/personal-info-form";
import { SecuritySettings } from "@/features/tenant/components/security-settings";
import { NotificationPreferencesForm } from "@/features/tenant/components/notification-preferences-form";
import { SessionManagement } from "@/features/tenant/components/session-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, ShieldCheckIcon, BellRingIcon, MonitorIcon } from "lucide-react";

export default async function TenantProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await tenantProfileService.getTenantProfile(session.user.id);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-slate-500 font-medium">Manage your personal information, security preferences, and account activity.</p>
      </div>

      <ProfileHeader user={user} />

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl h-auto flex flex-wrap gap-1 border border-slate-200">
          <TabsTrigger value="personal" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
            <UserIcon className="h-4 w-4" /> Personal info
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
            <ShieldCheckIcon className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
            <BellRingIcon className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
            <MonitorIcon className="h-4 w-4" /> Active Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="animate-in fade-in-50 duration-500">
           <PersonalInfoForm user={user} />
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in-50 duration-500">
           <SecuritySettings user={user} />
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in-50 duration-500">
           <NotificationPreferencesForm user={user} />
        </TabsContent>

        <TabsContent value="sessions" className="animate-in fade-in-50 duration-500">
           <SessionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
