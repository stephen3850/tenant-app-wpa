import { userRepository } from "../repositories/user-repository";
import { accessRepository } from "../repositories/access-repository";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { UserStatus } from "@prisma/client";

export class AccessService {
  async inviteUser(adminId: string, organizationId: string, data: any) {
    await checkPermission("create", "users" as any);

    const user = await userRepository.create({
      ...data,
      organizationId,
      status: "INVITED",
    });

    await createAuditLog({
      action: "USER_INVITED",
      entity: "User",
      entityId: user.id,
      newData: user,
    });

    return user;
  }

  async suspendUser(adminId: string, organizationId: string, userId: string) {
    await checkPermission("suspend", "users" as any);

    const user = await userRepository.update(userId, organizationId, {
      status: "SUSPENDED"
    });

    await createAuditLog({
      action: "USER_SUSPENDED",
      entity: "User",
      entityId: userId,
      newData: { status: "SUSPENDED" },
    });

    return user;
  }

  async activateUser(adminId: string, organizationId: string, userId: string) {
    await checkPermission("update", "users" as any);

    const user = await userRepository.update(userId, organizationId, {
      status: "ACTIVE"
    });

    await createAuditLog({
      action: "USER_ACTIVATED",
      entity: "User",
      entityId: userId,
      newData: { status: "ACTIVE" },
    });

    return user;
  }

  async createRole(adminId: string, organizationId: string, data: any) {
    await checkPermission("create", "roles" as any);

    const role = await accessRepository.createRole({
      ...data,
      organizationId
    });

    await createAuditLog({
      action: "ROLE_CREATED",
      entity: "Role",
      entityId: role.id,
      newData: role,
    });

    return role;
  }

  async assignPermissions(adminId: string, organizationId: string, roleId: string, permissionIds: string[]) {
    await checkPermission("update", "roles" as any);

    await accessRepository.assignPermissionsToRole(roleId, permissionIds);

    await createAuditLog({
      action: "PERMISSION_UPDATED",
      entity: "Role",
      entityId: roleId,
      newData: { permissionIds },
    });
  }

  async recordApproval(userId: string, organizationId: string, stepId: string, entityId: string, decision: string, notes?: string) {
    // Permission check usually depends on the role required for the step

    const approval = await accessRepository.createApprovalDecision({
      stepId,
      entityId,
      approverId: userId,
      decision,
      notes
    });

    await createAuditLog({
      action: "APPROVAL_RECORDED",
      entity: "ApprovalDecision",
      entityId: approval.id,
      newData: approval,
    });

    return approval;
  }

  async createDepartment(adminId: string, organizationId: string, data: any) {
    await checkPermission("update", "organization" as any);

    const department = await userRepository.createDepartment({
      ...data,
      organizationId
    });

    return department;
  }
}

export const accessService = new AccessService();
