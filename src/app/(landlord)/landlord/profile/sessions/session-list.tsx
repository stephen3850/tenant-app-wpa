"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { revokeLandlordSession } from "@/actions/landlord-profile";
import {
    MonitorIcon,
    SmartphoneIcon,
    LogOutIcon,
    ShieldIcon,
    MapPinIcon,
    ClockIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SessionList({ sessions }: { sessions: any[] }) {
  const [revoking, setRevoking] = useState<string | null>(null);

  async function onRevoke(token: string) {
    setRevoking(token);
    try {
      await revokeLandlordSession(token);
      toast.success("Session revoked successfully");
    } catch (error) {
      toast.error("Failed to revoke session");
    } finally {
      setRevoking(null);
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 border border-dashed rounded-xl">
        <p className="text-slate-500 font-medium">No active sessions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => {
        const isCurrent = index === 0; // Assuming the first one is current for UI demo purposes, or we could pass current token

        return (
          <div
            key={session.id}
            className="flex items-center justify-between p-5 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                {session.userAgent?.includes("Mobile") ? (
                  <SmartphoneIcon className="h-6 w-6" />
                ) : (
                  <MonitorIcon className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">
                    {session.userAgent?.split("(")[0] || "Unknown Browser"}
                  </span>
                  {isCurrent && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-black text-[10px] uppercase tracking-tighter">
                      Current Session
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <MapPinIcon className="h-3 w-3" />
                        {session.ipAddress || "Unknown Location"}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <ClockIcon className="h-3 w-3" />
                        Last active {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                    </div>
                </div>
              </div>
            </div>
            {!isCurrent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRevoke(session.sessionToken)}
                disabled={revoking === session.sessionToken}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold"
              >
                {revoking === session.sessionToken ? (
                  "Revoking..."
                ) : (
                  <>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Revoke
                  </>
                )}
              </Button>
            )}
            {isCurrent && (
                <div className="p-2 text-slate-300">
                    <ShieldIcon className="h-5 w-5" />
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
