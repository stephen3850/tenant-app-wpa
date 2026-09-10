"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export function MfaToggle({ enabled }: { enabled: boolean }) {
  const [isMfaEnabled, setIsMfaEnabled] = useState(enabled);

  const handleToggle = async () => {
    // In a real app, this would open a modal to setup MFA or confirm deactivation
    toast.info("MFA setup workflow will be triggered here.");
    // setIsMfaEnabled(!isMfaEnabled);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        {isMfaEnabled ? (
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-rose-500" />
        )}
        <div>
           <p className="text-sm font-black text-slate-900">MFA Status</p>
           <p className="text-xs font-bold text-slate-500">{isMfaEnabled ? "Currently active" : "Not protected"}</p>
        </div>
      </div>
      <Switch
        checked={isMfaEnabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
