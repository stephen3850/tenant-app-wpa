import { getOrganization, getCustomerSuccessInsights, getOrganizationTimeline } from "@/actions/organization-management";
import { OrganizationHeader } from "./components/organization-header";
import { OrganizationStats } from "./components/organization-stats";
import { SuccessInsights } from "./components/success-insights";
import { OrganizationTimeline } from "./components/organization-timeline";
import { FinancialOverview } from "./components/financial-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LayoutDashboardIcon,
    BarChart3Icon,
    HistoryIcon,
    CreditCardIcon,
    ShieldAlertIcon,
    Settings2Icon
} from "lucide-react";

export default async function OrganizationDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const org = await getOrganization(id);
  const successInsights = await getCustomerSuccessInsights(id);
  const timeline = await getOrganizationTimeline(id);

  if (!org) return <div>Organization not found</div>;

  return (
    <div className="space-y-8 pb-12">
      <OrganizationHeader org={org} />

      <OrganizationStats org={org} />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2">
              <LayoutDashboardIcon className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" /> Success Insights
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2">
              <HistoryIcon className="h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2">
              <Settings2Icon className="h-4 w-4" /> Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <FinancialOverview org={org} />
                    <OrganizationTimeline timeline={timeline.slice(0, 5)} />
                </div>
                <div className="space-y-8">
                    <SuccessInsights insights={successInsights} />
                </div>
            </div>
        </TabsContent>

        <TabsContent value="insights">
            <SuccessInsights insights={successInsights} expanded />
        </TabsContent>

        <TabsContent value="billing">
            <FinancialOverview org={org} expanded />
        </TabsContent>

        <TabsContent value="timeline">
            <OrganizationTimeline timeline={timeline} />
        </TabsContent>

        <TabsContent value="settings">
            <div className="max-w-2xl bg-white p-8 rounded-3xl border shadow-sm space-y-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Platform Management</h3>
                    <p className="text-slate-500 font-medium">Lifecycle actions for this organization.</p>
                </div>

                <div className="space-y-4">
                    <div className="p-6 rounded-2xl border border-orange-100 bg-orange-50/50">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className="font-black text-orange-900 flex items-center gap-2">
                                    <ShieldAlertIcon className="h-4 w-4" /> Suspend Organization
                                </h4>
                                <p className="text-xs font-medium text-orange-700 max-w-sm">
                                    Prevent all users from this organization from accessing their dashboards. Existing data is preserved.
                                </p>
                            </div>
                            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100 font-bold">
                                Suspend Org
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className="font-black text-slate-900">Archive Organization</h4>
                                <p className="text-xs font-medium text-slate-500 max-w-sm">
                                    Mark the organization as historical. Data becomes read-only and is moved to cold storage.
                                </p>
                            </div>
                            <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-slate-100 font-bold">
                                Archive Org
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
