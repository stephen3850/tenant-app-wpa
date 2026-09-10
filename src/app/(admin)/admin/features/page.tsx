import { getFeatureFlags, getFeatureFlagsDashboard } from "@/features/features/actions/feature-actions";
import { FeatureStats } from "./components/feature-stats";
import { FeatureList } from "./components/feature-list";
import { FeatureFilters } from "./components/feature-filters";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, ShieldCheck, Zap } from "lucide-react";

export default async function FeaturesPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const [flags, stats] = await Promise.all([
    getFeatureFlags(params),
    getFeatureFlagsDashboard(),
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Feature Flags & Rollouts</h1>
          <p className="text-slate-500 font-medium">Control feature availability and manage progressive releases.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-2">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Audit Logs
          </Button>
          <Button className="bg-slate-900 font-bold hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Create Flag
          </Button>
        </div>
      </div>

      <FeatureStats stats={stats} />

      <div className="space-y-6">
        <FeatureFilters />
        <FeatureList flags={flags} />
      </div>
    </div>
  );
}
