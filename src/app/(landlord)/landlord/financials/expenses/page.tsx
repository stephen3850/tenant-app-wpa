import { getExpenseAnalytics } from "@/actions/landlord-financial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeftIcon, BarChart3Icon } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ExpenseAnalyticsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getExpenseAnalytics();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="space-y-1">
          <Link href="/landlord/financials" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Financials
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expense Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card>
            <CardHeader>
               <CardTitle className="text-xl font-black">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {data.byCategory.map((c: any, idx: number) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                           <span>{c.name}</span>
                           <span>KES {Number(c.value).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-red-400" style={{ width: "40%" }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="flex flex-col items-center justify-center bg-slate-50/50 border-dashed border-2">
            <BarChart3Icon className="h-12 w-12 text-slate-300 mb-4" />
            <p className="font-bold text-slate-500">Historical trend analysis coming soon...</p>
         </Card>
      </div>
    </div>
  );
}
