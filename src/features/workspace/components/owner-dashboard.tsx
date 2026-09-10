"use client";

import { useEffect, useState } from "react";
import { getDashboardDataAction } from "../actions/workspace-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
  Building2,
  Home,
  Users,
  Plus,
  ArrowRight,
  Wallet,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Calculator,
  UserPlus,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Receipt,
  CreditCard,
  Building,
  Undo2,
  ShieldCheck,
  MoreVertical,
  Landmark,
  UserCog,
  Briefcase,
  Layers,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function OwnerDashboard({ permissions }: { permissions: string[] }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardDataAction();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

  if (data.stats.propertyCount === 0 || data.stats.unitCount === 0 || data.stats.tenantCount === 0) {
    return <FoundationDashboard data={data} />;
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const chartData = [
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
  ];

  const pieData = [
    { name: 'Closed', value: data.stats.invoiceStatus.paid, color: '#12B76A' },
    { name: 'Pending', value: data.stats.invoiceStatus.pending, color: '#F79009' },
    { name: 'Cancelled', value: data.stats.invoiceStatus.cancelled, color: '#F04438' },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700 bg-[#F5F7FA]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SETUP STATUS SECTION */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#98A2B3] uppercase tracking-[0.2em]">SETUP STATUS</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-[#1F2937]">Set up your owner workspace</h2>
                    <span className="bg-[#F0FDF4] text-[#12B76A] px-2 py-0.5 rounded-full text-[10px] font-black border border-[#DCFCE7]">
                        {data.progress.percentage}%
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#667085] max-w-lg">
                    {data.progress.completedCount} of {data.progress.totalSteps} setup steps completed. Follow the next open step and the system will be ready for rent, deposits, and payments.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-10">
                        <span className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Progress</span>
                        <span className="text-[10px] font-black text-[#1F2937]">{data.progress.percentage}%</span>
                    </div>
                    <Progress value={data.progress.percentage} className="h-1.5 w-48 bg-[#F2F4F7]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.progress.steps.map((step: any) => (
                  <div key={step.id} className={cn(
                    "group relative p-3 rounded-xl border transition-all duration-300",
                    step.completed
                        ? "bg-[#F0FDF4]/40 border-[#DCFCE7]"
                        : "bg-white border-[#F2F4F7] hover:border-[#DCE3EA] hover:shadow-sm"
                  )}>
                    <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                            step.completed ? "bg-[#DCFCE7] text-[#12B76A]" : "bg-[#F9FAFB] text-[#98A2B3] group-hover:bg-[#F2F4F7] group-hover:text-[#667085]"
                        )}>
                            {step.completed ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                                <StepIcon iconName={step.icon} />
                            )}
                        </div>
                    </div>
                    <div className="space-y-0.5 pr-4">
                        <h4 className="text-[11px] font-black text-[#1F2937] leading-tight">{step.label}</h4>
                        <p className="text-[9px] font-medium text-[#667085] leading-normal line-clamp-2">{step.description}</p>
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-2">
                        <span className={cn(
                            "text-[9px] font-bold shrink-0",
                            step.completed ? "text-[#1F2937]" : "text-[#98A2B3]"
                        )}>
                            {step.completed ? "Ready" : "Setup needed"}
                        </span>
                        <Link href={step.href} className={cn(
                            "text-[9px] font-black transition-colors text-right",
                            step.completed ? "text-[#12B76A]" : "text-[#3B82F6] hover:underline"
                        )}>
                            {step.completed ? "Done" : step.action}
                        </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OWNER LAUNCHPAD SECTION */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-sm rounded-2xl bg-white h-full">
            <CardHeader className="p-6">
                <CardTitle className="text-sm font-black text-[#1F2937] uppercase tracking-wider">Owner launchpad</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
               {(() => {
                  const nextStep = data.progress.steps.find((s: any) => !s.completed) || data.progress.steps[0];
                  return (
                    <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7] space-y-3 mb-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-[#12B76A] uppercase tracking-widest">NEXT STEP</p>
                        <h4 className="text-sm font-black text-[#1F2937]">{nextStep.label}</h4>
                        <p className="text-[11px] font-medium text-[#667085]">{nextStep.description}</p>
                      </div>
                      <Button className="w-full bg-[#56A600] hover:bg-[#4a8e00] text-white font-black h-10 rounded-xl text-xs gap-2 shadow-lg shadow-[#56A600]/20" asChild>
                        <Link href={nextStep.href}>
                            <Zap className="h-3.5 w-3.5 fill-white" />
                            {nextStep.action}
                        </Link>
                      </Button>
                    </div>
                  );
               })()}

               {/* <Button variant="outline" className="w-full h-11 border-[#E5EAF0] text-[#12B76A] font-bold text-[11px] rounded-xl hover:bg-[#F0FDF4] border-dashed bg-[#F9FAFB]/50" asChild>
                  <Link href="/test-route">
                    <Plus className="h-3 w-3 mr-2" />
                    Create sample property, tenant, and invoice
                  </Link>
               </Button> */}

               <div className="space-y-2 pt-2">
                  <LaunchpadRow icon={Building2} label="Properties" desc="Add or review property records" href="/properties" />
                  <LaunchpadRow icon={Home} label="Units" desc="Set rent, status, and floor plans" href="/units" />
                  <LaunchpadRow icon={Users} label="Tenants" desc="Create tenant and lease records" href="/tenants" />
                  <LaunchpadRow icon={CreditCard} label="Record payment" desc="Post rent or deposit received" href="/payments" />
                  <LaunchpadRow icon={FileText} label="Invoices" desc="Review and generate bills" href="/invoices" />
                  <LaunchpadRow icon={Zap} label="Electricity" desc="Readings, bills, payments, and balances" href="/dashboard/utilities/readings" />
                  <LaunchpadRow icon={BarChart3} label="Reports" desc="Open collections and occupancy reports" href="/reports" />
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Properties */}
        <StatWidget
          icon={Building}
          label="TOTAL PROPERTIES"
          value={data.stats.propertyCount}
          subtext="Active now"
          actionLabel="View"
          actionHref="/properties"
        />

        {/* Units */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                  <Home className="h-4 w-4" />
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-2.5" asChild>
                  <Link href="/units">View</Link>
              </Button>
           </div>
           <div className="space-y-0.5 mb-3">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">TOTAL UNITS</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums">{data.stats.unitCount}</h3>
           </div>
           <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold">
                 <span className="text-[#667085] uppercase tracking-tight">OCCUPANCY</span>
                 <span className="text-[#1F2937]">{data.stats.occupiedUnits}/{data.stats.unitCount} units</span>
              </div>
              <div className="flex items-center gap-2">
                 <h4 className="text-base font-black text-[#1F2937]">{data.stats.occupancyRate}.0%</h4>
                 <div className="flex-1 h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#12B76A] rounded-full" style={{ width: `${data.stats.occupancyRate}%` }} />
                 </div>
              </div>
           </div>
        </Card>

        {/* Tenants */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0086C9]">
                  <Users className="h-4 w-4" />
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-2.5" asChild>
                  <Link href="/tenants">View</Link>
              </Button>
           </div>
           <div className="space-y-0.5 mb-4">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">TOTAL TENANTS</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums">{data.stats.tenantCount}</h3>
           </div>
           <div className="flex flex-wrap gap-1.5">
              <BadgeBox label="Green" count={data.stats.tenantStatus.active} color="bg-[#F0FDF4] text-[#12B76A] border-[#DCFCE7]" />
              <BadgeBox label="Red" count={data.stats.tenantStatus.blacklisted} color="bg-[#FEF2F2] text-[#D92D20] border-[#FEE2E2]" />
              <BadgeBox label="Inactive" count={data.stats.tenantStatus.former} color="bg-[#F9FAFB] text-[#667085] border-[#F2F4F7]" />
           </div>
        </Card>

        {/* Rent Invoices */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                  <TrendingUp className="h-4 w-4" />
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-2.5" asChild>
                  <Link href="/invoices">View</Link>
              </Button>
           </div>
           <div className="space-y-0.5 mb-3">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">RENT INVOICES</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums tracking-tighter">KES {data.stats.expectedRevenue.toLocaleString()}</h3>
              <p className="text-[9px] font-medium text-[#667085]">This month (gross billed).</p>
           </div>
           <div className="space-y-2 pt-2 border-t border-[#F2F4F7]">
              <div className="flex justify-between text-[10px] font-bold">
                 <span className="text-[#667085]">Fresh rent billed</span>
                 <span className="text-[#1F2937]">KES {data.stats.expectedRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                 <span className="text-[#667085]">Statement opening balance</span>
                 <span className="text-[#1F2937]">KES 0.00</span>
              </div>
           </div>
        </Card>

        {/* Collected */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                  <Wallet className="h-4 w-4" />
              </div>
           </div>
           <div className="space-y-0.5 mb-3">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">COLLECTED</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums tracking-tighter">KES {data.stats.collectionsThisMonth.toLocaleString()}</h3>
              <p className="text-[9px] font-medium text-[#667085]">This month</p>
           </div>
           <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-bold">
                    <thead>
                        <tr className="text-[#98A2B3] border-b border-[#F2F4F7]">
                            <th className="text-left pb-1 uppercase tracking-wider font-black text-[8px]">Type</th>
                            <th className="text-right pb-1 uppercase tracking-wider font-black text-[8px]">Payments</th>
                            <th className="text-right pb-1 uppercase tracking-wider font-black text-[8px]">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F9FAFB]">
                        <CollectionRow label="Rent" count={0} amount={data.stats.daily.rent} color="text-[#12B76A]" />
                        <CollectionRow label="Deposit" count={0} amount={0} color="text-[#12B76A]" />
                        <CollectionRow label="Other" count={0} amount={0} color="text-[#12B76A]" />
                        <CollectionRow label="Unallocated" count={0} amount={0} color="text-[#12B76A]" />
                    </tbody>
                </table>
           </div>
        </Card>

        {/* Outstanding Exposure */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                  <Calculator className="h-4 w-4" />
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-2.5" asChild>
                  <Link href="/collections">View</Link>
              </Button>
           </div>
           <div className="space-y-0.5 mb-3">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">OUTSTANDING EXPOSURE</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums tracking-tighter">KES {data.stats.outstandingBalance.toLocaleString()}</h3>
              <p className="text-[9px] font-medium text-[#667085]">Live tenant statement balances currently above zero.</p>
           </div>
           <div className="space-y-3">
                <div className="bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#DCFCE7] w-fit">
                    <span className="text-[9px] font-bold text-[#12B76A]">Prepaid / credit: <span className="font-black">KES {data.stats.totalCredit.toLocaleString()}</span></span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#667085]">
                    <span>{data.stats.outstandingBalance > 0 ? data.stats.invoiceStatus.pending : 0} owing tenant(s)</span>
                    <span>0 credit tenant(s)</span>
                </div>
           </div>
        </Card>

        {/* Refunds */}
        <StatWidget
          icon={Undo2}
          label="REFUNDS"
          value={`KES ${data.stats.totalRefunds.toLocaleString()}`}
          subtext="This month"
          actionLabel="View"
          actionHref="/payments"
        />

        {/* Total Expenses */}
        <StatWidget
          icon={Receipt}
          label="TOTAL EXPENSES"
          value={`KES ${data.stats.expenses.toLocaleString()}`}
          subtext="This month"
          actionLabel="View"
          actionHref="/expenses"
        />

        {/* Utilities Invoices */}
        <StatWidget
          icon={Zap}
          label="UTILITIES INVOICES"
          value={`KES ${data.stats.utilityBilled.toLocaleString()}`}
          subtext="This month (billed utilities & non-rent)."
        />

        {/* Electricity Dashboard */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-6 lg:col-span-1">
           <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F79009]">
                  <Zap className="h-5 w-5" />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-3" asChild>
                  <Link href="/dashboard/utilities/readings">Open</Link>
              </Button>
           </div>
           <div className="space-y-1 mb-4">
              <p className="text-[10px] font-black text-[#98A2B3] uppercase tracking-widest">ELECTRICITY DASHBOARD</p>
              <h3 className="text-2xl font-black text-[#1F2937] tabular-nums tracking-tighter">KES 0.00</h3>
              <p className="text-[10px] font-medium text-[#667085]">July 2026 balance</p>
           </div>
           <div className="space-y-2.5 pt-2 border-t border-[#F2F4F7]">
                <RowItem label="Monthly readings" value="0" />
                <RowItem label="Units used" value="0.00" />
                <RowItem label="Billed" value="KES 0.00" />
                <RowItem label="Paid" value="KES 0.00" />
           </div>
        </Card>
      </div>

      {/* TENANT MOVEMENT & CHARTS SECTION */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-[#1F2937]">Tenant movement</h3>
                        <p className="text-[11px] font-medium text-[#98A2B3]">This month ({new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString()} - {new Date().toLocaleDateString()})</p>
                    </div>
                    <Button variant="outline" className="h-8 text-[11px] font-black border-[#E5EAF0] text-[#3B82F6] rounded-lg px-4" asChild>
                        <Link href="/reports">View report</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MovementStat label="NEW TENANTS" value={data.stats.movement.new} sub="Created in period" />
                    <MovementStat label="VACATED" value={data.stats.movement.vacated} sub="Exited in period" />
                    <MovementStat label="PENDING MOVE-OUT" value={data.stats.movement.pendingMoveOut} sub="Currently flagged" />
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-none shadow-sm rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h3 className="text-[11px] font-black text-[#12B76A] uppercase tracking-widest">RENT COLLECTION TREND</h3>
                        <p className="text-[11px] font-medium text-[#667085]">Last 6 months</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#12B76A]" />
                        <span className="text-[11px] font-bold text-[#667085]">Collected</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.stats.trend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#667085' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#667085' }}
                                tickFormatter={(val) => val === 0 ? '0' : val.toLocaleString()}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#12B76A"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#12B76A', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="lg:col-span-4 space-y-6">
                <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
                    <div className="space-y-1 mb-6">
                        <h3 className="text-xs font-black text-[#1F2937] tracking-tight">Payment Status</h3>
                        <p className="text-[11px] font-medium text-[#667085]">Invoices breakdown (This month)</p>
                    </div>
                    <div className="flex items-center gap-1 mb-8">
                        <p className="text-[11px] font-bold text-[#667085]">Total invoices:</p>
                        <span className="text-[11px] font-black text-[#1F2937]">{data.stats.invoiceStatus.paid + data.stats.invoiceStatus.pending + data.stats.invoiceStatus.cancelled}</span>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <div className="h-[120px] w-[120px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={55}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            <StatusRow label="Closed" value={data.stats.invoiceStatus.paid} color="bg-[#12B76A]" />
                            <StatusRow label="Pending" value={data.stats.invoiceStatus.pending} color="bg-[#F79009]" />
                            <StatusRow label="Cancelled" value={data.stats.invoiceStatus.cancelled} color="bg-[#F04438]" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#F2F4F7] space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-black text-[#1F2937] tracking-tight">Payments today</h4>
                            <span className="text-[10px] font-bold text-[#98A2B3]">{new Date().toISOString().split('T')[0]}</span>
                        </div>
                        <div className="space-y-2">
                            <DailyRow label="Daily rent collected" value={`KES ${data.stats.daily.rent.toLocaleString()}`} />
                            <DailyRow label="Daily deposit" value="KES 0.00" />
                            <DailyRow label="Other payments" value="KES 0.00" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        <RecentActivitiesSection activities={data.recentActivities} />
      </div>
    </div>
  );
}

function HealthRow({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#667085]">{label}</span>
            <div className="flex items-center gap-1.5">
                <div className={cn("h-1.5 w-1.5 rounded-full", color)} />
                <span className="text-[10px] font-black text-[#1F2937]">{status}</span>
            </div>
        </div>
    )
}

function StepIcon({ iconName }: { iconName: string }) {
    switch (iconName) {
        case "Business": return <UserCog className="h-4 w-4" />;
        case "Bank": return <Landmark className="h-4 w-4" />;
        case "Property": return <Building2 className="h-4 w-4" />;
        case "Unit": return <Home className="h-4 w-4" />;
        case "Wallet": return <Wallet className="h-4 w-4" />;
        case "Tenant": return <Users className="h-4 w-4" />;
        case "Lease": return <FileText className="h-4 w-4" />;
        case "Invoice": return <Receipt className="h-4 w-4" />;
        case "Payment": return <CreditCard className="h-4 w-4" />;
        default: return <Home className="h-4 w-4" />;
    }
}

function StatWidget({ icon: Icon, label, value, subtext, actionLabel, actionHref }: any) {
    return (
        <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
           <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                  <Icon className="h-4 w-4" />
              </div>
              {actionLabel && (
                  <Button variant="outline" size="sm" className="h-6 text-[9px] font-bold border-[#E5EAF0] text-[#3B82F6] rounded-full px-2.5" asChild>
                    <Link href={actionHref || "#"}>{actionLabel}</Link>
                  </Button>
              )}
           </div>
           <div className="space-y-0.5">
              <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">{label}</p>
              <h3 className="text-xl font-black text-[#1F2937] tabular-nums tracking-tighter">{value}</h3>
              <p className="text-[9px] font-medium text-[#667085]">{subtext}</p>
           </div>
        </Card>
    )
}

function LaunchpadRow({ icon: Icon, label, desc, href }: any) {
    return (
        <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] transition-colors group">
            <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#12B76A] group-hover:bg-[#12B76A] group-hover:text-white transition-all">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
                <h4 className="text-[11px] font-black text-[#1F2937] tracking-tight">{label}</h4>
                <p className="text-[10px] font-medium text-[#667085] truncate">{desc}</p>
            </div>
        </Link>
    )
}

function BadgeBox({ label, count, color }: any) {
    return (
        <div className={cn("px-2.5 py-1 rounded-lg border text-[10px] font-black", color)}>
            {label}:{count}
        </div>
    )
}

function CollectionRow({ label, count, amount, color }: any) {
    return (
        <tr className="h-8 border-b border-[#F9FAFB] last:border-0">
            <td className={cn("font-black", color)}>{label}:</td>
            <td className="text-right text-[#1F2937]">{count}</td>
            <td className="text-right text-[#1F2937]">KES {amount.toLocaleString()}</td>
        </tr>
    )
}

function RowItem({ label, value }: any) {
    return (
        <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#667085]">{label}</span>
            <span className="text-[#1F2937]">{value}</span>
        </div>
    )
}

function MovementStat({ label, value, sub }: any) {
    return (
        <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#F2F4F7] space-y-2">
            <p className="text-[10px] font-black text-[#98A2B3] uppercase tracking-widest">{label}</p>
            <h4 className="text-3xl font-black text-[#1F2937] tabular-nums">{value}</h4>
            <p className="text-[10px] font-medium text-[#667085]">{sub}</p>
        </div>
    )
}

function StatusRow({ label, value, color }: any) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-black text-[#1F2937]">
                <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", color)} />
                    <span className="uppercase tracking-wider">{label}</span>
                </div>
                <span>{value}</span>
            </div>
            <div className="h-1.5 w-full bg-[#F2F4F7] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 10}%` }} />
            </div>
        </div>
    )
}

function DailyRow({ label, value }: any) {
    return (
        <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#667085]">{label}</span>
            <span className="text-[#1F2937] tracking-tight">{value}</span>
        </div>
    )
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-6 w-48 bg-[#E5EAF0] rounded" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
           <div className="h-64 bg-[#E5EAF0] rounded-xl" />
        </div>
        <div className="h-[500px] bg-[#E5EAF0] rounded-xl" />
      </div>
    </div>
  );
}

function FoundationDashboard({ data }: { data: any }) {
    const propertyCount = data.stats.propertyCount || 0;
    const unitCount = data.stats.unitCount || 0;
    const tenantCount = data.stats.tenantCount || 0;

    const completedFoundationSteps = [propertyCount > 0, unitCount > 0, tenantCount > 0].filter(Boolean).length;
    const foundationPercentage = Math.round((completedFoundationSteps / 3) * 100);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-700 bg-[#F5F7FA]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-[0.2em]">GETTING STARTED</p>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-black text-[#1F2937]">Set up your owner workspace</h2>
                                        <div className="h-8 w-8 rounded-full border-[3px] border-[#F2F4F7] flex items-center justify-center relative">
                                            <span className="text-[8px] font-black text-[#12B76A]">{foundationPercentage}%</span>
                                            <svg className="absolute -rotate-90 w-8 h-8">
                                                <circle
                                                    cx="16" cy="16" r="14.5"
                                                    fill="transparent"
                                                    stroke="#12B76A"
                                                    strokeWidth="3"
                                                    strokeDasharray={91}
                                                    strokeDashoffset={91 - (91 * foundationPercentage) / 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-medium text-[#667085]">
                                        {completedFoundationSteps} of 3 foundation steps completed.
                                    </p>
                                </div>
                                <div className="hidden md:flex flex-col items-end gap-1.5">
                                    <div className="flex items-center gap-10">
                                        <span className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Progress</span>
                                        <span className="text-[10px] font-black text-[#1F2937]">{foundationPercentage}%</span>
                                    </div>
                                    <Progress value={foundationPercentage} className="h-1 w-48 bg-[#F2F4F7]" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FoundationStepCard
                                    icon={Building2}
                                    label="Add property"
                                    desc="Create the first property profile."
                                    countLabel={`${propertyCount} Properties`}
                                    actionLabel={propertyCount > 0 ? "Done" : "Start here"}
                                    href="/properties"
                                    isCompleted={propertyCount > 0}
                                />
                                <FoundationStepCard
                                    icon={Home}
                                    label="Add unit"
                                    desc="Set up rent rates and unit names."
                                    countLabel={`${unitCount} Units`}
                                    actionLabel={propertyCount === 0 ? "Add property first" : (unitCount > 0 ? "Done" : "Start here")}
                                    href="/units"
                                    isCompleted={unitCount > 0}
                                    isDisabled={propertyCount === 0}
                                />
                                <FoundationStepCard
                                    icon={Users}
                                    label="Add tenant"
                                    desc="Attach a tenant to an occupied unit."
                                    countLabel={`${tenantCount} Tenants`}
                                    actionLabel={unitCount === 0 ? "Add unit first" : (tenantCount > 0 ? "Done" : "Start here")}
                                    href="/tenants"
                                    isCompleted={tenantCount > 0}
                                    isDisabled={unitCount === 0}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <Card className="border-none shadow-sm rounded-2xl bg-white h-full">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[11px] font-black text-[#1F2937] uppercase tracking-wider">Owner launchpad</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7] space-y-3">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-[#12B76A] uppercase tracking-widest">NEXT STEP</p>
                                    <h4 className="text-xs font-black text-[#1F2937]">Add property</h4>
                                    <p className="text-[10px] font-medium text-[#667085]">Create the first property profile.</p>
                                </div>
                                <Button className="w-full bg-[#56A600] hover:bg-[#4a8e00] text-white font-black h-10 rounded-xl text-[10px] gap-2 shadow-lg shadow-[#56A600]/20" asChild>
                                    <Link href="/properties">
                                        <Zap className="h-3.5 w-3.5 fill-white" />
                                        Start here
                                    </Link>
                                </Button>
                            </div>

                            <div className="space-y-1.5">
                                <LaunchpadRow icon={Building2} label="Properties" desc="Add or review property records" href="/properties" />
                                <LaunchpadRow icon={Home} label="Units" desc={propertyCount === 0 ? "Needs property" : "Set rent, status, and unit details"} href="/units" />
                                <LaunchpadRow icon={Users} label="Tenants" desc={unitCount === 0 ? "Needs unit" : "Create tenant and lease records"} href="/tenants" />
                                <LaunchpadRow icon={CreditCard} label="Record payment" desc={tenantCount === 0 ? "Needs tenant" : "Post rent or deposit received"} href="/payments" />
                                <LaunchpadRow icon={FileText} label="Invoices" desc={tenantCount === 0 ? "Needs tenant" : "Review and generate bills"} href="/invoices" />
                                <LaunchpadRow icon={BarChart3} label="Reports" desc={tenantCount === 0 ? "Needs tenant" : "Open collections and occupancy reports"} href="/reports" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Activities section on foundation dashboard */}
            <RecentActivitiesSection activities={data.recentActivities} />
        </div>
    )
}

function RecentActivitiesSection({ activities }: { activities: any[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardHeader className="p-6 pb-2 border-b border-[#F2F4F7]">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Recent activities</h3>
                            <p className="text-[10px] font-medium text-[#98A2B3]">Last system logs</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-[#3B82F6]" asChild>
                            <Link href="/logbook">View all logs</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-[#F9FAFB]">
                        {activities.length > 0 ? (
                            activities.map((activity: any, i: number) => (
                                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-[#F9FAFB]/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                                            <RefreshCw className="h-3 w-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-[#1F2937] capitalize">{activity.title}</p>
                                            <p className="text-[9px] font-medium text-[#667085]">{activity.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <p className="text-[9px] font-black text-[#1F2937]">{activity.user}</p>
                                        <p className="text-[8px] font-medium text-[#98A2B3]">
                                            {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-[11px] font-medium text-[#98A2B3]">No recent activities recorded</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
                <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
                    <div className="space-y-1 mb-6">
                        <h3 className="text-xs font-black text-[#1F2937] tracking-tight uppercase">System Health</h3>
                        <p className="text-[10px] font-medium text-[#667085]">Workspace status monitors</p>
                    </div>
                    <div className="space-y-4">
                        <HealthRow label="Database" status="Healthy" color="bg-[#12B76A]" />
                        <HealthRow label="Payment Gateway" status="Active" color="bg-[#12B76A]" />
                        <HealthRow label="SMS Service" status="Online" color="bg-[#12B76A]" />
                        <HealthRow label="Email Service" status="Online" color="bg-[#12B76A]" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function FoundationStepCard({ icon: Icon, label, desc, countLabel, actionLabel, href, isCompleted, isDisabled }: any) {
    return (
        <div className={cn(
            "p-5 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3",
            isCompleted ? "bg-[#F0FDF4]/40 border-[#DCFCE7]" : "bg-white border-[#F2F4F7]",
            isDisabled && "opacity-60 grayscale-[0.5]"
        )}>
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                isCompleted ? "bg-[#DCFCE7] text-[#12B76A]" : "bg-[#F9FAFB] text-[#98A2B3]"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
                <h4 className="text-xs font-black text-[#1F2937] tracking-tight">{label}</h4>
                <p className="text-[10px] font-medium text-[#667085] leading-relaxed px-1">{desc}</p>
            </div>
            <div className="w-full pt-3 flex items-center justify-between border-t border-[#F9FAFB]">
                <span className="text-[9px] font-bold text-[#98A2B3]">{countLabel}</span>
                <Link
                    href={isDisabled ? "#" : href}
                    className={cn(
                        "text-[9px] font-black transition-colors",
                        isCompleted ? "text-[#12B76A]" : "text-[#3B82F6] hover:underline",
                        isDisabled && "pointer-events-none text-[#98A2B3]"
                    )}
                >
                    {actionLabel}
                </Link>
            </div>
        </div>
    )
}
