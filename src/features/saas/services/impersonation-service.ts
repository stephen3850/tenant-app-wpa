import { impersonationRepository } from "../repositories/impersonation-repository";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { addHours } from "date-fns";

export class ImpersonationService {
  async startImpersonation(adminId: string, data: {
    targetUserId: string;
    reason: string;
    caseReference?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // 1. Security Check: Target exists and is not a super admin
    const targetUser = await db.user.findUnique({
      where: { id: data.targetUserId },
      select: { id: true, organizationId: true, userRoles: { include: { role: true } } }
    });

    if (!targetUser) throw new Error("Target user not found");

    const isTargetAdmin = targetUser.userRoles.some(ur =>
      ur.role.name === "SUPER_ADMIN" || ur.role.organizationId === null
    );

    if (isTargetAdmin) {
      throw new Error("Security Violation: Cannot impersonate another Super Admin.");
    }

    // 2. Check for existing active session
    const existing = await impersonationRepository.getActiveSession(adminId);
    if (existing) {
      await impersonationRepository.deactivateSession(existing.id);
    }

    // 3. Create session (valid for 1 hour by default)
    const session = await impersonationRepository.createSession({
      impersonatorId: adminId,
      targetUserId: data.targetUserId,
      organizationId: targetUser.organizationId || undefined,
      reason: data.reason,
      caseReference: data.caseReference,
      expiresAt: addHours(new Date(), 1),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    await createAuditLog({
      action: "IMPERSONATION_STARTED",
      entity: "User",
      entityId: data.targetUserId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: {
        reason: data.reason,
        caseReference: data.caseReference,
        sessionId: session.id
      },
    });

    return session;
  }

  async stopImpersonation(adminId: string) {
    const session = await impersonationRepository.getActiveSession(adminId);
    if (!session) return { success: true };

    await impersonationRepository.deactivateSession(session.id);

    await createAuditLog({
      action: "IMPERSONATION_ENDED",
      entity: "User",
      entityId: session.targetUserId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { sessionId: session.id },
    });

    return { success: true };
  }

  async getActiveSession(adminId: string) {
    return impersonationRepository.getActiveSession(adminId);
  }

  async listSessions(adminId: string) {
    return impersonationRepository.listSessions({});
  }
}

export const impersonationService = new ImpersonationService();
