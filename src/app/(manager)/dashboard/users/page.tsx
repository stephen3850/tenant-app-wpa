import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { userRepository } from "@/features/access/repositories/user-repository";
import { UserList } from "@/features/access/components/user-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlusIcon, UsersIcon, ShieldCheckIcon, BuildingIcon, CheckSquareIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const users = await userRepository.findMany(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users & Access</h2>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <UserPlusIcon className="mr-2 h-4 w-4" /> Invite User
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard title="User Directory" count={users.length} href="/dashboard/users/directory" icon={UsersIcon} />
        <QuickLinkCard title="Roles" count={5} href="/dashboard/access/roles" icon={ShieldCheckIcon} />
        <QuickLinkCard title="Departments" count={3} href="/dashboard/access/departments" icon={BuildingIcon} />
        <QuickLinkCard title="Approval Center" count={2} href="/dashboard/access/approvals" icon={CheckSquareIcon} />
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium mb-4">Recent Users</h3>
        <UserList users={users as any} />
      </div>
    </div>
  );
}

function QuickLinkCard({ title, count, href, icon: Icon }: any) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <Link href={href}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
        </CardContent>
      </Link>
    </Card>
  );
}
