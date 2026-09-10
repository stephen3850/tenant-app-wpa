import { getFeatureFlags } from "@/features/features/actions/feature-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Play, BarChart3, Users, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ExperimentsPage() {
  const flags = await getFeatureFlags();
  const experiments = flags.filter(f => f.status === 'EXPERIMENT' || f.status === 'BETA');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Experimentation & Beta Programs</h1>
          <p className="text-slate-500 font-medium">Monitor active A/B tests and early access features.</p>
        </div>
        <Button className="bg-slate-900 font-bold">
          <FlaskConical className="mr-2 h-4 w-4" />
          New Experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {experiments.length === 0 && (
          <Card className="border-2 border-dashed p-12 text-center text-slate-500 font-medium italic">
            No active experiments or beta programs currently running.
          </Card>
        )}
        {experiments.map((exp) => (
          <Card key={exp.id} className="border-2 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b-2 border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-600 font-black">{exp.status}</Badge>
                <span className="font-black text-slate-900">{exp.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Started {formatDate(exp.createdAt)}
                </div>
              </div>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Segment</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-600" />
                    <span className="font-bold text-slate-700">{exp.scope}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exposure</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${exp.rolloutPercentage}%` }} />
                    </div>
                    <span className="font-black text-slate-900">{exp.rolloutPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center">
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <p className="text-xl font-black text-slate-900">1,240</p>
                <p className="text-xs font-bold text-slate-500">Active Participants</p>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <Button className="w-full font-bold bg-slate-900">View Analytics</Button>
                <Button variant="outline" className="w-full font-bold border-2">Configure Rollout</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
