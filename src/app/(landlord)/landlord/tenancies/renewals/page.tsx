import { getRenewalInsights } from "@/actions/landlord-tenancy";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyIcon, ChevronLeftIcon, TrendingUpIcon, CalendarIcon, UserIcon, ArrowRightIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function LandlordRenewalsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const renewals = await getRenewalInsights();

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return <Badge className="bg-emerald-500 font-black"><CheckCircle2Icon className="h-3 w-3 mr-1" /> ACCEPTED</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="text-orange-500 border-orange-500 font-black"><ClockIcon className="h-3 w-3 mr-1" /> PENDING</Badge>;
      case "DECLINED":
        return <Badge variant="destructive" className="font-black">DECLINED</Badge>;
      default:
        return <Badge className="font-black">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tenancies" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Tenancies
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Renewal Insights</h1>
          <p className="text-slate-500 font-medium italic">Tracking lease continuity and tenant retention.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-100 bg-blue-50/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-blue-600">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-900">{renewals.filter(r => r.status === "PENDING").length} Offers</div>
            <p className="text-xs font-bold text-blue-700/60 mt-1 uppercase tracking-tighter flex items-center gap-1">
               <TrendingUpIcon className="h-3 w-3" /> Potential Retention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-xl font-black">Upcoming & Pending Renewals</CardTitle>
           <CardDescription className="text-xs font-bold uppercase">Visibility into future occupancy trends</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Lease #</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Tenant</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Proposed Rent</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Deadline</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewals.map((renewal) => (
                <TableRow key={renewal.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                       <div className="bg-slate-100 p-2 rounded-lg"><KeyIcon className="h-4 w-4 text-slate-600" /></div>
                       <div>
                          <p className="font-bold text-slate-900">{renewal.lease.leaseNumber}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Unit {renewal.lease.unit.unitNumber}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-slate-900">{renewal.lease.tenant.firstName} {renewal.lease.tenant.lastName}</span>
                     </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900">KES {Number(renewal.proposedRent).toLocaleString()}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        {renewal.deadline ? format(new Date(renewal.deadline), "MMM dd, yyyy") : "N/A"}
                     </div>
                  </TableCell>
                  <TableCell>
                     {getStatusBadge(renewal.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="font-black text-blue-600 uppercase hover:bg-blue-50" asChild>
                       <Link href={`/landlord/tenancies/${renewal.leaseId}`}>
                          Details <ArrowRightIcon className="h-3 w-3 ml-1" />
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {renewals.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <CalendarIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No renewals found</h3>
                         <p className="text-slate-500 font-medium">There are no pending or upcoming lease renewals at this time.</p>
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
