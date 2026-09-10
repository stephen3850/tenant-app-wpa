"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UnitStatsCardsProps {
  stats: {
    total: number;
    occupied: number;
    vacant: number;
  };
}

export function UnitStatsCards({ stats }: UnitStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard
        label="TOTAL UNITS"
        value={stats.total}
        description="Every unit in the current scope."
        badgeText="All"
        badgeColor="bg-[#2D3748]"
      />
      <KPICard
        label="OCCUPIED"
        value={stats.occupied}
        description="Units with active occupancy."
        badgeText="Filter"
        badgeColor="bg-[#22C55E]"
      />
      <KPICard
        label="VACANT"
        value={stats.vacant}
        description="Units currently available."
        badgeText="Filter"
        badgeColor="bg-[#F97316]"
      />
    </div>
  );
}

function KPICard({ label, value, description, badgeText, badgeColor }: any) {
  return (
    <Card className="border-[#E5EAF0] shadow-sm rounded-md bg-white overflow-hidden">
      <CardContent className="p-5">
        <div className="space-y-1">
          {/* Label at the top */}
          <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
            {label}
          </p>

          {/* Number and Badge in the middle */}
          <div className="flex items-center justify-between">
            <h4 className="text-4xl font-bold text-[#1F2937] tabular-nums">
              {value}
            </h4>
            <div className={cn(
              "px-3 py-1 rounded text-[10px] font-bold text-white uppercase",
              badgeColor
            )}>
              {badgeText}
            </div>
          </div>

          {/* Description at the bottom */}
          <p className="pt-2 text-[11px] font-medium text-[#667085]">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
