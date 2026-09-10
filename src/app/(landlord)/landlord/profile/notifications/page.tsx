import { getLandlordProfile } from "@/actions/landlord-profile";
import { NotificationForm } from "./notification-form";
import { Separator } from "@/components/ui/separator";

export default async function NotificationsPage() {
  const profile = await getLandlordProfile();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Notification Preferences</h3>
        <p className="text-sm font-medium text-slate-500">
          Control how and when you receive alerts from the platform.
        </p>
      </div>
      <Separator className="bg-slate-100" />
      <NotificationForm preferences={profile.notificationPreferences || {}} />
    </div>
  );
}
