"use client";

import React from "react";
import { Plus, UserPlus, GitBranch, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function UnitHeader() {
  return (
    <Card className="border-[#E5EAF0] shadow-sm rounded-lg bg-white overflow-hidden">
      <CardContent className="p-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#56A600] uppercase tracking-wider">
            PORTFOLIO
          </p>
          <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            Units
          </h1>
          <p className="text-xs font-medium text-[#64748B]">
            Dedicated list of all units with occupancy, tenant, and billing details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* New Unit - Solid Green */}
          <Button asChild className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-9 px-4 rounded-md shadow-sm gap-2 text-xs">
            <Link href="/units/new">
              <Plus className="h-4 w-4" />
              <span>New Unit</span>
            </Link>
          </Button>

          {/* New Property - Outline */}
          <Button variant="outline" asChild className="h-9 px-4 rounded-md border border-[#56A600] text-[#56A600] font-bold hover:bg-[#56A600]/5 gap-2 text-xs bg-white">
            <Link href="/properties">
              <Building2 className="h-4 w-4" />
              <span>Properties</span>
            </Link>
          </Button>

          {/* Branches - Slate Outline */}
          <Button variant="outline" asChild className="h-9 px-4 rounded-md border border-[#64748B] text-[#1F2937] font-bold hover:bg-[#F8FAFC] gap-2 text-xs bg-white">
            <Link href="/properties/branches">
              <GitBranch className="h-4 w-4" />
              <span>Branches</span>
            </Link>
          </Button>

          {/* Utility Accounts - Slate Outline */}
          <Button variant="outline" asChild className="h-9 px-4 rounded-md border border-[#64748B] text-[#1F2937] font-bold hover:bg-[#F8FAFC] gap-2 text-xs bg-white">
            <Link href="/properties/utility-accounts">
              <Zap className="h-4 w-4" />
              <span>Utility accounts</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
