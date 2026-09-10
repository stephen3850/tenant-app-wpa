"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionAccountsViewProps {
  onBack: () => void;
}

export function CollectionAccountsView({ onBack }: CollectionAccountsViewProps) {
  const [loading, setLoading] = useState(false);

  // Mock data for now based on the screenshot columns
  const accounts: any[] = [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full">
              SETTINGS • PAYMENTS
            </Badge>
          </div>
          <h2 className="text-[24px] font-bold text-slate-800 tracking-tight leading-tight">Collection Accounts</h2>
          <p className="text-[13px] text-slate-500 font-medium tracking-tight">
            Set the default accounts tenants use to pay, then add property-specific overrides only where needed.
          </p>
        </div>

        <div className="flex items-center gap-2">
           <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">TOTAL:</span>
             <span className="text-[12px] font-bold text-slate-700">0</span>
           </div>
           <Button className="bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold h-10 px-5 rounded-lg text-[12px] gap-2 shadow-sm">
             <Plus className="h-4 w-4" />
             Add account
           </Button>
           <Button variant="ghost" onClick={onBack} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-4 rounded-lg text-[12px] gap-2">
             <ChevronLeft className="h-4 w-4" />
             Back
           </Button>
        </div>
      </div>

      {/* Saved Accounts Card */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl overflow-hidden border">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">Saved collection accounts</h3>
            <p className="text-[12px] text-slate-500 font-medium tracking-tight">
              Leave the property scope as <span className="font-bold text-slate-700">All properties</span> for the business default. Select a property only when that property has its own paybill, till, or bank account.
            </p>
          </div>
          <Button className="bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold h-9 px-4 rounded-lg text-[11px] gap-2 shadow-sm">
             <Plus className="h-3.5 w-3.5" />
             Add account
           </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-slate-50">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">#</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account name</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scope</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account format</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paybill</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Representative</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[12px] text-slate-400 font-medium bg-white">
                    No collection accounts yet.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, idx) => (
                  <tr key={acc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[12px] font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                       <span className="text-[12px] font-bold text-slate-700">{acc.name}</span>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600">
                         {acc.scope || "All properties"}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] font-medium text-slate-600">{acc.format}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] font-bold text-slate-700">{acc.paybill}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] font-bold text-slate-700">{acc.account}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] font-medium text-slate-600">{acc.representative}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" className="h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                         <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Spacing */}
      <div className="h-10" />
    </div>
  );
}
