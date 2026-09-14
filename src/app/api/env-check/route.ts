import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  return NextResponse.json({
    status: "ok",
    version: "2.1.3-seed",
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      POSTGRES_URL_SET: !!process.env.POSTGRES_URL,
      AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || "unknown"
    },
    message: "If AUTH_SECRET_SET is false, NextAuth will fail in production."
  });
}
