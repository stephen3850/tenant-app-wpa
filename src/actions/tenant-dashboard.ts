"use server";

import { auth } from "@/auth";
import { tenantDashboardService } from "@/features/tenant/services/tenant-dashboard-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantDashboard() {
  const user = await getSession();
  return tenantDashboardService.getTenantData(user.id);
}

export async function getLeaseSummary() {
  const user = await getSession();
  return tenantDashboardService.getLeaseDetails(user.id);
}

// Add more specific actions as needed
export async function markNotificationAsRead(notificationId: string) {
    const user = await getSession();
    // Logic to mark as read
    revalidatePath("/tenant/dashboard");
}
