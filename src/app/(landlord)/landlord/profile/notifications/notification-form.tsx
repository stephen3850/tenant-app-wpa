"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { updateLandlordNotificationPreferences } from "@/actions/landlord-profile";
import { Loader2Icon, MailIcon, BellIcon, MessageSquareIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const notificationSchema = z.object({
  inApp: z.boolean().default(true),
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  invoiceAlerts: z.boolean().default(true),
  paymentConfirmations: z.boolean().default(true),
  leaseReminders: z.boolean().default(true),
  maintenanceUpdates: z.boolean().default(true),
  announcementAlerts: z.boolean().default(true),
  securityNotices: z.boolean().default(true),
  financialReports: z.boolean().default(true),
  statementAvailability: z.boolean().default(true),
  complianceNotices: z.boolean().default(true),
  communications: z.boolean().default(true),
});

export function NotificationForm({ preferences }: { preferences: any }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      inApp: preferences.inApp ?? true,
      email: preferences.email ?? true,
      sms: preferences.sms ?? false,
      invoiceAlerts: preferences.invoiceAlerts ?? true,
      paymentConfirmations: preferences.paymentConfirmations ?? true,
      leaseReminders: preferences.leaseReminders ?? true,
      maintenanceUpdates: preferences.maintenanceUpdates ?? true,
      announcementAlerts: preferences.announcementAlerts ?? true,
      securityNotices: preferences.securityNotices ?? true,
      financialReports: preferences.financialReports ?? true,
      statementAvailability: preferences.statementAvailability ?? true,
      complianceNotices: preferences.complianceNotices ?? true,
      communications: preferences.communications ?? true,
    },
  });

  async function onSubmit(data: z.infer<typeof notificationSchema>) {
    setLoading(true);
    try {
      await updateLandlordNotificationPreferences(data);
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Notification Channels</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FormField
                control={form.control}
                name="inApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white shadow-sm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <BellIcon className="h-4 w-4 text-blue-600" />
                        <FormLabel className="font-bold text-slate-900">In-App</FormLabel>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white shadow-sm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-blue-600" />
                        <FormLabel className="font-bold text-slate-900">Email</FormLabel>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white shadow-sm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <MessageSquareIcon className="h-4 w-4 text-blue-600" />
                        <FormLabel className="font-bold text-slate-900">SMS</FormLabel>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Notification Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="financialReports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Financial Reports</FormLabel>
                    <FormDescription className="text-xs font-medium">Monthly and annual financial performance summaries.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statementAvailability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Statement Availability</FormLabel>
                    <FormDescription className="text-xs font-medium">Alerts when new owner statements are ready for review.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaseReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Lease Alerts</FormLabel>
                    <FormDescription className="text-xs font-medium">Notifications about expiring leases and renewals.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maintenanceUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Maintenance Alerts</FormLabel>
                    <FormDescription className="text-xs font-medium">Updates on critical maintenance issues and work orders.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="complianceNotices"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Compliance Notices</FormLabel>
                    <FormDescription className="text-xs font-medium">Legal and regulatory compliance alerts for your properties.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Communications</FormLabel>
                    <FormDescription className="text-xs font-medium">Messages from property managers and system announcements.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="securityNotices"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-slate-900">Security Notices</FormLabel>
                    <FormDescription className="text-xs font-medium">Urgent security incidents or alerts related to your properties.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8"
        >
          {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </form>
    </Form>
  );
}
