import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      success: true,
      database: "connected",
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error("[DB_HEALTH_CHECK_ERROR]", error);
    return NextResponse.json({
      success: false,
      database: "disconnected",
      error: "Database connection check failed"
    }, { status: 500 });
  }
}
