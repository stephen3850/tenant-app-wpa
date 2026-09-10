"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface RolesPermissionsViewProps {
  onBack: () => void;
  onOpenTemplates: () => void;
}

const ROLES = [
  { id: 1, name: "Field Officer", key: "agent" },
  { id: 2, name: "Operations", key: "operation_team" },
  { id: 3, name: "Landlord", key: "landlord" },
  { id: 4, name: "Utility Team", key: "electricity_team" },
  { id: 5, name: "Finance", key: "finance" },
  { id: 6, name: "Property Manager", key: "manager" },
  { id: 7, name: "Security Chief", key: "security_chief" },
  { id: 8, name: "Security Intern", key: "security_intern" },
  { id: 9, name: "Control Room", key: "control_room" },
  { id: 10, name: "Security Vendor", key: "security_vendor" },
];

export function RolesPermissionsView({ onBack, onOpenTemplates }: RolesPermissionsViewProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-none">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BUSINESS OWNER CONTROLS</p>
          <h2 className="text-[20px] font-bold text-slate-800 tracking-tight leading-tight">Role Labels & Permissions</h2>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">Rename role labels and control capability text used by access checks.</p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="h-8 px-4 rounded-md border-slate-200 text-[11px] font-bold text-slate-700 gap-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to settings
        </Button>
      </div>

      {/* Roles List Card */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl overflow-hidden border">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-bold text-slate-800 tracking-tight">Roles</h3>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Open one role to view and check its feature permissions.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#F0FDF4] text-[#12B76A] px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-[#DCFCE7]">
              10 roles
            </div>
            <Button
              variant="outline"
              onClick={onOpenTemplates}
              className="h-8 px-4 rounded-md border-slate-200 text-[11px] font-bold text-slate-700"
            >
              Role templates
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-slate-50">
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-16">#</th>
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">System key</th>
                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ROLES.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-[12px] font-medium text-slate-400">{role.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-slate-700 group-hover:text-slate-900">{role.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-slate-400 font-mono tracking-tight">{role.key}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      className="h-7 px-3.5 rounded-md border-[#12B76A] text-[#12B76A] hover:bg-[#F0FDF4] text-[10px] font-bold transition-all active:scale-95"
                    >
                      View permissions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
