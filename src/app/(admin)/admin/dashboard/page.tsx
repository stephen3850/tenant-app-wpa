import { getPlatformDashboard } from "@/actions/platform-admin";
import { PlatformKPIs } from "./components/platform-kpis";
import { RevenueChart } from "./components/revenue-chart";
import { PlatformHealth } from "./components/platform-health";
import { RecentActivities } from "./components/recent-activities";
import { FeatureAdoption } from "./components/feature-adoption";
import { SecuritySummary } from "./components/security-summary";
import { SupportSummary } from "./components/support-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminDashboardPage() {
  const data = await getPlatformDashboard();

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Platform Command Center</h1>
        <p className="text-lg text-muted-foreground font-medium mt-1">Global SaaS metrics and operational oversight.</p>
      </div>

      <PlatformKPIs
        orgStats={data.orgStats}
        userStats={data.userStats}
        revenue={data.revenue}
      />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-xl border border-border w-fit h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Overview</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Revenue</TabsTrigger>
          <TabsTrigger value="health" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">System Health</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Security</TabsTrigger>
          <TabsTrigger value="adoption" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Adoption</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <RevenueChart revenue={data.revenue} />
                 <RecentActivities activities={data.activities} />
              </div>
              <div className="space-y-8">
                 <PlatformHealth health={data.health} />
                 <SecuritySummary security={data.security} />
                 <SupportSummary support={data.support} />
              </div>
           </div>
        </TabsContent>

        <TabsContent value="revenue">
           <RevenueChart revenue={data.revenue} expanded />
        </TabsContent>

        <TabsContent value="health">
           <PlatformHealth health={data.health} expanded />
        </TabsContent>

        <TabsContent value="security">
           <SecuritySummary security={data.security} expanded />
        </TabsContent>

        <TabsContent value="adoption">
           <FeatureAdoption adoption={data.adoption} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
