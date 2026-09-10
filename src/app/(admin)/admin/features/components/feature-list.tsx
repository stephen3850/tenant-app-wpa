"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings2, History, Users, Globe, ChevronRight } from "lucide-react";
import { enableFeatureFlag, disableFeatureFlag } from "@/features/features/actions/feature-actions";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export function FeatureList({ flags }: { flags: any[] }) {
  const handleToggle = async (id: string, currentlyEnabled: boolean) => {
    try {
      if (currentlyEnabled) {
        await disableFeatureFlag(id);
        toast.success("Feature disabled");
      } else {
        await enableFeatureFlag(id);
        toast.success("Feature enabled");
      }
    } catch (error) {
      toast.error("Failed to update feature status");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {flags.length === 0 && (
        <Card className="border-2 border-dashed p-12 text-center">
          <CardContent>
            <p className="text-slate-500 font-medium">No feature flags found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
      {flags.map((flag) => (
        <Card key={flag.id} className="border-2 shadow-sm hover:border-slate-300 transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900">{flag.name}</h3>
                  <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600 tracking-wider">
                    {flag.key}
                  </code>
                  <Badge className={`font-bold uppercase text-[10px] ${
                    flag.status === 'ENABLED' ? 'bg-emerald-100 text-emerald-700' :
                    flag.status === 'DISABLED' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  } border-none`}>
                    {flag.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-500 line-clamp-1">{flag.description}</p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                    {flag.scope}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Users className="h-3.5 w-3.5" />
                    {flag._count.overrides} Overrides
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <History className="h-3.5 w-3.5" />
                    Last mod {formatDate(flag.updatedAt)} by {flag.lastModifiedBy?.name || "System"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rollout</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 transition-all duration-500"
                        style={{ width: `${flag.rolloutPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-900">{flag.rolloutPercentage}%</span>
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-100" />

                <div className="flex items-center gap-3">
                  <Switch
                    checked={flag.status === 'ENABLED'}
                    onCheckedChange={() => handleToggle(flag.id, flag.status === 'ENABLED')}
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group-hover:bg-slate-100">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group-hover:bg-slate-100">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
