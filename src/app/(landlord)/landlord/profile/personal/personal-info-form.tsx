"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateLandlordProfile } from "@/actions/landlord-profile";
import { Loader2Icon } from "lucide-react";

const personalInfoSchema = z.z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  mailingAddress: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm({ profile }: { profile: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      mailingAddress: (profile as any).mailingAddress || "",
      emergencyContactName: (profile as any).emergencyContactName || "",
      emergencyContactPhone: (profile as any).emergencyContactPhone || "",
    },
  });

  async function onSubmit(data: PersonalInfoValues) {
    setLoading(true);
    try {
      await updateLandlordProfile(data);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <Input {...field} className="font-medium focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="font-medium bg-slate-50 cursor-not-allowed" />
                </FormControl>
                <FormDescription>
                  Changing your email requires management approval.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} className="font-medium focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mailingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Mailing Address</FormLabel>
                <FormControl>
                  <Input {...field} className="font-medium focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="font-medium focus-visible:ring-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Contact Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="font-medium focus-visible:ring-blue-500" />
                  </FormControl>
                  <FormMessage />
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
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
