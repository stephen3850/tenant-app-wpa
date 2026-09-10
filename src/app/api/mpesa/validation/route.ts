import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accountReference = body.BillRefNumber;

    const tenant = await db.tenant.findUnique({
      where: { tenantCode: accountReference }
    });

    if (!tenant) {
      return NextResponse.json({
        ResultCode: "C2B00012",
        ResultDesc: "Rejected: Invalid Account Number",
      });
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("M-Pesa Validation Error:", error);
    return NextResponse.json({
      ResultCode: "C2B00016",
      ResultDesc: "Rejected: Internal Error",
    });
  }
}
