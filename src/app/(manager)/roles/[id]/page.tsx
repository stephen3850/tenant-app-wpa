import { Metadata } from "next";
import {
  ArrowLeft,
  Shield,
  Users,
  Key,
  History,
  Save,
  Check,
  X,
  Search,
  Settings,
  Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Role Details | TMS",
  description: "Manage role permissions and assigned users.",
};

export default async function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const roleData = await db.role.findUnique({
    where: { id: id },
    include: {
      userRoles: {
        include: {
          user: true
        }
      },
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });

  if (!roleData) notFound();

  const role = serialize(roleData);

  const modules = [
    "Dashboard", "Properties", "Units", "Landlords", "Tenants",
    "Leases", "Invoices", "Payments", "Receipts", "Maintenance",
    "Documents", "Reports", "Communications", "Tasks", "Settings",
    "Roles & Access", "Integrations"
  ];

  const permissionTypes = ["View", "Create", "Edit", "Delete", "Approve", "Export", "Manage"];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/roles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{role.name}</h1>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
          </div>
          <p className="text-muted-foreground">{role.description || "Manage permissions for this role."}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Duplicate</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-4">
          <TabsTrigger value="overview">
            <Info className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="mr-2 h-4 w-4" />
            Audit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>Basic details about this role.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Role Name</p>
                    <p className="text-sm font-semibold">{role.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="text-sm font-semibold text-blue-600">Custom Role</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                    <p className="text-sm font-semibold">{format(new Date(role.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{role.description || "No description provided."}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Summary</CardTitle>
                <CardDescription>Visual breakdown of module access.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Module Access</span>
                    <span className="text-sm font-medium">{role.permissions?.length || 0} Permissions</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[40%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Assigned Users</CardTitle>
                <CardDescription>Staff members currently assigned to the {role.name} role.</CardDescription>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Users className="mr-2 h-4 w-4" />
                Assign Users
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role.userRoles?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                        No users assigned to this role.
                      </TableCell>
                    </TableRow>
                  ) : (
                    role.userRoles?.map((ur: any) => (
                      <TableRow key={ur.user?.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{ur.user?.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{ur.user?.name}</span>
                              <span className="text-xs text-muted-foreground">{ur.user?.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{ur.user?.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                            {ur.user?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Permissions Matrix</CardTitle>
                  <CardDescription>Configure granular module access for this role.</CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter modules..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[200px]">Module</TableHead>
                      {permissionTypes.map((type) => (
                        <TableHead key={type} className="text-center">{type}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module}>
                        <TableCell className="font-medium">{module}</TableCell>
                        {permissionTypes.map((type) => {
                          const hasPermission = role.permissions?.some((p: any) =>
                            p.permission.subject === module && p.permission.action.toLowerCase() === type.toLowerCase()
                          );
                          return (
                            <TableCell key={`${module}-${type}`} className="text-center">
                              <div className="flex justify-center">
                                <Checkbox
                                  id={`${module}-${type}`}
                                  defaultChecked={hasPermission}
                                />
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>History of changes made to this role.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center text-muted-foreground italic text-sm">
                No audit logs found for this role.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
