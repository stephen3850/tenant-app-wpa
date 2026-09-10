import { getUser, getUserTimeline } from "@/actions/user-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  History,
  Lock,
  Unlock,
  Ban,
  LogOut,
  RefreshCw,
  Building2,
  Calendar,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserActionToolbar } from "@/components/admin/user-action-toolbar";

export default async function UserDetailsPage({ params }: any) {
  const { id } = await params;
  const user = await getUser(id);
  const timeline = await getUserTimeline(id);

  const toolbarUser = {
      id: user.id,
      name: user.name || "N/A",
      email: user.email,
      status: user.status,
      organizationName: user.organization?.name || "Platform"
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black">
                {user.name ? user.name[0] : user.email[0].toUpperCase()}
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name || "N/A"}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-bold bg-slate-50">{user.status}</Badge>
                    <span className="text-slate-400 font-medium">|</span>
                    <span className="text-slate-500 font-bold text-sm">{user.email}</span>
                </div>
            </div>
        </div>
        <UserActionToolbar user={toolbarUser} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
                    <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Security</TabsTrigger>
                    <TabsTrigger value="permissions" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Roles & Permissions</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Activity Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Identity Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Full Name" value={user.name} icon={<UserIcon className="w-4 h-4" />} />
                                <InfoRow label="Email" value={user.email} icon={<Mail className="w-4 h-4" />} />
                                <InfoRow label="Phone" value={user.phone || "N/A"} icon={<Phone className="w-4 h-4" />} />
                                <InfoRow label="Organization" value={user.organization?.name || "Platform"} icon={<Building2 className="w-4 h-4" />} />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Operational Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} icon={<Calendar className="w-4 h-4" />} />
                                <InfoRow label="Last Login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"} icon={<Activity className="w-4 h-4" />} />
                                <InfoRow label="Account Status" value={user.status} icon={<Shield className="w-4 h-4" />} />
                                <InfoRow label="Active Sessions" value={user.sessions.length.toString()} icon={<History className="w-4 h-4" />} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                     <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-rose-600">Administrative Security Controls</CardTitle>
                            <CardDescription>Destructive actions that affect user access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <SecurityAction
                                title="Reset Multi-Factor Authentication"
                                description="Clears the user's MFA settings. They will be required to set it up again upon next login."
                                actionLabel="Reset MFA"
                            />
                            <SecurityAction
                                title="Force Password Reset"
                                description="Invalidates the user's current password and sends a reset link."
                                actionLabel="Force Reset"
                            />
                            <SecurityAction
                                title="Unlock Account"
                                description="Clears failed login attempts and unlocks the user account."
                                actionLabel="Unlock"
                                disabled={user.status !== "LOCKED"}
                            />
                        </CardContent>
                     </Card>
                </TabsContent>

                <TabsContent value="permissions">
                    <div className="space-y-6">
                        {user.userRoles.map((ur: any) => (
                            <Card key={ur.role.id} className="shadow-sm border-slate-200">
                                <CardHeader className="bg-slate-50/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="font-black text-slate-900">{ur.role.name}</CardTitle>
                                            <CardDescription>{ur.role.description}</CardDescription>
                                        </div>
                                        <Badge className="bg-slate-900 text-white font-bold">Assigned</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {ur.role.permissions.map((rp: any) => (
                                            <div key={rp.permission.id} className="p-2 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 bg-slate-50">
                                                {rp.permission.action}:{rp.permission.subject}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="timeline">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="font-bold">Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {timeline.map((log: any) => (
                                    <div key={log.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                                            <div className="flex-1 w-px bg-slate-100 my-1" />
                                        </div>
                                        <div className="pb-6">
                                            <div className="font-bold text-slate-900 text-sm uppercase tracking-wider">{log.action.replace(/_/g, " ")}</div>
                                            <div className="text-xs text-slate-500 font-medium">{new Date(log.createdAt).toLocaleString()}</div>
                                            {log.newData && (
                                                <div className="mt-2 p-2 bg-slate-50 rounded text-xs font-mono border border-slate-100 max-w-md overflow-x-auto">
                                                    {JSON.stringify(log.newData)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

        <div className="space-y-8">
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase">Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {user.sessions.map((session: any) => (
                        <div key={session.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <div className="font-bold text-slate-900">{session.ipAddress || "Unknown IP"}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{session.userAgent}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Last Active</div>
                                <div className="font-medium text-slate-700">{new Date(session.lastActiveAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                    {user.sessions.length === 0 && (
                        <div className="text-center py-4 text-slate-400 font-medium italic">No active sessions</div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase">Login History (Failure/Lock)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {user.loginHistory.map((login: any) => (
                        <div key={login.id} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${login.status === "SUCCESS" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            <div className="flex-1">
                                <div className="text-sm font-bold text-slate-800">{login.status}</div>
                                <div className="text-[10px] text-slate-500 font-medium">{new Date(login.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: any) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</div>
                <div className="text-sm font-bold text-slate-900 leading-none">{value || "N/A"}</div>
            </div>
        </div>
    );
}

function SecurityAction({ title, description, actionLabel, disabled }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="max-w-[70%]">
                <div className="text-sm font-black text-slate-900">{title}</div>
                <div className="text-xs text-slate-500 font-medium leading-relaxed">{description}</div>
            </div>
            <Button variant="outline" size="sm" className="font-bold border-rose-200 text-rose-600 hover:bg-rose-50" disabled={disabled}>
                {actionLabel}
            </Button>
        </div>
    );
}
