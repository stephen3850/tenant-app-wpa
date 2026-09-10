"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuildingIcon, MapPinIcon, HomeIcon, UsersIcon, SearchIcon, FilterIcon, ArrowRightIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function LandlordPropertiesList({ properties }: { properties: any[] }) {
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
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
      case "INACTIVE":
        return <Badge variant="secondary">Inactive</Badge>;
      case "UNDER_DEVELOPMENT":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Under Development</Badge>;
      case "SOLD":
        return <Badge variant="destructive">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Property Portfolio</h1>
          <p className="text-slate-500 font-medium">Overview of your assigned properties and their performance.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by property name or code..."
            className="pl-10 bg-slate-50/50 border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2">
            <FilterIcon className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="font-bold gap-2">
            Sort by Revenue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const totalUnits = property._count.units;
          const occupiedUnits = property.units.filter((u: any) => u.occupancyStatus === "OCCUPIED").length;
          const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

          return (
            <Card key={property.id} className="overflow-hidden border-slate-200 hover:shadow-lg transition-all group">
              <CardHeader className="p-0">
                <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                  <BuildingIcon className="h-16 w-16 text-slate-300" />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {property.propertyCode}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {property.propertyType}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {property.propertyName}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPinIcon className="h-3 w-3" /> {property.address}, {property.city}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Units</p>
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-4 w-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{totalUnits}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Occupancy</p>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{occupancyRate.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full font-bold gap-2 group-hover:bg-blue-600 transition-all">
                  <Link href={`/landlord/properties/${property.id}`}>
                    View Property Details <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {properties.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <BuildingIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
              We couldn't find any properties assigned to your account matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
