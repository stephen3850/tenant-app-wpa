import { getSecurityDashboard, getSecurityAlerts } from "@/actions/security-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ShieldAlert,
  Lock,
  UserX,
  Users,
  Eye,
  AlertTriangle,
  Fingerprint,
  TrendingUp,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SecurityDashboardPage() {
  const stats = await getSecurityDashboard();
  const alerts = await getSecurityAlerts();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Center</h1>
          <p className="text-slate-500 font-medium">Global platform security oversight and threat detection.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="font-bold border-slate-200" asChild>
                <Link href="/admin/security/audit">Audit Logs</Link>
            </Button>
            <Button className="bg-rose-600 text-white font-bold hover:bg-rose-700" asChild>
                <Link href="/admin/security/incidents/new">New Incident</Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SecurityStat
            title="Failed Logins (24h)"
            value={stats.failedLogins.toString()}
            icon={<Lock className="w-5 h-5" />}
            trend="+12%"
            severity={stats.failedLogins > 50 ? "high" : "low"}
        />
        <SecurityStat
            title="Locked Accounts"
            value={stats.lockedAccounts.toString()}
            icon={<UserX className="w-5 h-5 text-rose-500" />}
            trend="+2"
            severity={stats.lockedAccounts > 5 ? "medium" : "low"}
        />
        <SecurityStat
            title="MFA Adoption"
            value={`${stats.mfaAdoptionRate}%`}
            icon={<Fingerprint className="w-5 h-5 text-emerald-500" />}
            trend="+1.2%"
            severity="info"
        />
        <SecurityStat
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
            trend="New"
            severity={stats.activeAlerts > 0 ? "high" : "low"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold">Recent Security Alerts</CardTitle>
                        <CardDescription>Automated detection of suspicious activities.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="font-bold text-blue-600">
                        <Link href="/admin/security/alerts">View All Alerts</Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed">
                            No active security alerts.
                        </div>
                    ) : (
                        alerts.map((alert: any) => (
                            <div key={alert.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                                <div className={`p-2 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">{alert.type.replace(/_/g, ' ')}</h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium mt-1">{alert.description}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="font-bold text-blue-600">Triage</Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Platform Activity Trend</CardTitle>
                    <CardDescription>Security events and audit volume over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-slate-50/50 rounded-b-xl border-t">
                    <span className="text-slate-400 font-bold">Security Trend Visualization (Recharts)</span>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="shadow-sm border-slate-200 overflow-hidden border-l-4 border-l-rose-600">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-rose-600 uppercase tracking-widest">Critical Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-slate-900">{stats.criticalIncidents}</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Requiring immediate investigation.</p>
                    <Button className="w-full mt-6 bg-slate-900 text-white font-bold" asChild>
                        <Link href="/admin/security/incidents?severity=CRITICAL">Open Incident Command</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Security Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <HealthRow title="Active Impersonations" value={stats.impersonationsToday.toString()} icon={<Users className="w-4 h-4" />} />
                    <HealthRow title="Suspicious Score" value={`${stats.suspiciousActivities.toFixed(1)}/10`} icon={<TrendingUp className="w-4 h-4" />} />
                    <HealthRow title="Audit Integrity" value="Verified" icon={<Activity className="w-4 h-4 text-emerald-500" />} />
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Compliance Exports</CardTitle>
                    <CardDescription className="text-slate-400">Generate SOC2/GDPR audit reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white font-bold hover:bg-white/20">GDPR Data Audit</Button>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white font-bold hover:bg-white/20">Monthly Security Review</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function SecurityStat({ title, value, icon, trend, severity }: any) {
    const severityColors: any = {
        high: "bg-rose-50 text-rose-700 border-rose-100",
        medium: "bg-orange-50 text-orange-700 border-orange-100",
        low: "bg-emerald-50 text-emerald-700 border-emerald-100",
        info: "bg-blue-50 text-blue-700 border-blue-100"
    };

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${severityColors[severity]}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">{trend} vs last period</span>
                </div>
            </CardContent>
        </Card>
    );
}

function HealthRow({ title, value, icon }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-50 rounded text-slate-400">
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-600">{title}</span>
            </div>
            <span className="text-sm font-black text-slate-900">{value}</span>
        </div>
    );
}

function getAlertSeverityColor(severity: string) {
    switch (severity) {
        case 'CRITICAL': return 'bg-rose-600 text-white';
        case 'HIGH': return 'bg-rose-100 text-rose-600';
        case 'MEDIUM': return 'bg-orange-100 text-orange-600';
        default: return 'bg-blue-100 text-blue-600';
    }
}
