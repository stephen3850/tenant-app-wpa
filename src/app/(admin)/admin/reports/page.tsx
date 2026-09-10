import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShieldCheck, Activity, Globe } from "lucide-react";

export default function PlatformReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Intelligence</h1>
        <p className="text-slate-500 font-medium">Aggregated SaaS metrics and operational oversight.</p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="revenue" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <TrendingUp className="h-4 w-4" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="growth" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <Users className="h-4 w-4" /> Growth
          </TabsTrigger>
          <TabsTrigger value="operations" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <Activity className="h-4 w-4" /> Operations
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <ShieldCheck className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="health" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <Globe className="h-4 w-4" /> Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <Card className="border-2 shadow-sm">
                <CardHeader className="p-4">
                   <CardTitle className="text-sm font-bold text-slate-500 uppercase">Platform MRR</CardTitle>
                   <p className="text-2xl font-black text-slate-900">KES 4.2M</p>
                </CardHeader>
             </Card>
             <Card className="border-2 shadow-sm">
                <CardHeader className="p-4">
                   <CardTitle className="text-sm font-bold text-slate-500 uppercase">Total ARR</CardTitle>
                   <p className="text-2xl font-black text-slate-900">KES 50.4M</p>
                </CardHeader>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Organization and user adoption metrics.
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Platform usage, ticket volumes, and communication activity.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
