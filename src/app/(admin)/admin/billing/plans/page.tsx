import { db } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, CheckCircle2Icon, Settings2Icon, ArchiveIcon } from "lucide-react";

export default async function PlansPage() {
  const plans = await db.plan.findMany({
    where: { isRetired: false },
    orderBy: { price: "asc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Subscription Plans</h2>
          <p className="text-slate-500 font-medium mt-1">Configure pricing, limits, and features for the platform.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            <PlusIcon className="mr-2 h-4 w-4" /> Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            {!plan.isActive && (
                <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-lg">
                    Inactive
                </div>
            )}
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{plan.interval}</p>
                <CardTitle className="text-xl font-black text-slate-900">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-slate-900">${Number(plan.price).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">/{plan.interval === 'MONTHLY' ? 'mo' : 'yr'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 space-y-4">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{plan.description || "No description provided."}</p>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Included Features</p>
                <div className="space-y-2">
                    {Object.entries((plan.features as any) || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <CheckCircle2Icon className="h-3.5 w-3.5 text-green-500" />
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-slate-900">{String(value)}</span>
                        </div>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 font-bold border-slate-200">
                    <Settings2Icon className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="font-bold text-red-600 hover:bg-red-50 hover:text-red-700">
                    <ArchiveIcon className="h-4 w-4" />
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
