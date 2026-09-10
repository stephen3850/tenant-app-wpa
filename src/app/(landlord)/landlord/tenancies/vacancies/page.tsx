import { getVacancyInsights } from "@/actions/landlord-tenancy";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HomeIcon, ChevronLeftIcon, TrendingDownIcon, CalendarIcon, BuildingIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";

export default async function LandlordVacanciesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const vacancies = await getVacancyInsights();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tenancies" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Tenancies
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vacancy Analysis</h1>
          <p className="text-slate-500 font-medium italic">Monitoring inventory ready for leasing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-100 bg-orange-50/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-orange-600">Total Vacant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-900">{vacancies.length} Units</div>
            <p className="text-xs font-bold text-orange-700/60 mt-1 uppercase tracking-tighter flex items-center gap-1">
               <TrendingDownIcon className="h-3 w-3" /> Potential Revenue Loss
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-xl font-black">Vacant Inventory</CardTitle>
           <CardDescription className="text-xs font-bold uppercase">Units currently available for lease</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Unit #</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Property</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Type</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Market Rent</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Days Vacant</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((unit) => {
                const daysVacant = differenceInDays(new Date(), new Date(unit.updatedAt));
                return (
                  <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                         <div className="bg-slate-100 p-2 rounded-lg"><HomeIcon className="h-4 w-4 text-slate-600" /></div>
                         {unit.unitNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                          <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                          {unit.property.propertyName}
                       </div>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-slate-500 uppercase">{unit.unitType}</TableCell>
                    <TableCell className="font-black text-slate-900">KES {Number(unit.monthlyRent).toLocaleString()}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-slate-400" />
                          <span className={daysVacant > 30 ? "font-black text-red-600" : "font-bold text-slate-600"}>
                             {daysVacant} Days
                          </span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <Badge variant="outline" className="font-black text-orange-600 border-orange-200 bg-orange-50/50 uppercase tracking-widest">
                          VACANT
                       </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {vacancies.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <HomeIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No vacancies</h3>
                         <p className="text-slate-500 font-medium">Excellent! All units in your portfolio are currently occupied or reserved.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
