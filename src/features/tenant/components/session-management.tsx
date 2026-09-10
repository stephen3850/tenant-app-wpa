"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getActiveSessions, revokeSession } from "@/actions/tenant-profile";
import { useToast } from "@/hooks/use-toast";
import {
  MonitorIcon,
  SmartphoneIcon,
  GlobeIcon,
  ClockIcon,
  ShieldXIcon,
  RefreshCwIcon,
  Loader2Icon,
  LogOutIcon
} from "lucide-react";

export function SessionManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getActiveSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (token: string) => {
    setRevoking(token);
    try {
      await revokeSession(token);
      toast({
        title: "Session Revoked",
        description: "That device has been signed out successfully.",
      });
      fetchSessions();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      });
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <MonitorIcon className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Active Sessions</CardTitle>
                    <CardDescription>Devices currently signed in to your account.</CardDescription>
                 </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSessions} disabled={loading} className="h-8">
                 {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <RefreshCwIcon className="h-4 w-4" />}
              </Button>
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-slate-100">
              {sessions.map((session) => (
                <div key={session.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                         {session.userAgent?.includes('Mobile') ? <SmartphoneIcon className="h-6 w-6" /> : <MonitorIcon className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            <p className="font-bold text-slate-900">{session.userAgent?.split(' ')[0] || 'Unknown Browser'}</p>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] uppercase font-bold">
                               {session.ipAddress || 'Unknown IP'}
                            </Badge>
                         </div>
                         <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                               <GlobeIcon className="h-3 w-3" />
                               Lagos, Nigeria (Estimated)
                            </span>
                            <span className="flex items-center gap-1.5">
                               <ClockIcon className="h-3 w-3" />
                               Last active: {new Date(session.lastActiveAt).toLocaleString()}
                            </span>
                         </div>
                      </div>
                   </div>
                   <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
                    onClick={() => handleRevoke(session.sessionToken)}
                    disabled={revoking === session.sessionToken}
                   >
                      {revoking === session.sessionToken ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <LogOutIcon className="h-4 w-4 mr-2" />}
                      Revoke
                   </Button>
                </div>
              ))}
              {sessions.length === 0 && !loading && (
                <div className="p-12 text-center space-y-3">
                   <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto">
                      <ShieldXIcon className="h-8 w-8 text-slate-300" />
                   </div>
                   <p className="text-slate-500 font-medium">No other active sessions found.</p>
                </div>
              )}
              {loading && sessions.length === 0 && (
                <div className="p-12 text-center">
                   <Loader2Icon className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                </div>
              )}
           </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-4 flex justify-end">
           <Button variant="destructive" size="sm" className="font-bold">
              Revoke All Other Sessions
           </Button>
        </CardFooter>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
         <CardContent className="p-4 flex gap-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg h-fit">
               <ShieldXIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
               <p className="text-sm font-bold text-amber-900">Recognize something unfamiliar?</p>
               <p className="text-xs text-amber-700 leading-relaxed">
                  If you see a session you don't recognize, revoke it immediately and change your password.
                  This will ensure only you have access to your account.
               </p>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
