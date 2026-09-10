import { NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/qstash";
import { jobService } from "@/features/jobs/services/job-service";

/**
 * HOURLY JOB: M-Pesa Retry Processing
 */
export async function POST(req: Request) {
  const isValid = await verifyQStashSignature(req);
  if (!isValid && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await jobService.retryFailedMpesaReconciliations();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
