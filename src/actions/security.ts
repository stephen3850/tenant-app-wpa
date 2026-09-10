"use server";

import { auth } from "@/auth";
import { securityService } from "@/features/security/services/security-service";
import { revalidatePath } from "next/cache";
import { SecurityIncidentStatus } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function createLogEntry(data: any) {
  const user = await getSession();
  const entry = await securityService.createIncident(user.id, user.organizationId, data);
  revalidatePath("/dashboard/security/ob");
  return entry;
}

export async function updateLogEntry(incidentId: string, data: any) {
  const user = await getSession();
  const entry = await securityService.updateIncident(user.id, user.organizationId, incidentId, data);
  revalidatePath(`/dashboard/security/ob/${incidentId}`);
  return entry;
}

export async function recordVisitorEntry(data: any) {
  const user = await getSession();
  const visitor = await securityService.recordVisitorCheckIn(user.id, user.organizationId, data);
  revalidatePath("/dashboard/security/visitors");
  return visitor;
}

export async function recordVisitorExit(visitorId: string) {
  const user = await getSession();
  const visitor = await securityService.recordVisitorCheckOut(user.id, user.organizationId, visitorId);
  revalidatePath("/dashboard/security/visitors");
  return visitor;
}

export async function recordPatrol(data: any) {
  const user = await getSession();
  const patrol = await securityService.recordPatrol(user.id, user.organizationId, data);
  revalidatePath("/dashboard/security/patrols");
  return patrol;
}

export async function recordShiftHandover(data: any) {
  const user = await getSession();
  const handover = await securityService.recordHandover(user.id, user.organizationId, data);
  revalidatePath("/dashboard/security/handovers");
  return handover;
}

export async function changeIncidentStatus(incidentId: string, status: SecurityIncidentStatus, notes?: string) {
  const user = await getSession();
  const entry = await securityService.changeStatus(user.id, user.organizationId, incidentId, status, notes);
  revalidatePath(`/dashboard/security/ob/${incidentId}`);
  return entry;
}

export async function closeIncident(incidentId: string, notes?: string) {
  return changeIncidentStatus(incidentId, "CLOSED", notes);
}

export async function archiveLogEntry(incidentId: string) {
  const user = await getSession();
  const entry = await securityService.changeStatus(user.id, user.organizationId, incidentId, "ARCHIVED");
  revalidatePath("/dashboard/security/ob");
  return entry;
}
