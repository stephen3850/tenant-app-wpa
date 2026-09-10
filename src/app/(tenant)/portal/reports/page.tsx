import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Receipt, FileText, Activity } from "lucide-react";

export default function TenantReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Reports</h1>
        <p className="text-slate-500 font-medium">Access your financial history and account statements.</p>
      </div>

      <Tabs defaultValue="payments" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="payments" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <CreditCard className="h-4 w-4" /> Payment History
          </TabsTrigger>
          <TabsTrigger value="receipts" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <Receipt className="h-4 w-4" /> Receipts
          </TabsTrigger>
          <TabsTrigger value="statement" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <FileText className="h-4 w-4" /> Account Statement
          </TabsTrigger>
          <TabsTrigger value="utilities" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex gap-2 items-center">
            <Activity className="h-4 w-4" /> Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Comprehensive history of all payments made.
          </Card>
        </TabsContent>

        <TabsContent value="receipts">
          <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Digital receipts for every transaction.
          </Card>
        </TabsContent>

        <TabsContent value="statement">
          <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Monthly ledger of charges, payments, and balances.
          </Card>
        </TabsContent>

        <TabsContent value="utilities">
           <Card className="border-2 border-dashed p-12 text-center text-slate-500">
             Utility consumption and billing trends.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
