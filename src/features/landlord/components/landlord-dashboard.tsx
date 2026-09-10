"use client";

import { LandlordWelcome } from "./landlord-welcome";
import { PortfolioSummary } from "./portfolio-summary";
import { FinancialCards } from "./financial-cards";
import { MaintenanceWidget } from "./maintenance-widget";
import { LeaseInsights } from "./lease-insights";
import { RecentActivities } from "./recent-activities";
import { CommunicationWidget } from "./communication-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboardIcon, BuildingIcon, WalletIcon, WrenchIcon, KeyIcon } from "lucide-react";

export function LandlordDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <LandlordWelcome name={data.landlordName} />

      <PortfolioSummary stats={data.portfolio} />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-xl h-auto flex flex-wrap gap-1 border border-border w-fit">
           <TabsTrigger value="overview" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
              <LayoutDashboardIcon className="h-4 w-4" /> Overview
           </TabsTrigger>
           <TabsTrigger value="financials" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
              <WalletIcon className="h-4 w-4" /> Financials
           </TabsTrigger>
           <TabsTrigger value="maintenance" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
              <WrenchIcon className="h-4 w-4" /> Maintenance
           </TabsTrigger>
           <TabsTrigger value="leases" className="rounded-lg py-2.5 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
              <KeyIcon className="h-4 w-4" /> Leases
           </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <FinancialCards financial={data.financial} />

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                 <RecentActivities recent={data.recent} />
              </div>
              <div className="space-y-8">
                 <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <BuildingIcon size={80} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Portfolio Insights</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Your portfolio is performing 4.2% better than the regional average this quarter.</p>
                 </div>
                 <CommunicationWidget communications={data.communications} />
                 <MaintenanceWidget maintenance={data.maintenance} />
                 <LeaseInsights leases={data.leases} />
              </div>
           </div>
        </TabsContent>

        <TabsContent value="financials">
           <FinancialCards financial={data.financial} />
           {/* Detailed financial view could be added here */}
        </TabsContent>

        <TabsContent value="maintenance">
           <MaintenanceWidget maintenance={data.maintenance} />
        </TabsContent>

        <TabsContent value="leases">
           <LeaseInsights leases={data.leases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
