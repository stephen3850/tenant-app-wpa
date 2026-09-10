import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reconciliationService } from "@/features/mpesa/services/reconciliation-service";
import { Logger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: Request) {
  const startTime = Date.now();
  const correlationId = req.headers.get("x-correlation-id") || "mpesa-callback";

  try {
    const body = await req.json();
    const { stkCallback } = body.Body;

    Logger.info("M-Pesa STK Callback Received", {
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      correlationId
    }, "MPESA");

    await db.mpesaCallbackLog.create({
      data: {
        topic: "STK_PUSH",
        payload: body,
      },
    });

    if (stkCallback.ResultCode === 0) {
      const metadata = stkCallback.CallbackMetadata.Item;
      const amount = metadata.find((i: any) => i.Name === "Amount")?.Value;
      const receipt = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const phone = metadata.find((i: any) => i.Name === "PhoneNumber")?.Value;
      const dateStr = metadata.find((i: any) => i.Name === "TransactionDate")?.Value.toString();

      const formattedDate = dateStr ? new Date(
        `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:${dateStr.slice(12, 14)}`
      ) : new Date();

      await reconciliationService.reconcileSTK(
        stkCallback.CheckoutRequestID,
        receipt,
        amount,
        phone?.toString() || "",
        formattedDate
      );

      Logger.info("M-Pesa STK Reconciliation Success", {
        receipt,
        duration: Date.now() - startTime
      }, "MPESA");

    } else {
      Logger.warn("M-Pesa STK Callback Result Failed", {
        resultCode: stkCallback.ResultCode,
        resultDesc: stkCallback.ResultDesc,
        checkoutRequestId: stkCallback.CheckoutRequestID
      }, "MPESA");

      await db.mpesaTransaction.update({
        where: { checkoutRequestId: stkCallback.CheckoutRequestID },
        data: {
          status: "FAILED",
          resultCode: stkCallback.ResultCode,
          resultDesc: stkCallback.ResultDesc,
        }
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    Logger.error("M-Pesa STK Callback Critical Error", error, { correlationId }, "MPESA");

    Sentry.captureException(error, {
      tags: { service: "mpesa", correlationId },
      extra: { startTime }
    });

    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
