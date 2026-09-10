import { getSuperAdminProfile } from "@/features/admin-profile/actions/admin-profile-actions";
import { PasswordForm } from "../components/password-form";
import { MfaToggle } from "../components/mfa-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, ShieldCheck, Key, AlertTriangle } from "lucide-react";

export default async function SecuritySettingsPage() {
  const profile = await getSuperAdminProfile();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3 text-slate-900 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black">Change Password</CardTitle>
            </div>
            <CardDescription className="font-medium text-slate-500">Update your account password. We recommend using a strong, unique password.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <PasswordForm />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3 text-slate-900 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-black">Multi-Factor Authentication</CardTitle>
            </div>
            <CardDescription className="font-medium text-slate-500">Add an extra layer of security to your Super Admin account.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Key className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-900">Authenticator App</p>
                    <p className="text-xs font-bold text-slate-500">Use an app like Google Authenticator or 1Password to generate verification codes.</p>
                  </div>
               </div>
            </div>
            <MfaToggle enabled={profile.mfaEnabled} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm border-amber-100 bg-amber-50/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-900">Security Requirement</h4>
              <p className="text-sm font-medium text-slate-600">As a Super Admin, your account has access to global platform data. Changes to sensitive security settings will be recorded in the system audit logs.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
