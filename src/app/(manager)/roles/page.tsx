import { Metadata } from "next";
import { Plus, UserPlus, FileDown, History, Shield, Users, Key, Activity, MoreHorizontal, Edit, Eye, Copy, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Roles & Access Control | TMS",
  description: "Manage staff permissions and access levels.",
};

export default async function RolesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  // Fetch Roles
  const rolesData = await db.role.findMany({
    include: {
      _count: {
        select: { userRoles: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const roles = serialize(rolesData);

  // Fetch Counts
  const [totalUsers, pendingInvites] = await Promise.all([
    db.user.count({ where: { status: 'ACTIVE' } }),
    db.user.count({ where: { status: 'INVITED' } }),
  ]);

  const kpis = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      description: "Active staff members",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Roles",
      value: roles.length.toString(),
      description: "System & Custom roles",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Pending Invitations",
      value: pendingInvites.toString(),
      description: "Awaiting acceptance",
      icon: UserPlus,
      color: "text-orange-600",
    },
    {
      title: "Security Alerts",
      value: "0",
      description: "Last 24 hours",
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Access Control</h1>
          <p className="text-muted-foreground">
            Manage staff permissions, access levels, and operational security across your organization.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Audit Log
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Roles</CardTitle>
          <CardDescription>
            A list of all roles defined within your organization and their primary permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Users Assigned</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role._count?.userRoles || 0}</TableCell>
                    <TableCell>{format(new Date(role.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
