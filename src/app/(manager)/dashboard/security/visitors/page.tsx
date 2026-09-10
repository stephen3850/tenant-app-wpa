import { auth } from "@/auth";
import { securityRepository } from "@/features/security/repositories/security-repository";
import { VisitorRegister } from "@/features/security/components/visitor-register";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlusIcon, UsersIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function VisitorsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const visitors = await securityRepository.findVisitors(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <UsersIcon className="h-6 w-6" />
            <h2 className="text-3xl font-bold tracking-tight">Visitor Register</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/security/visitors/new">
            <UserPlusIcon className="mr-2 h-4 w-4" /> Check-in Visitor
          </Link>
        </Button>
      </div>
      <VisitorRegister visitors={visitors as any} />
    </div>
  );
}
