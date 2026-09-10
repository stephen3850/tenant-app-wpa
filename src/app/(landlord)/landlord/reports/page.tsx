import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OwnerStatementList } from "@/features/reporting/components/owner-statement-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandlordReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Reporting</h1>
        <p className="text-slate-500 font-medium">Financial performance and operational oversight for your portfolio.</p>
      </div>

      <Tabs defaultValue="statements" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="statements" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <FileText className="h-4 w-4" /> Monthly Statements
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <TrendingUp className="h-4 w-4" /> Performance
          </TabsTrigger>
          <TabsTrigger value="tax" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <ShieldCheck className="h-4 w-4" /> Tax Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statements" className="space-y-6">
          <OwnerStatementList />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="border-2 shadow-sm">
                <CardHeader>
                   <CardTitle className="text-lg font-black">Property ROI</CardTitle>
                   <CardDescription>Return on investment metrics per property.</CardDescription>
                </CardHeader>
             </Card>
             <Card className="border-2 shadow-sm">
                <CardHeader>
                   <CardTitle className="text-lg font-black">Cash Flow</CardTitle>
                   <CardDescription>Monthly net cash flow tracking.</CardDescription>
                </CardHeader>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <Card className="border-2 border-dashed p-12 text-center">
            <CardDescription>Annual tax summaries and withholding records.</CardDescription>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
