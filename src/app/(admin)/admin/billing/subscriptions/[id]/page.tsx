import { getSubscription } from "@/actions/subscription-billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
    ChevronLeftIcon,
    CreditCardIcon,
    HistoryIcon,
    ShieldAlertIcon,
    ArrowUpCircleIcon,
    ArrowDownCircleIcon,
    PauseCircleIcon,
    PlayCircleIcon
} from "lucide-react";
import Link from "next/link";

export default async function SubscriptionDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const sub = await getSubscription(id);

  if (!sub) return <div>Subscription not found</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/billing/subscriptions">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Subscription Record</h1>
          <p className="text-slate-500 font-medium">Managing billing for {sub.organization.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-slate-50">
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Current Plan</p>
                                <p className="text-xl font-black text-blue-600 uppercase">{sub.plan.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Billing Cycle</p>
                                <p className="text-sm font-bold text-slate-900 capitalize">{sub.plan.interval}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Renewal Amount</p>
                                <p className="text-lg font-black text-slate-900">${Number(sub.plan.price).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Status</p>
                                <Badge className="font-black text-[10px] uppercase tracking-widest bg-green-100 text-green-700 border-none">
                                    {sub.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Period Start</p>
                                <p className="text-sm font-bold text-slate-900">{format(new Date(sub.startDate), "MMMM d, yyyy")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Next Billing Date</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {sub.endDate ? format(new Date(sub.endDate), "MMMM d, yyyy") : "Continuous"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Feature Limits</CardTitle>
                    <Badge variant="outline" className="font-bold">Real-time Usage</Badge>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-slate-500">Unit Limit</span>
                            <span className="text-slate-900">45 / {(sub.plan.features as any)?.maxUnits || 100}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[45%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-slate-500">User Limit</span>
                            <span className="text-slate-900">3 / {(sub.plan.features as any)?.maxUsers || 5}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-600 h-full w-[60%]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
                <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Controls</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold justify-start">
                        <ArrowUpCircleIcon className="mr-2 h-4 w-4" /> Upgrade Plan
                    </Button>
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white font-bold justify-start">
                        <ArrowDownCircleIcon className="mr-2 h-4 w-4" /> Downgrade Plan
                    </Button>
                    <Separator className="bg-slate-800 my-2" />
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white font-bold justify-start">
                        <PauseCircleIcon className="mr-2 h-4 w-4" /> Suspend Billing
                    </Button>
                    <Button variant="ghost" className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10 font-bold justify-start">
                        <ShieldAlertIcon className="mr-2 h-4 w-4" /> Cancel Subscription
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="border-b border-slate-50">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Billing Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-xs font-medium text-slate-500 italic">No administrative notes recorded for this subscription.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
