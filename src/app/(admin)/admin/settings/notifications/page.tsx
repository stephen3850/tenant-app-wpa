import { getSuperAdminProfile } from "@/features/admin-profile/actions/admin-profile-actions";
import { NotificationForm } from "../components/notification-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Mail, Smartphone, Globe } from "lucide-react";

export default async function NotificationsPage() {
  const profile = await getSuperAdminProfile();

  return (
    <div className="space-y-8">
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3 text-slate-900 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Bell className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-black">Notification Preferences</CardTitle>
          </div>
          <CardDescription className="font-medium text-slate-500">Configure how and when you want to be notified about platform events.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationForm preferences={profile.notificationPreferences} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="font-black text-slate-900">Email Alerts</h4>
          <p className="text-xs font-bold text-slate-500 mt-2">Critical reports and system updates sent to your inbox.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <Smartphone className="h-5 w-5 text-emerald-600" />
          </div>
          <h4 className="font-black text-slate-900">SMS Alerts</h4>
          <p className="text-xs font-bold text-slate-500 mt-2">Instant notifications for urgent security incidents.</p>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
            <Globe className="h-5 w-5 text-slate-600" />
          </div>
          <h4 className="font-black text-slate-900">In-App</h4>
          <p className="text-xs font-bold text-slate-500 mt-2">Operational alerts shown within the Super Admin portal.</p>
        </div>
      </div>
    </div>
  );
}
