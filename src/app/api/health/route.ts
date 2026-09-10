import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const health: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
    }
  };

  try {
    // Check Database
    await db.$queryRaw`SELECT 1`;
    health.services.database = "connected";
  } catch (error) {
    health.status = "degraded";
    health.services.database = "disconnected";
  }

  // Add more service checks here (e.g., Redis, QStash connectivity)

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
