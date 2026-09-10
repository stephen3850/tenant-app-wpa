"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { restorePropertyAction, permanentDeletePropertyAction } from "@/features/properties/actions";
import { restoreUnitAction, permanentDeleteUnitAction } from "@/features/units/actions";
import { restoreLeaseAction, permanentDeleteLeaseAction } from "@/features/leases/actions/lease-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { verifyPassword } from "@/actions/auth";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchiveActionsProps {
  id: string;
  type: string;
}

export function ArchiveActions({ id, type }: ArchiveActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [actionType, setActionType] = useState<"restore" | "delete" | null>(null);

  const openConfirmDialog = (type: "restore" | "delete") => {
    setActionType(type);
    setShowPasswordDialog(true);
  };

  const handleConfirm = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }

    setIsPending(true);
    try {
      // 1. Verify Password
      const verify = await verifyPassword(password);
      if (verify?.error) {
        toast.error(verify.error);
        setIsPending(false);
        return;
      }

      // 2. Perform Action
      let result;
      if (actionType === 'restore') {
        if (type === 'properties') {
          result = await restorePropertyAction(id);
        } else if (type === 'units') {
          result = await restoreUnitAction(id);
        } else if (type === 'leases') {
          result = await restoreLeaseAction(id);
        }
      } else if (actionType === 'delete') {
        if (type === 'properties') {
          result = await permanentDeletePropertyAction(id);
        } else if (type === 'units') {
          result = await permanentDeleteUnitAction(id);
        } else if (type === 'leases') {
          result = await permanentDeleteLeaseAction(id);
        }
      }

      if (result?.success) {
        toast.success(`Record ${actionType === 'restore' ? 'restored' : 'permanently deleted'} successfully`);
        // Notify sidebar to refresh counts
        window.dispatchEvent(new CustomEvent("refresh-sidebar-stats"));

        setShowPasswordDialog(false);
        setPassword("");
        router.refresh();
      } else {
        toast.error(result?.error || "Action failed");
      }
    } catch (error: any) {
      console.error("Archive action failed:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => openConfirmDialog("restore")}
          className="h-8 border-[#27AE60] text-[#27AE60] font-bold text-[10px] rounded-lg px-4 hover:bg-[#F0FDF4] transition-all"
        >
          Restore
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => openConfirmDialog("delete")}
          className="h-8 border-[#E74C3C] text-[#E74C3C] font-bold text-[10px] rounded-lg px-4 hover:bg-[#FDEDEC] transition-all"
        >
          Delete
        </Button>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md p-6 rounded-2xl border-none shadow-2xl bg-white">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
             <div className="h-12 w-12 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#1F2937]">
                <Lock className="h-6 w-6" />
             </div>
             <DialogTitle className="text-xl font-black text-[#1F2937]">
               Confirm Password
             </DialogTitle>
             <p className="text-sm text-[#64748B] font-medium leading-relaxed px-4">
               Please enter your <span className="font-bold text-[#1F2937]">login password</span> to authorize this {actionType} action.
             </p>
          </DialogHeader>

          <div className="py-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568] ml-1">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-sm focus:ring-2 focus:ring-[#12B76A]/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  autoFocus
                />
             </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-[#E2E8F0] text-[#4A5568] font-bold text-xs"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword("");
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "flex-1 h-12 rounded-xl text-white font-black text-xs shadow-lg transition-all",
                actionType === 'delete' ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" : "bg-[#12B76A] hover:bg-[#0E9355] shadow-[#12B76A]/20"
              )}
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Processing..." : `Confirm ${actionType === 'restore' ? 'Restore' : 'Delete'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
