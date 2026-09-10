import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SecurityDashboard } from "@/features/security/components/security-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, ShieldIcon, UsersIcon, HistoryIcon, ClipboardListIcon } from "lucide-react";

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Security Command Center</h2>
        <div className="flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href="/dashboard/security/handovers/new">
                    <HistoryIcon className="mr-2 h-4 w-4" /> Shift Handover
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/security/ob/new">
                    <PlusIcon className="mr-2 h-4 w-4" /> Record OB Entry
                </Link>
            </Button>
        </div>
      </div>

      <SecurityDashboard organizationId={user.organizationId} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <Button asChild variant="ghost" className="h-24 flex-col gap-2 border-dashed border-2">
            <Link href="/dashboard/security/ob">
                <ShieldIcon className="h-6 w-6" />
                Occurrence Book
            </Link>
        </Button>
        <Button asChild variant="ghost" className="h-24 flex-col gap-2 border-dashed border-2">
            <Link href="/dashboard/security/visitors">
                <UsersIcon className="h-6 w-6" />
                Visitor Register
            </Link>
        </Button>
        <Button asChild variant="ghost" className="h-24 flex-col gap-2 border-dashed border-2">
            <Link href="/dashboard/security/patrols">
                <ClipboardListIcon className="h-6 w-6" />
                Patrol Logs
            </Link>
        </Button>
        <Button asChild variant="ghost" className="h-24 flex-col gap-2 border-dashed border-2">
            <Link href="/dashboard/security/handovers">
                <HistoryIcon className="h-6 w-6" />
                Shift Handovers
            </Link>
        </Button>
      </div>
    </div>
  );
}
