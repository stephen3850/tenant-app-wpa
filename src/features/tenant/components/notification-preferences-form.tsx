"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateNotificationPreferences, updateCommunicationPreferences } from "@/actions/tenant-profile";
import { useToast } from "@/hooks/use-toast";
import {
  BellRingIcon,
  MessageSquareIcon,
  MailIcon,
  SmartphoneIcon,
  SaveIcon,
  Loader2Icon,
  ShieldCheckIcon,
  FileTextIcon,
  CreditCardIcon,
  WrenchIcon,
  MegaphoneIcon,
  ClockIcon
} from "lucide-react";

export function NotificationPreferencesForm({ user }: { user: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const prefs = user.notificationPreferences || {};
  const tenant = user.tenantProfile;

  const [localPrefs, setLocalPrefs] = useState({
    inApp: prefs.inApp ?? true,
    email: prefs.email ?? true,
    sms: prefs.sms ?? false,
    invoiceAlerts: prefs.invoiceAlerts ?? true,
    paymentConfirmations: prefs.paymentConfirmations ?? true,
    leaseReminders: prefs.leaseReminders ?? true,
    maintenanceUpdates: prefs.maintenanceUpdates ?? true,
    announcementAlerts: prefs.announcementAlerts ?? true,
    securityNotices: prefs.securityNotices ?? true,
  });

  const [commPrefs, setCommPrefs] = useState({
    preferredContactMethod: tenant?.preferredContactMethod || "EMAIL",
    preferredContactHours: tenant?.preferredContactHours || "",
    marketingOptIn: tenant?.marketingOptIn ?? false,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        updateNotificationPreferences(localPrefs),
        updateCommunicationPreferences(commPrefs)
      ]);
      toast({
        title: "Preferences Saved",
        description: "Your notification and communication settings have been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                 <BellRingIcon className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-lg">Notification Channels</CardTitle>
                 <CardDescription>How would you like to receive updates?</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <SmartphoneIcon className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">In-App</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Push Alerts</p>
                    </div>
                 </div>
                 <Switch
                  checked={localPrefs.inApp}
                  onCheckedChange={(val) => setLocalPrefs({...localPrefs, inApp: val})}
                 />
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                       <MailIcon className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Email</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Direct Mail</p>
                    </div>
                 </div>
                 <Switch
                  checked={localPrefs.email}
                  onCheckedChange={(val) => setLocalPrefs({...localPrefs, email: val})}
                 />
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                       <MessageSquareIcon className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">SMS</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Text Messages</p>
                    </div>
                 </div>
                 <Switch
                  checked={localPrefs.sms}
                  onCheckedChange={(val) => setLocalPrefs({...localPrefs, sms: val})}
                 />
              </div>
           </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                 <SaveIcon className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-lg">Notification Types</CardTitle>
                 <CardDescription>Select which events trigger notifications.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { key: 'invoiceAlerts', label: 'Invoices & Billing', icon: FileTextIcon, color: 'text-blue-500' },
                { key: 'paymentConfirmations', label: 'Payment Confirmations', icon: CreditCardIcon, color: 'text-emerald-500' },
                { key: 'leaseReminders', label: 'Lease & Renewal Alerts', icon: ShieldCheckIcon, color: 'text-orange-500' },
                { key: 'maintenanceUpdates', label: 'Maintenance Updates', icon: WrenchIcon, color: 'text-purple-500' },
                { key: 'announcementAlerts', label: 'Management Announcements', icon: MegaphoneIcon, color: 'text-slate-500' },
                { key: 'securityNotices', label: 'Security & Safety Notices', icon: ClockIcon, color: 'text-red-500' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                   <div className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <Label htmlFor={item.key} className="text-sm font-bold text-slate-700 cursor-pointer">{item.label}</Label>
                   </div>
                   <Switch
                    id={item.key}
                    checked={(localPrefs as any)[item.key]}
                    onCheckedChange={(val) => setLocalPrefs({...localPrefs, [item.key]: val})}
                   />
                </div>
              ))}
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 font-bold px-8 shadow-md"
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
