"use strict";

import { auth } from "@/auth";
import { utilityService } from "@/features/utilities/services/utility-service";
import { revalidatePath } from "next/cache";
import { MeterStatus, ReadingStatus } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function createMeter(data: any) {
  const user = await getSession();
  const meter = await utilityService.createMeter(user.id, user.organizationId, data);
  revalidatePath("/dashboard/utilities/meters");
  return meter;
}

export async function recordReading(data: any) {
  const user = await getSession();
  const reading = await utilityService.recordReading(user.id, user.organizationId, data);
  revalidatePath("/dashboard/utilities/readings");
  return reading;
}

export async function approveReading(readingId: string) {
  const user = await getSession();
  const reading = await utilityService.approveReading(user.id, user.organizationId, readingId);
  revalidatePath("/dashboard/utilities/approvals");
  revalidatePath("/dashboard/utilities/readings");
  return reading;
}

export async function voidReading(readingId: string) {
  const user = await getSession();
  const reading = await utilityService.voidReading(user.id, user.organizationId, readingId);
  revalidatePath("/dashboard/utilities/readings");
  return reading;
}
