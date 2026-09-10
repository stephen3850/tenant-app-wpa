import { userAdminRepository } from "../repositories/user-admin-repository";
import { createAuditLog } from "@/lib/audit";
import { UserStatus } from "@prisma/client";

export class UserAdminService {
  async listUsers(adminId: string, params: any) {
    const data = await userAdminRepository.getUsers(params);

    await createAuditLog({
      action: "USERS_VIEWED",
      entity: "User",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return data;
  }

  async getUserDetails(adminId: string, userId: string) {
    const user = await userAdminRepository.getUserById(userId);
    if (!user) throw new Error("User not found");

    await createAuditLog({
      action: "USER_VIEWED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return user;
  }

  async suspendUser(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.updateUserStatus(userId, "SUSPENDED");

    await createAuditLog({
      action: "USER_SUSPENDED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async reactivateUser(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.updateUserStatus(userId, "ACTIVE");

    await createAuditLog({
      action: "USER_REACTIVATED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async lockUser(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.updateUserStatus(userId, "LOCKED");

    await createAuditLog({
      action: "USER_LOCKED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async unlockUser(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.updateUserStatus(userId, "ACTIVE");

    await createAuditLog({
      action: "USER_UNLOCKED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async archiveUser(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.updateUserStatus(userId, "ARCHIVED");

    await createAuditLog({
      action: "USER_ARCHIVED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async resetMFA(adminId: string, userId: string, reason: string) {
    const user = await userAdminRepository.resetMFA(userId);

    await createAuditLog({
      action: "MFA_RESET",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return user;
  }

  async forcePasswordReset(adminId: string, userId: string, reason: string) {
    await createAuditLog({
      action: "PASSWORD_RESET_FORCED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return { success: true };
  }

  async terminateSessions(adminId: string, userId: string, reason: string) {
    await userAdminRepository.terminateSessions(userId);

    await createAuditLog({
      action: "SESSIONS_TERMINATED",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { reason },
    });

    return { success: true };
  }

  async resendInvitation(adminId: string, userId: string) {
    await createAuditLog({
      action: "INVITATION_RESENT",
      entity: "User",
      entityId: userId,
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return { success: true };
  }

  async exportUsers(adminId: string, params: any) {
    const { users } = await userAdminRepository.getUsers({ ...params, take: 1000 });

    await createAuditLog({
      action: "REPORT_EXPORTED",
      entity: "User",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { count: users.length },
    });

    return users;
  }

  async getTimeline(adminId: string, userId: string) {
    return userAdminRepository.getUserTimeline(userId);
  }
}

export const userAdminService = new UserAdminService();
