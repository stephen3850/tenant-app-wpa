"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { deletePropertyAction } from "@/features/properties/actions";

interface PropertyActionToolbarProps {
  propertyId: string;
}

export function PropertyActionToolbar({ propertyId }: PropertyActionToolbarProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deletePropertyAction(propertyId);
      if (result.success) {
        toast.success("Property deleted successfully");
        router.push("/properties");
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
    <Card className="border-[#DCE3EA] shadow-sm rounded-lg bg-white overflow-hidden print:hidden">
      <CardContent className="p-2 px-3 flex flex-nowrap items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Button variant="outline" asChild className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
          <Link href="/properties">
            <ArrowLeft className="h-3 w-3" /> Back to list
          </Link>
        </Button>

        <Button variant="outline" asChild className="h-8 rounded-lg border-[#BBF7D0] bg-[#F0FDF4] text-[#039855] font-bold text-[10px] gap-1.5 px-3 hover:bg-[#DCFCE7] shrink-0">
          <Link href={`/reports-property-revenue/${propertyId}`}>
            <BarChart3 className="h-3 w-3" /> Revenue report
          </Link>
        </Button>

        <Button variant="outline" asChild className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
          <Link href={`/dashboard?propertyId=${propertyId}`}>
            <Calendar className="h-3 w-3" /> Current month
          </Link>
        </Button>

        <Button variant="outline" onClick={() => toast.info("Edit functionality coming soon")} className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
          <Settings className="h-3 w-3" /> Edit
        </Button>

        <Button variant="outline" onClick={() => toast.info("Floors management coming soon")} className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
          <Layers className="h-3 w-3" /> Floors
        </Button>

        <Button variant="outline" asChild className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
           <Link href="/properties/import">
             <FileDown className="h-3 w-3" /> Import
           </Link>
        </Button>

        <Button asChild className="h-8 rounded-lg bg-[#1D6AE5] text-white font-bold text-[10px] gap-1.5 px-4 hover:bg-[#1656B9] shadow-sm shrink-0">
          <Link href={`/properties/${propertyId}/units/add`}>
            <Plus className="h-3 w-3" /> Add units
          </Link>
        </Button>

        <Button variant="outline" onClick={() => toast.info("Archive functionality coming soon")} className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-[10px] gap-1.5 px-3 hover:bg-slate-50 shrink-0">
          <Archive className="h-3 w-3" /> Archive
        </Button>

        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 rounded-lg border-[#FECACA] bg-[#FEF3F2] text-[#D92D20] font-bold text-[10px] gap-1.5 px-3 hover:bg-red-100 shrink-0"
        >
          <Trash2 className="h-3 w-3" /> {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardContent>
    </Card>
  );
}
