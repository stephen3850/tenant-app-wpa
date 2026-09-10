"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { enableLandlordMFA, disableLandlordMFA } from "@/actions/landlord-profile";
import { ShieldCheckIcon, ShieldXIcon } from "lucide-react";

export function MfaToggle({ enabled }: { enabled: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsLoading(true);
    try {
      if (checked) {
        await enableLandlordMFA();
        toast.success("MFA Enabled");
      } else {
        await disableLandlordMFA();
        toast.success("MFA Disabled");
      }
    } catch (error) {
      toast.error("Failed to update MFA settings");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${enabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            {enabled ? <ShieldCheckIcon className="h-6 w-6" /> : <ShieldXIcon className="h-6 w-6" />}
        </div>
        <div>
          <Label className="text-base font-black text-slate-900">Two-Factor Authentication</Label>
          <p className="text-sm font-medium text-slate-500">
            Secure your account with a secondary verification method.
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
