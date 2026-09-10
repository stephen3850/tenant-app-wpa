"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { revokeSuperAdminSession } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { Monitor, Smartphone, Globe, LogOut, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function SessionList({ sessions }: { sessions: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRevoke = async (token: string) => {
    setLoading(token);
    try {
      await revokeSuperAdminSession(token);
      toast.success("Session revoked successfully");
    } catch (error) {
      toast.error("Failed to revoke session");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-50 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Device / Browser</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">IP Address</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Last Active</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center font-medium text-slate-500 italic">
                No active sessions found.
              </TableCell>
            </TableRow>
          )}
          {sessions.map((session) => (
            <TableRow key={session.id} className="hover:bg-slate-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {session.userAgent?.toLowerCase().includes("mobile") ? (
                      <Smartphone className="h-4 w-4 text-slate-600" />
                    ) : (
                      <Monitor className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">{session.userAgent?.split(" ")[0] || "Unknown Device"}</span>
                    <span className="text-xs font-bold text-slate-500">Last active via {session.userAgent?.includes("Chrome") ? "Chrome" : "Browser"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-black text-slate-700">{session.ipAddress || "Unknown"}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Globe className="h-3 w-3" />
                    <span>Nairobi, KE</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600">{formatDate(session.lastActiveAt)}</span>
                  <Badge className="w-fit bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase">Active Now</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 font-bold hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => handleRevoke(session.sessionToken)}
                  disabled={loading === session.sessionToken}
                >
                  {loading === session.sessionToken ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
