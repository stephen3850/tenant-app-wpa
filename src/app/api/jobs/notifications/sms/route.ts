import { NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/qstash";
import { notificationService } from "@/features/jobs/services/notification-service";

export async function POST(req: Request) {
  const isValid = await verifyQStashSignature(req);
  if (!isValid && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { organizationId, to, message } = await req.json();
    await notificationService.sendSMS(organizationId, to, message);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
