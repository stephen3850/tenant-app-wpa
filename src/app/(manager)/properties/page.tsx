"use client";

import React, { useEffect, useState } from "react";
import {
  FileDown,
  FileUp,
  Plus,
  UserPlus,
  GitBranch,
  Zap,
  Search,
  Building2,
  Filter,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddPropertyDialog } from "@/features/properties/components/add-property-dialog";
import { PropertyList } from "@/features/properties/components/property-list";
import { getProperties, getPropertyStats } from "@/actions/property-actions";
import { useTenant } from "@/providers/tenant-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// Refreshing imports after src move
export default function PropertiesPage() {
  const { organizationId } = useTenant();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [landlordSearchQuery, setLandlordSearchQuery] = useState("");

  const fetchData = async () => {
    if (!organizationId) return;
    try {
      const [propsData, statsData] = await Promise.all([
        getProperties(organizationId),
        getPropertyStats(organizationId)
      ]);
      setProperties(propsData);
      setFilteredProperties(propsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId]);

  useEffect(() => {
    const filtered = properties.filter(prop => {
      const matchesProperty =
        prop.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.propertyCode.toLowerCase().includes(searchQuery.toLowerCase());

      const landlordName = prop.landlord?.name || prop.description?.replace("Landlord: ", "") || "";
      const matchesLandlord = landlordName.toLowerCase().includes(landlordSearchQuery.toLowerCase());

      return matchesProperty && matchesLandlord;
    });
    setFilteredProperties(filtered);
  }, [searchQuery, landlordSearchQuery, properties]);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500 bg-[#F5F7FA] min-h-screen">
      <AddPropertyDialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) fetchData();
      }} />

      {/* Portfolio Header Section */}
      <Card className="border-[#F2F4F7] shadow-none rounded-xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Left Content */}
            <div className="flex-1 max-w-xl space-y-4">
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8CC63F]">PORTFOLIO</p>
                <h1 className="text-[20px] font-bold text-[#1F2B3E] tracking-tight">Properties</h1>
                <p className="text-[11px] font-medium text-[#6B7280] leading-snug max-w-[250px]">
                  Monitor occupancy health across every building and act fast where it matters.
                </p>
              </div>

              {/* Button Row - Fully Wired */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    toast.info("Exporting property list to Excel...");
                    const headers = [
                      "Property ID",
                      "Property Name",
                      "Prefix",
                      "Type",
                      "Location",
                      "Branch",
                      "Landlord Name",
                      "Landlord Email",
                      "Floors",
                      "Units",
                      "Occupied Units",
                      "Vacant Units",
                      "Reserved Units",
                      "Inactive Units",
                      "Service Charge %",
                      "Service Charge Vatable",
                      "Income Tax %",
                      "Water Unit Rate",
                      "Paybill Number",
                      "Account Format",
                      "Account Number"
                    ];

                    const csvRows = filteredProperties.map(p => {
                      // Calculate stats if they aren't pre-loaded on the object
                      const units = p._count?.units || p.units?.length || 0;
                      const occupied = p.units?.filter((u: any) => u.occupancyStatus === "OCCUPIED").length || 0;
                      const vacant = p.units?.filter((u: any) => u.occupancyStatus === "VACANT").length || 0;
                      const reserved = p.units?.filter((u: any) => u.occupancyStatus === "RESERVED").length || 0;
                      const inactive = p.units?.filter((u: any) => u.status === "INACTIVE").length || 0;

                      return [
                        `"${p.id || ""}"`,
                        `"${p.propertyName || ""}"`,
                        `"${p.propertyCode || ""}"`,
                        `"${p.propertyType || ""}"`,
                        `"${p.address || ""}"`,
                        `"N/A"`, // Branch placeholder
                        `"${p.landlord?.name || ""}"`,
                        `"${p.landlord?.email || ""}"`,
                        p.numberOfFloors || 0,
                        units,
                        occupied,
                        vacant,
                        reserved,
                        inactive,
                        p.serviceChargeRate || 0,
                        `"No"`, // Vatable default
                        p.incomeTaxRate || 0,
                        p.waterUnitRate || 0,
                        `"${p.paybillNumber || ""}"`,
                        `"${p.accountFormat || "unit_number"}"`,
                        `"${p.accountNumber || ""}"`
                      ].join(",");
                    });

                    const csvContent = [headers.join(","), ...csvRows].join("\n");
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `TMS_Properties_${new Date().toISOString().split('T')[0]}.csv`);
                    link.click();
                  }}
                  className="h-8 rounded-lg bg-[#F0FDF4] text-[#12B76A] font-bold text-[10px] gap-1.5 px-3.5 hover:bg-[#DCFCE7] transition-all shadow-none border-none"
                >
                  <FileDown className="h-3 w-3" /> Export
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="h-8 rounded-lg bg-[#12B76A] text-white font-bold text-[10px] gap-1.5 px-4 hover:bg-[#0E9355] shadow-sm transition-all border-none"
                >
                  <Plus className="h-3.5 w-3.5" /> New property
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-8 rounded-lg border-2 border-slate-900 bg-white text-slate-900 font-bold text-[10px] gap-1.5 px-3.5 hover:bg-[#F9FAFB] transition-all shadow-sm"
                >
                  <Link href="/properties/import">
                    <FileUp className="h-3 w-3 text-[#12B76A]" /> Import
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="h-8 rounded-lg bg-[#F0FDF4] text-[#12B76A] font-bold text-[10px] gap-1.5 px-3.5 hover:bg-[#DCFCE7] transition-all"
                >
                  <Link href="/leases/new">
                    <UserPlus className="h-3 w-3" /> Link tenant
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3.5 hover:bg-[#F9FAFB] transition-all"
                >
                  <Link href="/properties/branches">
                    <GitBranch className="h-3 w-3" /> Branches
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3.5 hover:bg-[#F9FAFB] transition-all"
                >
                  <Link href="/properties/utility-accounts">
                    <Zap className="h-3 w-3" /> Utility accounts
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Stats Section */}
            <div className="flex gap-2 shrink-0">
              <StatMiniCard label="PROPERTIES" value={loading ? "..." : (stats?.propertyCount || 0).toString()} sublabel="Active portfolio assets" />
              <StatMiniCard label="OCCUPANCY" value={loading ? "..." : `${stats?.occupancyRate || 0}%`} sublabel={`${stats?.occupiedUnits || 0} occupied units`} />
              <StatMiniCard label="VACANT" value={loading ? "..." : (stats?.vacantUnits || 0).toString()} sublabel="Ready or open units" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
             <div className="lg:col-span-2 space-y-1">
                <label className="text-[8px] font-bold uppercase tracking-widest text-[#98A2B3] ml-0.5">SEARCH PROPERTY</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                      <Search className="h-3 w-3 text-[#98A2B3]" />
                   </div>
                   <Input
                      placeholder="Property name or prefix"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-8 rounded-lg border-[#DCE3EA] focus:ring-[#56A600]/20 bg-[#F5F7FA]/50 text-[11px]"
                   />
                </div>
             </div>
             <div className="lg:col-span-2 space-y-1">
                <label className="text-[8px] font-bold uppercase tracking-widest text-[#98A2B3] ml-0.5">SEARCH LANDLORD</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                      <div className="h-4 w-4 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                         <User className="h-2.5 w-2.5 text-[#98A2B3]" />
                      </div>
                   </div>
                   <Input
                      placeholder="Landlord name"
                      value={landlordSearchQuery}
                      onChange={(e) => setLandlordSearchQuery(e.target.value)}
                      className="h-9 pl-8 rounded-lg border-[#DCE3EA] focus:ring-[#12B76A]/20 bg-[#F5F7FA]/50 text-[11px]"
                   />
                </div>
             </div>
             <Button
                onClick={() => {
                  setSearchQuery("");
                  setLandlordSearchQuery("");
                }}
                variant="outline"
                className="h-9 rounded-lg border-[#DCE3EA] text-[#1F2B3E] font-bold text-[11px] gap-2 hover:bg-[#F9FAFB] shadow-sm px-6"
             >
                Clear Filters
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden">
            <CardContent className="p-3.5 flex flex-col justify-between h-24">
               <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#667085]">TOTAL OCCUPIED</p>
                  <div className="bg-[#F0FDF4] px-1.5 py-0.5 rounded-full border border-[#DCE3EA]">
                     <span className="text-[8px] font-bold text-[#56A600]">System Wide</span>
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-black text-[#1F2937]">{loading ? "..." : (stats?.occupiedUnits || 0)}</h3>
                  <p className="text-[9px] font-medium text-[#667085] mt-0.5">Total units currently leased.</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden">
            <CardContent className="p-3.5 flex flex-col justify-between h-24">
               <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#667085]">TOTAL VACANT</p>
                  <div className="bg-[#F0FDF4] px-1.5 py-0.5 rounded-full border border-[#DCE3EA]">
                     <span className="text-[8px] font-bold text-[#56A600]">System Wide</span>
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-black text-[#1F2937]">{loading ? "..." : (stats?.vacantUnits || 0)}</h3>
                  <p className="text-[9px] font-medium text-[#667085] mt-0.5">Total units available for lease.</p>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Content Section */}
      {loading ? (
        <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white p-8">
           <div className="space-y-3">
              <Skeleton className="h-6 w-1/5" />
              <Skeleton className="h-48 w-full" />
           </div>
        </Card>
      ) : filteredProperties.length > 0 ? (
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-[#1F2937]">Active Portfolio</h3>
              <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-[#667085]">{filteredProperties.length} properties</span>
                 <Filter className="h-3 w-3 text-[#98A2B3]" />
              </div>
           </div>
           <PropertyList
              properties={filteredProperties}
              onAddUnits={(id) => router.push(`/properties/${id}/units/add`)}
              onRefresh={fetchData}
           />
        </div>
      ) : (
        <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white min-h-[300px] flex items-center justify-center">
           <CardContent className="p-8 text-center space-y-3">
              <div className="mx-auto w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
                 <Building2 className="h-5 w-5 text-[#56A600]" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-base font-bold text-[#1F2937]">No properties match your search</h3>
                 <p className="text-[11px] font-medium text-[#667085] max-w-xs mx-auto">
                    Try adjusting your filters or add a new property.
                 </p>
              </div>
              <Button
                 onClick={() => setIsAddDialogOpen(true)}
                 className="h-9 px-5 rounded-lg bg-[#56A600] text-white font-bold text-[11px] gap-2 hover:bg-[#4a8e00] shadow-sm"
              >
                 <Plus className="h-3.5 w-3.5" /> Add property
              </Button>
           </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatMiniCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="bg-white border border-[#EAECF0] rounded-lg p-3 w-[100px] h-[100px] flex flex-col justify-between shadow-none transition-all hover:bg-gray-50/50">
      <p className="text-[7.5px] font-bold text-[#6B7280] uppercase tracking-wider">{label}</p>
      <h4 className="text-[20px] font-bold text-[#1F2B3E] leading-none">{value}</h4>
      <p className="text-[8.5px] font-medium text-[#9CA3AF] leading-tight">{sublabel}</p>
    </div>
  );
}
