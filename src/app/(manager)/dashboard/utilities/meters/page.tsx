import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { utilityRepository } from "@/features/utilities/repositories/utility-repository";
import { MeterList } from "@/features/utilities/components/meter-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";

export default async function MetersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const meters = await utilityRepository.findMeters(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/utilities">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Meter Management</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/utilities/meters/new">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Meter
          </Link>
        </Button>
      </div>

      <MeterList meters={meters as any} />
    </div>
  );
}
