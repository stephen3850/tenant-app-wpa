import { getLandlordProfile } from "@/actions/landlord-profile";
import { CommunicationForm } from "./communication-form";
import { Separator } from "@/components/ui/separator";

export default async function PreferencesPage() {
  const profile = await getLandlordProfile();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Communication Preferences</h3>
        <p className="text-sm font-medium text-slate-500">
          Set your preferred contact methods and regional settings.
        </p>
      </div>
      <Separator className="bg-slate-100" />
      <CommunicationForm profile={profile} />
    </div>
  );
}
