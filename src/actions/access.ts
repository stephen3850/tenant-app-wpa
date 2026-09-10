"use strict";

import { auth } from "@/auth";
import { accessService } from "@/features/access/services/access-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function inviteUser(data: any) {
  const user = await getSession();
  const newUser = await accessService.inviteUser(user.id, user.organizationId, data);
  revalidatePath("/dashboard/users");
  return newUser;
}

export async function suspendUser(userId: string) {
  const user = await getSession();
  const suspendedUser = await accessService.suspendUser(user.id, user.organizationId, userId);
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath("/dashboard/users");
  return suspendedUser;
}

export async function activateUser(userId: string) {
  const user = await getSession();
  const activatedUser = await accessService.activateUser(user.id, user.organizationId, userId);
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath("/dashboard/users");
  return activatedUser;
}

export async function createRole(data: any) {
  const user = await getSession();
  const role = await accessService.createRole(user.id, user.organizationId, data);
  revalidatePath("/dashboard/access/roles");
  return role;
}

export async function assignPermissions(roleId: string, permissionIds: string[]) {
  const user = await getSession();
  await accessService.assignPermissions(user.id, user.organizationId, roleId, permissionIds);
  revalidatePath(`/dashboard/access/roles/${roleId}`);
  return { success: true };
}

export async function recordApproval(stepId: string, entityId: string, decision: string, notes?: string) {
  const user = await getSession();
  const approval = await accessService.recordApproval(user.id, user.organizationId, stepId, entityId, decision, notes);
  revalidatePath("/dashboard/approvals");
  return approval;
}

export async function createDepartment(data: any) {
  const user = await getSession();
  const department = await accessService.createDepartment(user.id, user.organizationId, data);
  revalidatePath("/dashboard/access/departments");
  return department;
}
