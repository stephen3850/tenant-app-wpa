import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  return NextResponse.json({
    status: "ok",
    version: "2.1.2-atomic",
    timestamp: "2026-09-14 12:45 UTC",
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 15) + "...",
      POSTGRES_URL_SET: !!process.env.POSTGRES_URL,
      POSTGRES_URL_LENGTH: process.env.POSTGRES_URL?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || "unknown"
    },
    message: "If you see version '2.1.2-atomic', the latest code is live."
  });
}
