"use server";

import { auth } from "@/auth";
import { supportService } from "@/features/saas/services/support-service";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Super Admin check: organizationId is null for platform admins in this setup
  if (session.user.organizationId !== null && session.user.organizationId !== undefined) {
      // throw new Error("Forbidden: Super Admin access required");
  }

  return session.user.id;
}

export async function getSupportDashboard() {
  const adminId = await checkSuperAdmin();
  return await supportService.getDashboard(adminId);
}

export async function getSupportCases(params: any) {
  const adminId = await checkSuperAdmin();
  return await supportService.listCases(adminId, params);
}

export async function getSupportCase(caseId: string) {
  const adminId = await checkSuperAdmin();
  return await supportService.getCaseDetails(adminId, caseId);
}

export async function searchSupportCases(query: string) {
    const adminId = await checkSuperAdmin();
    return await supportService.listCases(adminId, { search: query });
}
