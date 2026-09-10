"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface PropertyTableProps {
  data: any[];
  onDelete: (id: string) => void;
}

export function PropertyTable({ data, onDelete }: PropertyTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No properties found.</p>
        <Button variant="link" asChild>
          <Link href="/properties/new">Create your first property</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-wider text-[#667085]">Code</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Property Name</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Type</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Landlord</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Units</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-wider text-[#667085]">Status</TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-wider text-[#667085]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((property) => (
            <TableRow key={property.id} className="hover:bg-[#F5F7FA] transition-colors group">
              <TableCell className="font-bold text-[#1F2B3E] text-xs">
                 <div className="bg-[#F0FDF4] px-2 py-1 rounded text-[#12B76A] w-fit">
                    {property.propertyCode}
                 </div>
              </TableCell>
              <TableCell className="font-semibold text-[#1F2B3E] text-xs">{property.propertyName}</TableCell>
              <TableCell className="text-[#667085] text-xs font-medium">{property.propertyType}</TableCell>
              <TableCell className="text-[#667085] text-xs font-medium">
                 {property.landlordName || property.description?.replace("Landlord: ", "") || "Not Assigned"}
              </TableCell>
              <TableCell className="text-[#1F2B3E] text-xs font-bold">{property._count?.units || 0}</TableCell>
              <TableCell>
                <Badge variant={property.status === "ACTIVE" ? "default" : "secondary"} className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  property.status === "ACTIVE" ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]" : "bg-[#F2F4F7] text-[#344054] border-[#D0D5DD]"
                )}>
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/properties/${property.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/properties/${property.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
