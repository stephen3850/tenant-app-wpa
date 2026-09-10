import { getLandlordProfile } from "@/actions/landlord-profile";
import { PasswordForm } from "./password-form";
import { MfaToggle } from "./mfa-toggle";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ShieldCheckIcon, ShieldAlertIcon } from "lucide-react";

export default async function SecurityPage() {
  const profile = await getLandlordProfile();

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">Security Settings</h3>
          <p className="text-sm font-medium text-slate-500">
            Secure your account with MFA and regular password updates.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
            <span className="text-[10px] font-black uppercase text-slate-500">Protection Status:</span>
            {profile.mfaEnabled ? (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600">
                    <ShieldCheckIcon className="h-3 w-3" /> Secure
                </span>
            ) : (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600">
                    <ShieldAlertIcon className="h-3 w-3" /> Vulnerable
                </span>
            )}
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div className="grid grid-cols-1 gap-8">
        <section>
          <div className="mb-4">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Multi-Factor Authentication</h4>
             <p className="text-xs font-medium text-slate-500 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <MfaToggle enabled={profile.mfaEnabled} />
        </section>

        <Separator className="bg-slate-100" />

        <section>
          <div className="mb-4">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Change Password</h4>
             <p className="text-xs font-medium text-slate-500 mt-1">
                Last changed: {(profile as any).passwordChangedAt ? format((profile as any).passwordChangedAt, "PPP") : "Never"}
             </p>
          </div>
          <Card className="border shadow-none bg-slate-50/30">
            <CardContent className="pt-6">
              <PasswordForm />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
