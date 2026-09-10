"use client";

import React from "react";
import { UnitTable } from "./unit-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PropertyUnitsViewProps {
  propertyId: string;
  propertyName: string;
  units: any[];
}

export function PropertyUnitsView({ propertyId, propertyName, units }: PropertyUnitsViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Units in {propertyName}</CardTitle>
          <p className="text-sm text-muted-foreground">{units.length} total units</p>
        </div>
        <Button asChild size="sm">
          <Link href={`/units/new?propertyId=${propertyId}`}>
            <Plus className="mr-2 h-4 w-4" /> Add Unit
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <UnitTable data={units} onDelete={() => {}} />
      </CardContent>
    </Card>
  );
}
