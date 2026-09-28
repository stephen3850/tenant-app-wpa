"use server";

import { auth } from "@/auth";

export async function checkUser(email: string) {
  const session = await auth();
  const roles = (session?.user as any)?.roles || [];

  // Security guard: Only platform/super admins can inspect user metadata
  if (!roles.includes("PLATFORM_ADMIN") && !roles.includes("SUPER_ADMIN")) {
    return { error: "Forbidden: Administrative session required" };
  }

  return {
    status: "Active Session Validated",
    timestamp: new Date().toISOString()
  };
}
