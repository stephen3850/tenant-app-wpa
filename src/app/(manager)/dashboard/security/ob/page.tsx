import { auth } from "@/auth";
import { securityRepository } from "@/features/security/repositories/security-repository";
import { OBList } from "@/features/security/components/ob-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, ShieldAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OBPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const incidents = await securityRepository.findIncidents(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-6 w-6 text-destructive" />
            <h2 className="text-3xl font-bold tracking-tight">Occurrence Book (OB)</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/security/ob/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New OB Entry
          </Link>
        </Button>
      </div>
      <OBList incidents={incidents as any} />
    </div>
  );
}
