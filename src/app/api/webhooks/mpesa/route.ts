import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mpesaProvider } from "@/lib/payments/providers/mpesa-provider";
import { paymentProcessor } from "@/lib/payments/processor";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[Central M-Pesa Webhook] Payload received:", JSON.stringify(body));

    const parsed = await mpesaProvider.handleCallback(body);

    if (!parsed.success && parsed.topic === "UNKNOWN") {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Payload received" });
    }

    const providerEventId = parsed.providerEventId || parsed.checkoutRequestId || parsed.mpesaReceiptNumber;

    // Idempotency check
    if (providerEventId) {
      const existingEvent = await db.paymentEvent.findUnique({
        where: { providerEventId },
      });

      if (existingEvent && existingEvent.processingStatus === "PROCESSED") {
        console.log(`[Central M-Pesa Webhook] Duplicate event ignored: ${providerEventId}`);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }
    }

    // Attempt shortcode / account lookup
    let paymentAccountId: string | undefined;
    let organizationId: string | undefined;

    if (parsed.shortCode) {
      const account = await db.paymentAccount.findFirst({
        where: { shortCode: parsed.shortCode, status: "ACTIVE" },
      });
      if (account) {
        paymentAccountId = account.id;
        organizationId = account.organizationId;
      }
    }

    if (!paymentAccountId && parsed.checkoutRequestId) {
      const tx = await db.mpesaTransaction.findUnique({
        where: { checkoutRequestId: parsed.checkoutRequestId },
      });
      if (tx) {
        paymentAccountId = tx.paymentAccountId || undefined;
        organizationId = tx.organizationId;
      }
    }

    // Record Payment Event for audit & retryable async processing
    const paymentEvent = await db.paymentEvent.create({
      data: {
        organizationId,
        paymentAccountId,
        provider: "MPESA",
        eventType: parsed.topic,
        providerEventId,
        payload: body,
        processingStatus: "PENDING",
      },
    });

    // Also store raw callback log for backwards compatibility & audit
    await db.mpesaCallbackLog.create({
      data: {
        organizationId,
        topic: parsed.topic,
        payload: body,
      },
    });

    // Trigger async processing in background
    paymentProcessor.processEvent(paymentEvent.id).catch((err) => {
      console.error(`[Central M-Pesa Webhook] Async processor error for event ${paymentEvent.id}:`, err);
    });

    // C2B Validation response
    if (parsed.topic === "C2B_VALIDATION") {
      const billRefNumber = parsed.accountReference;
      if (billRefNumber) {
        const tenant = await db.tenant.findFirst({
          where: {
            OR: [
              { tenantCode: billRefNumber },
              { id: billRefNumber },
            ],
          },
        });

        if (!tenant) {
          return NextResponse.json({ ResultCode: "C2B00012", ResultDesc: "Rejected: Invalid Account Number" });
        }
      }
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // STK / C2B Confirmation response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("[Central M-Pesa Webhook] Exception:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
