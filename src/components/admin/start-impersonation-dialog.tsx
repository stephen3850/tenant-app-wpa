"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { startImpersonation } from "@/actions/impersonation";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StartImpersonationDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    organizationName: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartImpersonationDialog({ user, open, onOpenChange }: StartImpersonationDialogProps) {
  const [reason, setReason] = useState("");
  const [caseReference, setCaseReference] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!reason) {
      toast.error("Business justification is mandatory.");
      return;
    }

    setLoading(true);
    try {
      await startImpersonation({
        targetUserId: user.id,
        reason,
        caseReference
      });
      toast.success(`Started impersonating ${user.name}`);
      onOpenChange(false);
      router.refresh();
      // Redirect to target organization dashboard or similar
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to start impersonation session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-100 p-2 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <DialogTitle className="text-xl font-black">Secure Support Session</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-medium leading-relaxed">
            You are initiating an impersonation session for <span className="font-bold text-slate-900">{user.name}</span>.
            All actions taken during this session will be recorded and attributed to your administrator account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Target User</span>
                    <span className="text-slate-900 font-bold">{user.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Organization</span>
                    <span className="text-slate-900 font-bold">{user.organizationName}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Business Justification <span className="text-rose-500">*</span></Label>
                    <Textarea
                        placeholder="Explain why you need access to this user's account..."
                        className="resize-none border-slate-200 bg-slate-50/50"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Support Case Reference (Optional)</Label>
                    <Input
                        placeholder="e.g. SUP-12345"
                        className="border-slate-200 bg-slate-50/50 font-mono"
                        value={caseReference}
                        onChange={(e) => setCaseReference(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    By starting this session, you confirm that you have obtained user consent or are acting within the defined Support & Privacy policies.
                </p>
            </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" className="font-bold text-slate-500" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white font-black px-8"
            onClick={handleStart}
            disabled={loading || !reason}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            ACTIVATE SESSION
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
