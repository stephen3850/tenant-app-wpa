"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { changePassword, toggleMFA } from "@/actions/tenant-profile";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheckIcon,
  KeyRoundIcon,
  SmartphoneIcon,
  HistoryIcon,
  Loader2Icon,
  LockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ShieldAlertIcon
} from "lucide-react";
import { useRouter } from "next/navigation";

export function SecuritySettings({ user }: { user: any }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const currentPass = formData.get("currentPass") as string;
    const newPass = formData.get("newPass") as string;
    const confirmPass = formData.get("confirmPass") as string;

    if (newPass !== confirmPass) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await changePassword(currentPass, newPass);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMfaToggle = async (enabled: boolean) => {
    setMfaLoading(true);
    try {
      await toggleMFA(enabled);
      toast({
        title: enabled ? "MFA Enabled" : "MFA Disabled",
        description: enabled ? "Your account is now more secure." : "Two-factor authentication has been turned off.",
      });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to toggle MFA",
        variant: "destructive",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <KeyRoundIcon className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Authentication</CardTitle>
                    <CardDescription>Secure your account with a strong password.</CardDescription>
                 </div>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPass" className="text-xs font-bold uppercase text-slate-500">Current Password</Label>
                <div className="relative">
                   <Input id="currentPass" name="currentPass" type="password" required className="bg-white border-slate-200 pl-10" />
                   <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPass" className="text-xs font-bold uppercase text-slate-500">New Password</Label>
                <div className="relative">
                   <Input id="newPass" name="newPass" type="password" required className="bg-white border-slate-200 pl-10" />
                   <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPass" className="text-xs font-bold uppercase text-slate-500">Confirm New Password</Label>
                <div className="relative">
                   <Input id="confirmPass" name="confirmPass" type="password" required className="bg-white border-slate-200 pl-10" />
                   <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full font-bold">
                 {loading ? <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheckIcon className="h-4 w-4 mr-2" />}
                 Update Password
              </Button>
           </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                 <SmartphoneIcon className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-lg">Two-Factor Authentication (MFA)</CardTitle>
                 <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-between">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <p className="font-bold text-slate-900">Multi-Factor Authentication</p>
                 {user.mfaEnabled ? (
                   <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 uppercase font-bold text-[10px]">
                      Enabled
                   </Badge>
                 ) : (
                   <Badge variant="secondary" className="bg-slate-100 text-slate-500 uppercase font-bold text-[10px]">
                      Disabled
                   </Badge>
                 )}
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                 MFA is currently {user.mfaEnabled ? 'protecting' : 'not enabled for'} your account. We recommend enabling it for enhanced security.
              </p>
           </div>
           <div className="flex items-center gap-3">
              {mfaLoading && <Loader2Icon className="h-4 w-4 animate-spin text-blue-500" />}
              <Switch checked={user.mfaEnabled} onCheckedChange={handleMfaToggle} disabled={mfaLoading} />
           </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                 <HistoryIcon className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-lg">Recent Login Activity</CardTitle>
                 <CardDescription>Monitor your account for unauthorized access.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-slate-100">
              {user.loginHistory?.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                         {log.status === 'SUCCESS' ? <CheckCircle2Icon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">
                            {log.status === 'SUCCESS' ? 'Successful Login' : 'Failed Login Attempt'}
                         </p>
                         <p className="text-xs text-slate-500 font-medium">
                            {log.ipAddress} • {log.userAgent?.split(' ')[0] || 'Unknown Browser'}
                         </p>
                      </div>
                   </div>
                   <p className="text-xs text-slate-400 font-bold uppercase">
                      {new Date(log.createdAt).toLocaleString()}
                   </p>
                </div>
              ))}
              {(!user.loginHistory || user.loginHistory.length === 0) && (
                <div className="p-8 text-center text-slate-400 text-sm font-medium">
                   No recent activity recorded.
                </div>
              )}
           </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-4 flex justify-center">
           <Button variant="link" size="sm" className="text-xs font-bold text-blue-600">
              View Detailed Security Log
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
