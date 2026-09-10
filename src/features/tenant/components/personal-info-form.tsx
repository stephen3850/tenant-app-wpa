"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { updatePersonalInformation } from "@/actions/tenant-profile";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon, SaveIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, HeartPulseIcon } from "lucide-react";

export function PersonalInfoForm({ user }: { user: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const tenant = user.tenantProfile;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await updatePersonalInformation(data);
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <UserIcon className="h-5 w-5" />
             </div>
             <div>
                <CardTitle className="text-lg">Personal Details</CardTitle>
                <CardDescription>Update your contact information and preferences.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                 <MailIcon className="h-3 w-3" /> Email Address
              </Label>
              <Input
                id="email"
                name="email"
                defaultValue={user.email}
                className="bg-white border-slate-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                 <PhoneIcon className="h-3 w-3" /> Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone || tenant?.phone}
                className="bg-white border-slate-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage" className="text-xs font-bold uppercase text-slate-500">Language</Label>
              <Select name="preferredLanguage" defaultValue={user.preferredLanguage || "English"}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTimeZone" className="text-xs font-bold uppercase text-slate-500">Timezone</Label>
              <Select name="preferredTimeZone" defaultValue={user.preferredTimeZone || "UTC"}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
               <MapPinIcon className="h-3 w-3" /> Mailing Address
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="md:col-span-1">
                 <Input
                   id="address"
                   name="address"
                   placeholder="Postal Address"
                   defaultValue={tenant?.postalAddress}
                   className="bg-white border-slate-200"
                 />
               </div>
               <Input
                 name="city"
                 placeholder="City"
                 defaultValue={tenant?.city}
                 className="bg-white border-slate-200"
               />
               <Input
                 name="county"
                 placeholder="County/State"
                 defaultValue={tenant?.county}
                 className="bg-white border-slate-200"
               />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <HeartPulseIcon className="h-5 w-5" />
             </div>
             <div>
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
                <CardDescription>Who should we contact in case of emergency?</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="text-xs font-bold uppercase text-slate-500">Contact Name</Label>
                <Input
                  id="emergencyName"
                  name="emergencyName"
                  defaultValue={tenant?.emergencyName}
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-xs font-bold uppercase text-slate-500">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  defaultValue={tenant?.emergencyPhone}
                  className="bg-white border-slate-200"
                />
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
