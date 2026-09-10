import { getLandlordSessions } from "@/actions/landlord-profile";
import { SessionList } from "./session-list";
import { Separator } from "@/components/ui/separator";

export default async function SessionsPage() {
  const sessions = await getLandlordSessions();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">Active Sessions</h3>
        <p className="text-sm font-medium text-slate-500">
          Manage the devices and browsers that are currently logged into your account.
        </p>
      </div>
      <Separator className="bg-slate-100" />
      <SessionList sessions={sessions} />
    </div>
  );
}
