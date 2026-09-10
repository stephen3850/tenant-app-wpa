"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Building2, MapPin, Layers, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deletePropertyAction } from "../actions";
import { useRouter } from "next/navigation";

interface Property {
  id: string;
  propertyName: string;
  propertyCode: string;
  propertyType: string;
  address: string;
  city: string;
  county: string;
  numberOfFloors: number;
  featuredImage?: string | null;
  units?: { occupancyStatus: string }[];
  _count?: { units: number };
  description?: string | null;
  landlord?: { name: string | null } | null;
}

interface PropertyListProps {
  properties: Property[];
  onAddUnits: (propertyId: string) => void;
  onRefresh?: () => void;
}

export function PropertyList({ properties, onAddUnits, onRefresh }: PropertyListProps) {
  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onAddUnits={onAddUnits}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

function PropertyCard({
  property,
  onAddUnits,
  onRefresh
}: {
  property: Property;
  onAddUnits: (propertyId: string) => void;
  onRefresh?: () => void;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const totalUnits = property._count?.units || 0;
  const occupiedUnits = property.units?.filter(u => u.occupancyStatus === 'OCCUPIED').length || 0;
  const vacantUnits = property.units?.filter(u => u.occupancyStatus === 'VACANT').length || 0;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Helper to resolve image source
  const imageSrc = property.featuredImage
    ? property.featuredImage.startsWith('data:') || property.featuredImage.startsWith('/')
      ? property.featuredImage
      : `/uploads/${property.featuredImage}`
    : null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const result = await deletePropertyAction(property.id);
      if (result.success) {
        toast.success("Property deleted successfully");
        // Notify sidebar to refresh counts
        window.dispatchEvent(new CustomEvent("refresh-sidebar-stats"));

        if (onRefresh) {
          onRefresh();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to delete property");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden hover:border-[#12B76A]/30 transition-all group">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Image & Info */}
          <div className="p-4 flex gap-4 flex-1">
            <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-lg bg-[#F5F7FA] flex-shrink-0 overflow-hidden border border-[#EAECF0]">
               {imageSrc ? (
                  <img src={imageSrc} alt={property.propertyName} className="h-full w-full object-cover" />
               ) : (
                  <div className="h-full w-full flex items-center justify-center text-[#98A2B3]">
                     <Building2 className="h-8 w-8" />
                  </div>
               )}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#F0FDF4] text-[#12B76A] hover:bg-[#DCFCE7] border-none text-[9px] font-bold px-2 py-0 h-4 rounded-md">
                  {property.propertyType || "Residential"}
                </Badge>
              </div>

              <div className="truncate">
                <h3 className="text-[14px] font-bold text-[#1F2B3E] leading-tight truncate">
                  {property.propertyName} - {property.landlord?.name || property.description?.replace("Landlord: ", "") || "No Landlord"}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#667085] mt-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  <span>{property.city}{property.county ? `, ${property.county}` : ""}</span>
                  <span className="text-gray-300">•</span>
                  <Layers className="h-2.5 w-2.5" />
                  <span>{property.numberOfFloors || 1} floors</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border-[#DCE3EA] text-[#1F2B3E] font-bold text-[10px] gap-1.5 hover:bg-[#F9FAFB]" asChild>
                  <Link href={`/properties/${property.id}`}>
                    <Eye className="h-3 w-3" /> View property
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 rounded-lg border-[#DCE3EA] text-[#1F2B3E] font-bold text-[10px] gap-1.5 hover:bg-[#F9FAFB]"
                  onClick={() => onAddUnits(property.id)}
                >
                  <Plus className="h-3 w-3" /> Add units
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="h-7 px-3 rounded-lg border-rose-200 text-rose-600 font-bold text-[10px] gap-1.5 hover:bg-rose-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" /> {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>

          {/* Middle: Stats & Progress */}
          <div className="p-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#F2F4F7] bg-[#F9FAFB]/30 w-full lg:w-64">
             <div className="flex items-center gap-1.5 mb-3">
                <div className="bg-[#1F2B3E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Total {totalUnits}
                </div>
                <div className="bg-[#ECFDF3] text-[#027A48] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Occupied {occupiedUnits}
                </div>
                <div className="bg-[#FFF9F5] text-[#F38744] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Vacant {vacantUnits}
                </div>
             </div>

             <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-[#1F2B3E]">Occupancy</span>
                   <span className="text-[10px] font-black text-[#1F2B3E]">{occupancyRate}%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-1.5 w-full bg-[#EAECF0] rounded-full overflow-hidden">
                   <div
                     className="h-full bg-[#12B76A] transition-all duration-500"
                     style={{ width: `${occupancyRate}%` }}
                   />
                </div>
                <p className="text-[9px] font-medium text-[#667085]">{vacantUnits} vacant of {totalUnits}</p>
             </div>
          </div>

          {/* Right: Occupied/Vacant details */}
          <div className="p-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#F2F4F7] w-full lg:w-48">
             <div className="space-y-3">
                <div>
                   <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">OCCUPIED</p>
                   <p className="text-[10px] font-medium text-[#98A2B3] mt-0.5">
                     {occupiedUnits > 0 ? `${occupiedUnits} units occupied` : "No occupied units"}
                   </p>
                </div>
                <div>
                   <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">VACANT</p>
                   <p className="text-[10px] font-medium text-[#98A2B3] mt-0.5">
                     {vacantUnits > 0 ? `${vacantUnits} units ready` : "Fully occupied"}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
