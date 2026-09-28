import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }

  return NextResponse.json({
    status: "ok",
    version: "2.1.3",
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
