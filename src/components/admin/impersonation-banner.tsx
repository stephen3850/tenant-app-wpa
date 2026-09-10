"use client";

import { useEffect, useState } from "react";
import { getActiveImpersonationSession, stopImpersonation } from "@/actions/impersonation";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldAlert, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export function ImpersonationBanner() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const activeSession = await getActiveImpersonationSession();
      setSession(activeSession);
    };

    fetchSession();
    const interval = setInterval(fetchSession, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleStop = async () => {
    await stopImpersonation();
    setSession(null);
    router.refresh();
  };

  if (!session) return null;

  return (
    <div className="bg-rose-600 text-white py-2 px-8 flex items-center justify-between shadow-lg sticky top-0 z-[100]">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-1.5 rounded-lg animate-pulse">
            <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="text-sm">
            <span className="font-black uppercase tracking-wider">Impersonation Active:</span>
            <span className="ml-2 font-medium opacity-90">
                You are currently acting as <span className="font-bold underline">{session.targetUser.name}</span> ({session.targetUser.email})
            </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold bg-black/20 px-3 py-1.5 rounded-full">
            <Timer className="w-4 h-4" />
            Expires in {formatDistanceToNow(new Date(session.expiresAt))}
        </div>
        <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
            className="bg-white text-rose-600 font-black hover:bg-slate-100 hover:text-rose-700 transition-all px-4"
        >
            <LogOut className="w-4 h-4 mr-2" />
            EXIT SESSION
        </Button>
      </div>
    </div>
  );
}
