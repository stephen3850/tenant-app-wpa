"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyIcon,
  SearchIcon,
  FilterIcon,
  ChevronRightIcon,
  HomeIcon,
  BuildingIcon,
  CalendarIcon,
  UserIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function LandlordTenancyList({ tenancies }: { tenancies: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500 font-black">ACTIVE</Badge>;
      case "EXPIRING":
      case "EXPIRING_SOON":
        return <Badge className="bg-orange-500 font-black">EXPIRING</Badge>;
      case "EXPIRED":
        return <Badge variant="destructive" className="font-black">EXPIRED</Badge>;
      case "TERMINATED":
        return <Badge variant="secondary" className="font-black">TERMINATED</Badge>;
      default:
        return <Badge className="font-black">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenancy Oversight</h1>
          <p className="text-slate-500 font-medium">Monitoring all active leases and tenant performance.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by lease, unit or tenant..."
            className="pl-10 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2">
            <FilterIcon className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Lease & Unit</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Property</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Tenant</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Period</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Monthly Rent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenancies.map((lease) => (
                <TableRow key={lease.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => router.push(`/landlord/tenancies/${lease.id}`)}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                       <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <KeyIcon className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{lease.leaseNumber}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                             <HomeIcon className="h-3 w-3" /> Unit {lease.unit.unitNumber}
                          </p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                        <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                        {lease.property.propertyName}
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                           {lease.tenant.firstName[0]}{lease.tenant.lastName[0]}
                        </div>
                        <span className="font-bold text-slate-900">{lease.tenant.firstName} {lease.tenant.lastName}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                           <CalendarIcon className="h-3 w-3" /> Start: {format(new Date(lease.startDate), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                           <CalendarIcon className="h-3 w-3" /> End: {lease.endDate ? format(new Date(lease.endDate), "MMM dd, yyyy") : "Ongoing"}
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(lease.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="font-black text-slate-900">KES {Number(lease.monthlyRent).toLocaleString()}</div>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50 p-0">
                       View Details <ChevronRightIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tenancies.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <KeyIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No active tenancies</h3>
                         <p className="text-slate-500 font-medium">When you have active leases, they will appear here.</p>
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
