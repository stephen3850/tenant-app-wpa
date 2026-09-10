import { NextResponse } from "next/server";
import { mpesaService } from "@/features/finance/services/mpesa-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("M-Pesa STK Callback Received:", JSON.stringify(body));

    await mpesaService.handleStkCallback(body.Body);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("STK Callback Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
