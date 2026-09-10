"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateSuperAdminNotificationPreferences } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { Save, RefreshCw, ShieldAlert, Activity, CreditCard, HelpCircle, Zap, BellRing } from "lucide-react";

export function NotificationForm({ preferences }: { preferences: any }) {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState(preferences || {
    inApp: true,
    email: true,
    sms: false,
    securityNotices: true,
    financialReports: true,
    complianceNotices: true,
  });

  const handleToggle = (key: string) => {
    setPrefs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSuperAdminNotificationPreferences(prefs);
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "securityNotices", label: "Security & MFA Alerts", icon: ShieldAlert, color: "text-rose-600" },
    { key: "complianceNotices", label: "System Health & Incidents", icon: Activity, color: "text-amber-600" },
    { key: "financialReports", label: "Billing & Revenue Alerts", icon: CreditCard, color: "text-emerald-600" },
    { key: "communications", label: "Support Escalations", icon: HelpCircle, color: "text-blue-600" },
    { key: "announcementAlerts", label: "Feature Rollouts", icon: Zap, color: "text-indigo-600" },
    { key: "invoiceAlerts", label: "Platform Maintenance", icon: BellRing, color: "text-slate-600" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Delivery Channels</h4>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-slate-700">In-App Notifications</Label>
                <Switch checked={prefs.inApp} onCheckedChange={() => handleToggle("inApp")} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-bold text-slate-700">Email Notifications</Label>
                <Switch checked={prefs.email} onCheckedChange={() => handleToggle("email")} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-bold text-slate-700">SMS Notifications</Label>
                <Switch checked={prefs.sms} onCheckedChange={() => handleToggle("sms")} />
              </div>
           </div>
        </div>

        <div className="md:col-span-2 space-y-4">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Notification Types</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-start justify-between gap-4">
                   <div className="flex gap-3">
                      <div className={`mt-1 ${cat.color}`}>
                        <cat.icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="font-bold text-slate-900">{cat.label}</Label>
                        <p className="text-[10px] font-medium text-slate-500">Receive alerts for this category.</p>
                      </div>
                   </div>
                   <Switch checked={!!prefs[cat.key]} onCheckedChange={() => handleToggle(cat.key)} />
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="flex justify-end border-t pt-8">
        <Button
          className="bg-slate-900 font-black px-8"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
