"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function SecurityLoginView() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-[24px] font-bold text-slate-800 tracking-tight leading-tight">Two-Step Verification</h2>
        <p className="text-[13px] text-slate-500 font-medium tracking-tight">
          Control the extra login protection for your account.
        </p>
      </div>

      <Card className="border-slate-100 shadow-none bg-white rounded-xl p-8 border">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">Two-step verification</h3>
            <p className="text-[12px] text-slate-500 font-medium tracking-tight leading-relaxed max-w-2xl">
              Control the extra login step (one-time code) for your account. This setting is only available to Business Owner and Property Manager roles.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Checkbox
              id="mfa"
              checked={enabled}
              onCheckedChange={(v) => setEnabled(!!v)}
              className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#12B76A] data-[state=checked]:border-[#12B76A]"
            />
            <div className="flex items-center gap-2">
              <label htmlFor="mfa" className="text-[14px] font-bold text-slate-800 cursor-pointer">
                Require a code at login
              </label>
              <span className="text-[12px] text-slate-400 font-medium">Disabled</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
