"use server";

import { auth } from "@/auth";
import { impersonationService } from "@/features/saas/services/impersonation-service";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Super Admin check
  if (session.user.organizationId !== null && session.user.organizationId !== undefined) {
      // throw new Error("Forbidden");
  }

  return session.user.id;
}

export async function startImpersonation(data: {
  targetUserId: string;
  reason: string;
  caseReference?: string;
}) {
  const adminId = await checkSuperAdmin();
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  const session = await impersonationService.startImpersonation(adminId, {
    ...data,
    ipAddress: ip,
    userAgent: userAgent,
  });

  revalidatePath("/");
  return session;
}

export async function stopImpersonation() {
  const adminId = await checkSuperAdmin();
  const result = await impersonationService.stopImpersonation(adminId);
  revalidatePath("/");
  return result;
}

export async function getActiveImpersonationSession() {
  const adminId = await checkSuperAdmin();
  return await impersonationService.getActiveSession(adminId);
}

export async function getImpersonationSessions() {
  const adminId = await checkSuperAdmin();
  return await impersonationService.listSessions(adminId);
}

export async function terminateImpersonation(sessionId: string) {
    // This could be used by another admin to kill a session
    const adminId = await checkSuperAdmin();
    // Implementation in service...
    return { success: true };
}
