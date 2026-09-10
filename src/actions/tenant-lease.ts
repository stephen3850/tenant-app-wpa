"use server";

import { auth } from "@/auth";
import { tenantLeaseService } from "@/features/tenant/services/tenant-lease-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getActiveLease() {
  const user = await getSession();
  return tenantLeaseService.getActiveLease(user.id);
}

export async function getLeaseHistory() {
  const user = await getSession();
  return tenantLeaseService.getLeaseHistory(user.id);
}

export async function getLeaseDetails(leaseId: string) {
  const user = await getSession();
  return tenantLeaseService.getLeaseDetails(user.id, leaseId);
}

export async function acceptRenewalOffer(renewalId: string, notes?: string) {
  const user = await getSession();
  const result = await tenantLeaseService.respondToRenewal(user.id, renewalId, "ACCEPTED", notes);
  revalidatePath("/lease");
  return result;
}

export async function declineRenewalOffer(renewalId: string, notes?: string) {
  const user = await getSession();
  const result = await tenantLeaseService.respondToRenewal(user.id, renewalId, "DECLINED", notes);
  revalidatePath("/lease");
  return result;
}

export async function submitRenewalInterest(leaseId: string, notes?: string) {
  const user = await getSession();
  const result = await tenantLeaseService.submitRenewalInterest(user.id, leaseId, notes);
  revalidatePath("/lease");
  return result;
}

export async function acknowledgeNotice(noticeId: string) {
  const user = await getSession();
  const result = await tenantLeaseService.acknowledgeNotice(user.id, noticeId);
  revalidatePath("/lease");
  return result;
}

export async function logLeaseDownload(leaseId: string) {
  const user = await getSession();
  return tenantLeaseService.logLeaseDownload(user.id, leaseId);
}
