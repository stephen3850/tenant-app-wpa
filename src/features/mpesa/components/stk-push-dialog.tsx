"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initiateMpesaPaymentAction } from "../actions/mpesa-actions";
import { useToast } from "@/components/ui/use-toast";

export function STKPushDialog({ tenantId, defaultAmount, tenantName }: { tenantId: string, defaultAmount: number, tenantName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      tenantId,
      amount: Number(formData.get("amount")),
      phoneNumber: formData.get("phoneNumber") as string,
      accountReference: formData.get("accountReference") as string,
    };

    try {
      const result = await initiateMpesaPaymentAction(data);
      if (result.ResponseCode === "0") {
        toast({ title: "Request Sent", description: "STK push initiated on tenant's phone." });
        setOpen(false);
      } else {
          throw new Error(result.ResponseDescription || "Failed to initiate STK push");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">M-Pesa STK Push</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate M-Pesa Payment for {tenantName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" defaultValue={defaultAmount} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (2547XXXXXXXX)</Label>
            <Input id="phoneNumber" name="phoneNumber" placeholder="254712345678" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountReference">Account Reference (e.g. Unit #)</Label>
            <Input id="accountReference" name="accountReference" placeholder="UNIT-101" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Send Payment Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
