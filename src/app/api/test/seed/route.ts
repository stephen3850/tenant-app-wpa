import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Disable test seed endpoint in production
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return NextResponse.json(
      { error: "Test seed endpoint is disabled in production environments." },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { error: "Seed endpoint is restricted. Use CLI 'npm run db:seed' instead." },
    { status: 403 }
  );
}
