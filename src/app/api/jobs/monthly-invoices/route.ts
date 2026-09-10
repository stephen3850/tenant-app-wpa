import { NextResponse } from "next/server";
import { getQStashClient, verifyQStashSignature } from "@/lib/qstash";
import { jobService } from "@/features/jobs/services/job-service";

/**
 * MASTER JOB: Monthly Invoice Generation
 * Schedule: 1st of every month at 00:00
 */
export async function POST(req: Request) {
  const isValid = await verifyQStashSignature(req);
  if (!isValid && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const orgIds = await jobService.fanOutMonthlyInvoices();

    // Fan-out to per-organization jobs
    const promises = orgIds.map(orgId =>
      getQStashClient().publishJSON({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/monthly-invoices/process-org`,
        body: { organizationId: orgId },
      })
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true, fannedOut: orgIds.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
