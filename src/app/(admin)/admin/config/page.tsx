import { getConfigurations } from "@/features/features/actions/config-actions";
import { ConfigList } from "./components/config-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Building2, Globe, Lock } from "lucide-react";

export default async function ConfigPage() {
  const configs = await getConfigurations();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuration Center</h1>
        <p className="text-slate-500 font-medium">Manage global platform parameters, business rules, and security policies.</p>
      </div>

      <Tabs defaultValue="platform" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="platform" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            <Globe className="mr-2 h-4 w-4" /> Platform
          </TabsTrigger>
          <TabsTrigger value="business" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            <Building2 className="mr-2 h-4 w-4" /> Business
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">
            <Lock className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <ConfigList configs={configs.filter(c => c.category === 'PLATFORM')} />
        </TabsContent>

        <TabsContent value="business">
          <ConfigList configs={configs.filter(c => c.category === 'BUSINESS')} />
        </TabsContent>

        <TabsContent value="security">
          <ConfigList configs={configs.filter(c => c.category === 'SECURITY')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
