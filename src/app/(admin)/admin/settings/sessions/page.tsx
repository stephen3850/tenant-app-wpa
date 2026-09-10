import { getSuperAdminSessions } from "@/features/admin-profile/actions/admin-profile-actions";
import { SessionList } from "../components/session-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Smartphone, Globe, ShieldAlert } from "lucide-react";

export default async function SessionsPage() {
  const sessions = await getSuperAdminSessions();

  return (
    <div className="space-y-8">
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3 text-slate-900 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Monitor className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-black">Active Sessions</CardTitle>
          </div>
          <CardDescription className="font-medium text-slate-500">View and manage your active sessions across different devices and browsers.</CardDescription>
        </CardHeader>
        <CardContent>
          <SessionList sessions={sessions} />
        </CardContent>
      </Card>

      <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-rose-100 rounded-lg shrink-0">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-slate-900">Security Recommendation</h4>
          <p className="text-sm font-medium text-slate-600">If you see any unfamiliar devices or locations, revoke the session immediately and change your Super Admin password.</p>
        </div>
      </div>
    </div>
  );
}
