"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Ban, Unlock, Users } from "lucide-react";
import { StartImpersonationDialog } from "./start-impersonation-dialog";

interface UserActionToolbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    organizationName: string;
  };
}

export function UserActionToolbar({ user }: UserActionToolbarProps) {
  const [impersonationOpen, setImpersonationOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button
            variant="outline"
            className="font-bold border-slate-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={() => setImpersonationOpen(true)}
        >
            <Users className="w-4 h-4 mr-2" />
            Impersonate
        </Button>
        <Button variant="outline" className="font-bold border-slate-200">
            <LogOut className="w-4 h-4 mr-2" />
            Terminate Sessions
        </Button>
        {user.status === "ACTIVE" ? (
            <Button variant="destructive" className="font-bold">
                <Ban className="w-4 h-4 mr-2" />
                Suspend User
            </Button>
        ) : (
            <Button variant="outline" className="font-bold border-slate-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                <Unlock className="w-4 h-4 mr-2" />
                Reactivate User
            </Button>
        )}
      </div>

      <StartImpersonationDialog
        user={user}
        open={impersonationOpen}
        onOpenChange={setImpersonationOpen}
      />
    </>
  );
}
