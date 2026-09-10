"use strict";

import { auth } from "@/auth";
import { caseService } from "@/features/cases/services/case-service";
import { revalidatePath } from "next/cache";
import { CaseStatus, CaseSeverity } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function createCase(data: any) {
  const user = await getSession();
  const caseRecord = await caseService.createCase(user.id, user.organizationId, data);
  revalidatePath("/dashboard/cases");
  return caseRecord;
}

export async function updateCase(caseId: string, data: any) {
  const user = await getSession();
  const caseRecord = await caseService.updateCase(user.id, user.organizationId, caseId, data);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return caseRecord;
}

export async function assignCase(caseId: string, assigneeId: string) {
  const user = await getSession();
  const result = await caseService.assignCase(user.id, user.organizationId, caseId, assigneeId);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return result;
}

export async function changeCaseStatus(caseId: string, status: CaseStatus, notes?: string) {
  const user = await getSession();
  const caseRecord = await caseService.changeStatus(user.id, user.organizationId, caseId, status, notes);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return caseRecord;
}

export async function addCaseComment(caseId: string, content: string) {
  const user = await getSession();
  const activity = await caseService.addComment(user.id, user.organizationId, caseId, content);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return activity;
}

export async function escalateCase(caseId: string, notes: string) {
  const user = await getSession();
  const caseRecord = await caseService.escalateCase(user.id, user.organizationId, caseId, notes);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return caseRecord;
}

export async function recordDecision(caseId: string, data: any) {
  const user = await getSession();
  const decision = await caseService.recordDecision(user.id, user.organizationId, caseId, data);
  revalidatePath(`/dashboard/cases/${caseId}`);
  return decision;
}

export async function closeCase(caseId: string, notes?: string) {
  return changeCaseStatus(caseId, "CLOSED", notes);
}

export async function reopenCase(caseId: string, notes?: string) {
  return changeCaseStatus(caseId, "REOPENED", notes);
}

export async function archiveCase(caseId: string) {
  const user = await getSession();
  const caseRecord = await caseService.archiveCase(user.id, user.organizationId, caseId);
  revalidatePath("/dashboard/cases");
  return caseRecord;
}
