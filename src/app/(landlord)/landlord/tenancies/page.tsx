import { getLandlordTenancies, getLeaseInsights } from "@/actions/landlord-tenancy";
import { LandlordTenancyList } from "@/features/landlord/components/landlord-tenancy-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyIcon, CalendarIcon, AlertTriangleIcon, HomeIcon, UserCheckIcon } from "lucide-react";
import Link from "next/link";

export default async function LandlordTenanciesPage({
  searchParams,
}: {
  searchParams: { propertyId?: string; status?: string; search?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [tenancies, insights] = await Promise.all([
    getLandlordTenancies(searchParams),
    getLeaseInsights(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Leases</CardTitle>
            <UserCheckIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{insights.activeLeases}</div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Stabilized Portfolio</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expiring (30d)</CardTitle>
            <CalendarIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{insights.expiring30}</div>
            <Link href="/landlord/tenancies/renewals" className="text-[10px] font-black text-blue-600 uppercase mt-1 hover:underline">
               Review Renewals
            </Link>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pending Renewals</CardTitle>
            <KeyIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{insights.renewalsPending}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Awaiting tenant action</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-sm bg-orange-50/10 border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-orange-600">Vacant Units</CardTitle>
            <HomeIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-orange-900">{insights.vacantUnits}</div>
            <Link href="/landlord/tenancies/vacancies" className="text-[10px] font-black text-orange-600 uppercase mt-1 hover:underline">
               Vacancy Analysis
            </Link>
          </CardContent>
        </Card>
      </div>

      <LandlordTenancyList tenancies={tenancies} />
    </div>
  );
}
