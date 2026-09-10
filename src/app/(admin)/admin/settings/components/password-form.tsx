"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeSuperAdminPassword } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { RefreshCw, ShieldKeyhole } from "lucide-react";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await changeSuperAdminPassword(oldPassword, newPassword);
      toast.success("Password updated successfully");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-bold text-slate-700">Current Password</Label>
        <Input
          type="password"
          name="oldPassword"
          className="border-2 focus-visible:ring-slate-900"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="font-bold text-slate-700">New Password</Label>
        <Input
          type="password"
          name="newPassword"
          className="border-2 focus-visible:ring-slate-900"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="font-bold text-slate-700">Confirm New Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          className="border-2 focus-visible:ring-slate-900"
          required
        />
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-slate-900 font-black"
          disabled={loading}
        >
          {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ShieldKeyhole className="mr-2 h-4 w-4" />}
          Update Password
        </Button>
      </div>
    </form>
  );
}
