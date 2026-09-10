"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, XCircle, ChevronRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { retryJob, cancelJob } from "@/features/integrations/actions/job-actions";
import { toast } from "sonner";

const statusConfig: Record<string, { color: string, icon: any }> = {
  QUEUED: { color: "bg-blue-100 text-blue-700", icon: Clock },
  PROCESSING: { color: "bg-amber-100 text-amber-700 animate-pulse", icon: RefreshCw },
  COMPLETED: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  FAILED: { color: "bg-rose-100 text-rose-700", icon: XCircle },
  RETRYING: { color: "bg-indigo-100 text-indigo-700", icon: RefreshCw },
  CANCELLED: { color: "bg-slate-100 text-slate-700", icon: AlertCircle },
};

export function JobList({ jobs, total, page, pageSize }: { jobs: any[], total: number, page: number, pageSize: number }) {
  const handleRetry = async (id: string) => {
    try {
      await retryJob(id);
      toast.success("Job scheduled for retry");
    } catch (error) {
      toast.error("Failed to retry job");
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Job ID / Type</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Organization</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Status</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs text-center">Attempts</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Started At</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center font-medium text-slate-500">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
          {jobs.map((job) => {
            const config = statusConfig[job.status] || statusConfig.QUEUED;
            return (
              <TableRow key={job.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">#{job.id.substring(job.id.length - 8)}</span>
                    <span className="text-xs font-bold text-slate-500">{job.jobType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-slate-700">{job.organization?.name || "Platform"}</span>
                </TableCell>
                <TableCell>
                  <Badge className={`font-bold ${config.color} border-none`}>
                    <config.icon className="mr-1 h-3 w-3" />
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-black text-slate-900">{job.attempts}</span>
                  <span className="text-slate-400 font-bold mx-1">/</span>
                  <span className="text-slate-400 font-bold">{job.maxAttempts}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-600">
                    {job.startedAt ? formatDate(job.startedAt) : "Pending"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {job.status === "FAILED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 font-black border-2 border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() => handleRetry(job.id)}
                      >
                        Retry
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
