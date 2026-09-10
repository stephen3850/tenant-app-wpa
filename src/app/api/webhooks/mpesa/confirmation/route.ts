import { NextResponse } from "next/server";
import { mpesaService } from "@/features/finance/services/mpesa-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("M-Pesa C2B Confirmation Received:", JSON.stringify(body));

    await mpesaService.handleC2BConfirmation(body);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("C2B Confirmation Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
