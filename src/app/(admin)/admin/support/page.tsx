import { getSupportDashboard, getSupportCases } from "@/actions/support-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LifeBuoy,
  AlertCircle,
  Timer,
  Users,
  CheckCircle2,
  ExternalLink,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SupportDashboardPage() {
  const stats = await getSupportDashboard();
  const { cases } = await getSupportCases({ take: 5 });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Command Center</h1>
        <p className="text-slate-500 font-medium">Platform-wide support oversight and impersonation control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
            title="Open Cases"
            value={stats.openCases.toString()}
            icon={<LifeBuoy className="w-5 h-5" />}
            description="Active support tickets"
        />
        <StatCard
            title="Escalated"
            value={stats.escalatedCases.toString()}
            icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
            description="Priority attention required"
        />
        <StatCard
            title="Avg. Resolution"
            value={`${stats.avgResolutionTime}h`}
            icon={<Timer className="w-5 h-5" />}
            description="Last 30 days"
        />
        <StatCard
            title="Impersonations"
            value={stats.activeSessions.toString()}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            description="Active support sessions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold">Recent Support Cases</CardTitle>
                        <CardDescription>Latest platform-level support requests.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild className="font-bold border-slate-200">
                        <Link href="/admin/support/cases">View All Cases</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="font-bold text-slate-700">Case</TableHead>
                                <TableHead className="font-bold text-slate-700">Requester</TableHead>
                                <TableHead className="font-bold text-slate-700">Priority</TableHead>
                                <TableHead className="font-bold text-slate-700">Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cases.map((c: any) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">#{c.caseNumber}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{c.subject}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-bold text-slate-700">{c.requester.name}</div>
                                        <div className="text-xs text-slate-400">{c.organization.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <PriorityBadge priority={c.priority} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={c.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/support/cases/${c.id}`}>
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white">
                    <CardTitle className="text-lg font-bold">Impersonation Quick Start</CardTitle>
                    <CardDescription className="text-slate-400">Launch a secure support session.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search user by email or ID..." className="pl-10 border-slate-200 bg-slate-50/50" />
                    </div>
                    <p className="text-xs text-slate-500 italic">
                        Impersonation sessions are valid for 1 hour and are recorded in the global security audit.
                    </p>
                    <Button className="w-full bg-slate-900 text-white font-bold">
                        Start Session
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Support Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <HealthMetric title="SLA Compliance" value="94.2%" trend="+2.1%" color="text-emerald-600" />
                    <HealthMetric title="CSAT Score" value="4.8/5.0" trend="Stable" color="text-blue-600" />
                    <HealthMetric title="Re-opened Rate" value="3.5%" trend="-0.4%" color="text-emerald-600" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <p className="text-xs text-slate-400 font-medium mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}

function HealthMetric({ title, value, trend, color }: any) {
    return (
        <div className="flex justify-between items-end border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</div>
                <div className={`text-xl font-black ${color}`}>{value}</div>
            </div>
            <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {trend}
            </div>
        </div>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: any = {
    URGENT: "bg-rose-100 text-rose-700 border-rose-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={`${styles[priority]} font-bold text-[10px]`}>
      {priority}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ESCALATED: "bg-rose-50 text-rose-700 border-rose-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    AWAITING_CUSTOMER: "bg-orange-50 text-orange-700 border-orange-200",
    RESOLVED: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={`${styles[status]} font-bold text-[10px]`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
