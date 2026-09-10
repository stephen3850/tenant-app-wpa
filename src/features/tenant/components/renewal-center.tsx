"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { acceptRenewalOffer, declineRenewalOffer, submitRenewalInterest } from "@/actions/tenant-lease";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, XCircleIcon, AlertCircleIcon, Loader2Icon, SendIcon } from "lucide-react";

export function RenewalCenter({ renewals, leaseId, isExpiring }: { renewals: any[], leaseId?: string, isExpiring?: boolean }) {
  const activeRenewal = renewals.find(r => r.status === "PENDING");
  const hasRequested = renewals.find(r => r.status === "REQUESTED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (hasRequested) return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="py-12 text-center text-green-700 flex flex-col items-center gap-3">
        <CheckCircle2Icon className="h-8 w-8" />
        <div>
            <p className="font-semibold text-green-800">Renewal Interest Submitted</p>
            <p className="text-xs">We've received your interest in renewing. Management will contact you soon with a formal offer.</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!activeRenewal) return (
    <Card className="bg-slate-50 border-dashed">
      <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3">
        <AlertCircleIcon className="h-8 w-8 text-slate-300" />
        <div className="space-y-4">
            <div>
                <p className="font-semibold text-slate-600">No active renewal offers</p>
                <p className="text-xs">Your current lease is active. We'll notify you when it's time to renew.</p>
            </div>

            {isExpiring && leaseId && (
              <div className="pt-4 border-t border-slate-200 mt-4 space-y-4">
                <p className="text-sm font-medium text-slate-800">Interested in renewing early?</p>
                <Textarea
                  placeholder="Any special requests or notes for the management..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white text-xs"
                />
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={async () => {
                    setLoading(true);
                    try { await submitRenewalInterest(leaseId, notes); } catch(e) {} finally { setLoading(false); }
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2Icon className="animate-spin h-4 w-4 mr-2" /> : <SendIcon className="h-3 w-3 mr-2" />}
                  Submit Renewal Interest
                </Button>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );

  const handleAction = async (action: "accept" | "decline") => {
    setLoading(true);
    try {
      if (action === "accept") {
        await acceptRenewalOffer(activeRenewal.id, notes);
      } else {
        await declineRenewalOffer(activeRenewal.id, notes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30 overflow-hidden">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-blue-900">Lease Renewal Offer</CardTitle>
                <CardDescription className="text-blue-700 font-medium">Valid until {formatDate(activeRenewal.deadline || new Date())}</CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white">NEW OFFER</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Proposed Terms</h4>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-muted-foreground">New Period</p>
                  <p className="text-sm font-semibold">{formatDate(activeRenewal.proposedStartDate)} — {formatDate(activeRenewal.proposedEndDate || new Date())}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground">Proposed Rent</p>
                  <p className="text-sm font-bold text-blue-700">{formatCurrency(activeRenewal.proposedRent)}</p>
               </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Comments (Optional)</h4>
            <Textarea
                placeholder="e.g. I would like to request a minor repair before renewing..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-sm bg-white"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-blue-50/50 border-t border-blue-100 p-6 flex gap-4">
        <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => handleAction("accept")}
            disabled={loading}
        >
          {loading ? <Loader2Icon className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2Icon className="h-4 w-4 mr-2" />}
          Accept Offer
        </Button>
        <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction("decline")}
            disabled={loading}
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Decline Offer
        </Button>
      </CardFooter>
    </Card>
  );
}
