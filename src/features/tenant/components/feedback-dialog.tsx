"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { confirmResolution } from "@/actions/tenant-maintenance";

export function FeedbackDialog({
  open,
  onOpenChange,
  requestId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
}) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await confirmResolution(requestId, rating, feedback);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
             <CheckCircle2Icon className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">Issue Resolved!</DialogTitle>
          <DialogDescription className="text-base pt-2">
            We're glad to hear the issue was handled. Please take a moment to rate the service quality.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
              >
                <StarIcon className={`h-10 w-10 ${star <= rating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="feedback" className="text-xs font-bold text-slate-500 uppercase">Additional Comments (Optional)</Label>
            <Textarea
              id="feedback"
              placeholder="How was the technician? Did they leave the area clean?"
              className="resize-none"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex sm:justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 min-w-[150px]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loader2Icon className="animate-spin h-4 w-4 mr-2" /> : null}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
