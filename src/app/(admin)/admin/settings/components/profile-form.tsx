"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSuperAdminProfile } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await updateSuperAdminProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Full Name</Label>
          <Input
            name="name"
            defaultValue={profile.name || ""}
            className="border-2 font-medium focus-visible:ring-slate-900"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Phone Number</Label>
          <Input
            name="phone"
            defaultValue={profile.phone || ""}
            className="border-2 font-medium focus-visible:ring-slate-900"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Preferred Language</Label>
          <Select name="preferredLanguage" defaultValue={profile.preferredLanguage || "en"}>
            <SelectTrigger className="border-2 font-medium">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Swahili</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Time Zone</Label>
          <Select name="preferredTimeZone" defaultValue={profile.preferredTimeZone || "UTC"}>
            <SelectTrigger className="border-2 font-medium">
              <SelectValue placeholder="Select Time Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
              <SelectItem value="Africa/Nairobi">EAT (Nairobi, Kenya)</SelectItem>
              <SelectItem value="Europe/London">GMT/BST (London, UK)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-slate-900 font-black px-8"
          disabled={loading}
        >
          {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
