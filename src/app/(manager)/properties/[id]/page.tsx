import React from "react";
import { getTenantDb } from "@/lib/tenant-db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { cn, serialize } from "@/lib/utils";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Edit2,
  Layers,
  FileDown,
  Plus,
  Archive,
  Trash2,
  Zap,
  Lock,
  Search,
  Building2,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PropertyActionToolbar } from "./property-action-toolbar";
import { UnitInventoryTable } from "./unit-inventory-table";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertyDetailsPage({ params, searchParams }: PropertyDetailsPageProps) {
  const { id } = await params;
  const { new: isNewParam } = await searchParams;

  const session = await auth();
  if (!session?.user?.organizationId) {
    redirect("/login");
  }

  const tenantDb = getTenantDb(session.user.organizationId);

  const rawProperty = await tenantDb.property.findUnique({
    where: { id },
    include: {
      units: {
        orderBy: { unitNumber: "asc" }
      },
      landlord: true,
      _count: {
        select: { units: true }
      }
    }
  });

  if (!rawProperty) {
    notFound();
  }

  const property = serialize(rawProperty);

  const landlordName = property.landlord?.name || property.description?.replace("Landlord: ", "") || "Not assigned";

  const isNew = isNewParam === "true";
  const occupiedUnits = property.units.filter((u: any) => u.occupancyStatus === "OCCUPIED").length;
  const occupancyRate = property.units.length > 0 ? (occupiedUnits / property.units.length) * 100 : 0;
  const totalMonthlyRent = property.units.reduce((acc: number, unit: any) => acc + Number(unit.monthlyRent), 0);
  const totalDeposits = property.units.reduce((acc: number, unit: any) => acc + Number(unit.securityDeposit), 0);

  // Helper to resolve image source
  const imageSrc = property.featuredImage
    ? property.featuredImage.startsWith('data:') || property.featuredImage.startsWith('/')
      ? property.featuredImage
      : `/uploads/${property.featuredImage}`
    : null;

  return (
    <div className="p-3 lg:p-4 space-y-3 animate-in fade-in duration-500 bg-[#F5F7FA] min-h-screen max-w-full overflow-x-hidden font-inter">
      {/* SUCCESS BANNER */}
      {isNew && (
        <div className="bg-[#56A600] text-white px-4 py-3 rounded-lg shadow-sm font-bold text-sm animate-in slide-in-from-top-2 duration-300">
          Unit added.
        </div>
      )}

      {/* Main Header Container */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-4 flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex gap-4 flex-1">
             {/* Property Image Container */}
             <div className="h-24 w-24 rounded-xl bg-[#F5F7FA] flex-shrink-0 overflow-hidden border border-[#EAECF0] shadow-inner relative">
                {imageSrc ? (
                   <img
                      src={imageSrc}
                      alt={property.propertyName}
                      className="h-full w-full object-cover"
                   />
                ) : (
                   <div className="h-full w-full flex items-center justify-center bg-[#1F2937]/5">
                      <Building2 className="h-8 w-8 text-[#98A2B3]" />
                   </div>
                )}
             </div>

             <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#56A600]">PROPERTIES</p>
                <h1 className="text-2xl font-black text-[#1F2937] tracking-tight leading-tight">{property.propertyName}</h1>
                <p className="text-[11px] font-medium text-[#667085]">
                  Portfolio asset overview, occupancy, rent value, and units.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className="h-6 rounded-full bg-[#F0FDF4] text-[#56A600] border-[#DCE3EA] font-bold text-[9px] px-3">
                    PREFIX: {property.propertyCode}
                  </Badge>
                  <Badge variant="outline" className="h-6 rounded-full bg-white text-[#1F2937] border-[#DCE3EA] font-bold text-[9px] px-3 uppercase">
                    {property.propertyType}
                  </Badge>
                  <Badge variant="outline" className="h-6 rounded-full bg-white text-[#1F2937] border-[#DCE3EA] font-bold text-[9px] px-3 uppercase">
                    {property.city || property.county || "Location"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                   <Badge className="h-6 rounded-full bg-[#1F2937] text-white font-bold text-[9px] px-3 uppercase">
                      {property.numberOfFloors || 0} FLOORS
                   </Badge>
                   <Badge className="h-6 rounded-full bg-[#1F2937] text-white font-bold text-[9px] px-3 uppercase">
                      {property._count.units} UNITS
                   </Badge>
                </div>
                <p className="text-[10px] font-medium text-[#667085] mt-2">
                  Assigned landlord: <span className="text-[#1F2937] font-bold">{landlordName}</span>
                </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2 shrink-0">
            <StatMiniCard label="UNITS" value={property._count.units.toString()} sublabel={`${occupiedUnits} occupied, ${property._count.units - occupiedUnits} vacant`} />
            <StatMiniCard label="OCCUPANCY" value={`${occupancyRate.toFixed(0)}%`} sublabel="0 public listings" />
            <StatMiniCard label="MONTHLY RENT" value={`KES ${totalMonthlyRent.toLocaleString()}`} sublabel="Current unit rent total" />
            <StatMiniCard label="DEPOSIT HELD" value={`KES ${totalDeposits.toLocaleString()}`} sublabel="Configured unit deposits" />
          </div>
        </CardContent>
      </Card>

      {/* Action Toolbar */}
      <PropertyActionToolbar propertyId={id} />

      {/* Monthly Invoice Services */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 px-6 border-b border-[#DCE3EA] flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-[#1F2937]">Monthly invoice services</h2>
              <p className="text-[10px] font-medium text-[#64748B]">0 active services for monthly invoices</p>
            </div>
            <div className="flex gap-2">
              <Button className="h-8 rounded-lg bg-[#1D6AE5] hover:bg-[#1656B9] text-white font-bold text-[10px] gap-2 px-4 shadow-sm">
                <Plus className="h-3.5 w-3.5" /> Add service
              </Button>
              <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] text-[#1F2937] font-bold text-[10px] gap-2 px-3">
                <LayoutDashboard className="h-3.5 w-3.5" /> Service list
              </Button>
            </div>
          </div>
          <div className="py-4 text-center">
            <p className="text-[11px] font-medium text-[#64748B]">No monthly invoice services set for this property.</p>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Expenses */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 px-6 border-b border-[#DCE3EA] flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-[#1F2937]">Recurring expenses</h2>
              <p className="text-[10px] font-medium text-[#64748B]">0 active templates for this property</p>
            </div>
            <div className="flex gap-2">
              <Button className="h-8 rounded-lg bg-[#1D6AE5] hover:bg-[#1656B9] text-white font-bold text-[10px] gap-2 px-4 shadow-sm">
                <Plus className="h-3.5 w-3.5" /> Add recurring
              </Button>
              <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] text-[#1F2937] font-bold text-[10px] gap-2 px-3">
                <FileText className="h-3.5 w-3.5" /> Expense ledger
              </Button>
            </div>
          </div>
          <div className="py-4 text-center">
            <p className="text-[11px] font-medium text-[#64748B]">No recurring expenses set for this property.</p>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Section */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <UnitInventoryTable units={property.units} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatMiniCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <Card className="border-[#DCE3EA] shadow-sm rounded-lg bg-white w-40 overflow-hidden">
      <CardContent className="p-3 h-24 flex flex-col justify-between">
        <p className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-widest leading-none">{label}</p>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-[#1F2937] leading-none">{value}</h4>
          <p className="text-[9px] font-medium text-[#98A2B3] leading-none">{sublabel}</p>
        </div>
      </CardContent>
    </Card>
  );
}
