"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TerminationSchema, TerminationValues } from "../schemas";

interface TerminationDialogProps {
  onTerminate: (values: TerminationValues) => void;
  isLoading?: boolean;
}

export function TerminationDialog({ onTerminate, isLoading }: TerminationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<TerminationValues>({
    resolver: zodResolver(TerminationSchema),
    defaultValues: {
      moveOutDate: new Date(),
    }
  });

  const onSubmit = (values: TerminationValues) => {
    onTerminate(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Terminate Lease</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terminate Lease</DialogTitle>
          <DialogDescription>
            Are you sure you want to terminate this lease? This action will mark the unit as vacant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="moveOutDate">Move Out Date</Label>
            <Input
              id="moveOutDate"
              type="date"
              {...register("moveOutDate")}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            {errors.moveOutDate && <p className="text-xs text-red-500">{errors.moveOutDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="terminationReason">Reason for Termination</Label>
            <Textarea
              id="terminationReason"
              placeholder="e.g. End of contract, Non-payment, etc."
              {...register("terminationReason")}
            />
            {errors.terminationReason && <p className="text-xs text-red-500">{errors.terminationReason.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? "Terminating..." : "Confirm Termination"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
