import { getLandlordProfile } from "@/actions/landlord-profile";
import { PersonalInfoForm } from "./personal-info-form";
import { Separator } from "@/components/ui/separator";

export default async function PersonalPage() {
  const profile = await getLandlordProfile();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
        <p className="text-sm font-medium text-slate-500">
          Update your contact details and mailing address.
        </p>
      </div>
      <Separator className="bg-slate-100" />
      <PersonalInfoForm profile={profile} />
    </div>
  );
}
