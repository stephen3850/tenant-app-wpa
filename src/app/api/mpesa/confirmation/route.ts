import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reconciliationService } from "@/features/mpesa/services/reconciliation-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.mpesaCallbackLog.create({
      data: {
        topic: "C2B_CONFIRMATION",
        payload: body,
      },
    });

    const receipt = body.TransID;
    const amount = parseFloat(body.TransAmount);
    const phone = body.MSISDN;
    const accountReference = body.BillRefNumber;
    const dateStr = body.TransTime;

    const formattedDate = dateStr ? new Date(
      `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:${dateStr.slice(12, 14)}`
    ) : new Date();

    const credential = await db.mpesaCredential.findFirst({
      where: { shortCode: body.BusinessShortCode.toString() }
    });

    if (credential) {
      await reconciliationService.reconcileC2B(
        credential.organizationId,
        receipt,
        amount,
        phone,
        formattedDate,
        accountReference
      );
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa Confirmation Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" }, { status: 500 });
  }
}
