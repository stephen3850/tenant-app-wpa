import { db } from "./db";
import { auth } from "@/auth";

export async function createAuditLog({
  action,
  entity,
  entityId,
  oldData,
  newData,
  userId,
  organizationId,
  ipAddress,
  userAgent,
}: {
  action: string;
  entity: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  userId?: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  let finalUserId = userId;
  let finalOrgId = organizationId;

  if (!finalUserId || !finalOrgId) {
    const session = await auth();
    if (session?.user) {
      const user = session.user as any;
      if (!finalUserId) finalUserId = user.id;
      if (!finalOrgId) finalOrgId = user.organizationId;
    }
  }

  if (!finalUserId) return; // Can't log without a user unless it's systemAuditLog

  await db.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined,
      newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
      ipAddress,
      userAgent,
      userId: finalUserId,
      organizationId: finalOrgId || "SYSTEM",
    },
  });
}

export async function systemAuditLog({
  action,
  entity,
  entityId,
  organizationId,
  oldData,
  newData,
}: {
  action: string;
  entity: string;
  entityId: string;
  organizationId: string;
  oldData?: any;
  newData?: any;
}) {
  await db.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined,
      newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
      userId: "SYSTEM", // Special marker for automated tasks
      organizationId,
    },
  });
}
