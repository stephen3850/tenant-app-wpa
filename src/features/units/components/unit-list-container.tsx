"use client";

import React, { useState } from "react";
import { UnitTable } from "./unit-table";
import { UnitFilters } from "./unit-filters";
import { UnitBulkActions } from "./unit-bulk-actions";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface UnitListContainerProps {
  initialUnits: any[];
  properties: any[];
  initialFilters: any;
}

export function UnitListContainer({
  initialUnits,
  properties,
  initialFilters,
}: UnitListContainerProps) {
  const [units, setUnits] = useState(initialUnits);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState(initialFilters);

  const handleArchive = (ids: string[]) => {
    toast.success(`Archived ${ids.length} units`);
    setSelectedIds([]);
    // In a real app, call a server action and refresh data
  };

  const handleUpdateStatus = (ids: string[], status: string) => {
    toast.success(`Updated ${ids.length} units to ${status}`);
    setSelectedIds([]);
  };

  const handleExport = () => {
    toast.info("Exporting units...");
  };

  const handleImport = () => {
    toast.info("Import feature coming soon");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <UnitBulkActions
          selectedIds={selectedIds}
          onArchive={handleArchive}
          onUpdateStatus={handleUpdateStatus}
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <UnitFilters
            properties={properties}
            filters={filters}
            setFilters={setFilters}
          />
          <UnitTable
            data={units}
            onDelete={(id) => toast.error("Delete not implemented")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
