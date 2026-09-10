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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { updateLandlordCommunicationPreferences } from "@/actions/landlord-profile";
import { Loader2Icon } from "lucide-react";

const communicationSchema = z.object({
  preferredLanguage: z.string().default("en"),
  preferredTimeZone: z.string().default("UTC"),
  marketingOptIn: z.boolean().default(false),
});

export function CommunicationForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof communicationSchema>>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      preferredLanguage: profile.preferredLanguage || "en",
      preferredTimeZone: profile.preferredTimeZone || "UTC",
      marketingOptIn: profile.marketingOptIn ?? false,
    },
  });

  async function onSubmit(data: z.infer<typeof communicationSchema>) {
    setLoading(true);
    try {
      await updateLandlordCommunicationPreferences(data);
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="preferredLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Preferred Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="font-medium">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English (UK)</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredTimeZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Time Zone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="font-medium">
                      <SelectValue placeholder="Select a time zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (Universal)</SelectItem>
                    <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="marketingOptIn"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="font-bold text-slate-900">Marketing Communications</FormLabel>
                <FormDescription className="text-xs font-medium">
                  Receive updates about new features, industry insights, and special offers.
                </FormDescription>
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

        <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8"
        >
          {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Update Preferences
        </Button>
      </form>
    </Form>
  );
}

import { FormMessage } from "@/components/ui/form";
