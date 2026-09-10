import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("M-Pesa C2B Validation Received:", JSON.stringify(body));

    await db.mpesaCallbackLog.create({
      data: { topic: "C2B_VALIDATION", payload: body },
    });

    // Check if tenant exists by BillRefNumber
    const tenant = await db.tenant.findFirst({
        where: { tenantCode: body.BillRefNumber }
    });

    if (!tenant) {
        return NextResponse.json({ ResultCode: "C2B00012", ResultDesc: "Rejected: Invalid Account Number" });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("C2B Validation Error:", error);
    return NextResponse.json({ ResultCode: "C2B00016", ResultDesc: "Rejected: Internal Error" });
  }
}
