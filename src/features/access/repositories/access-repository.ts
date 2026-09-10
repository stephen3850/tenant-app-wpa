import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class AccessRepository {
  async findRoles(organizationId: string) {
    return db.role.findMany({
      where: {
        OR: [
          { organizationId },
          { organizationId: null } // System roles
        ]
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        _count: {
          select: { userRoles: true }
        }
      }
    });
  }

  async createRole(data: Prisma.RoleUncheckedCreateInput) {
    return db.role.create({ data });
  }

  async updateRole(id: string, organizationId: string, data: Prisma.RoleUncheckedUpdateInput) {
    return db.role.update({
      where: { id, organizationId },
      data
    });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    return db.$transaction([
      db.rolePermission.deleteMany({ where: { roleId } }),
      db.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }))
      })
    ]);
  }

  async findPermissions() {
    return db.permission.findMany({
      orderBy: [
        { subject: "asc" },
        { action: "asc" }
      ]
    });
  }

  async findApprovalWorkflows(organizationId: string) {
    return db.approvalWorkflow.findMany({
      where: { organizationId },
      include: {
        steps: {
          include: {
            role: true
          },
          orderBy: { order: "asc" }
        }
      }
    });
  }

  async createApprovalDecision(data: Prisma.ApprovalDecisionUncheckedCreateInput) {
    return db.approvalDecision.create({ data });
  }

  async findPendingApprovals(userId: string, organizationId: string) {
    // This is a complex query to find entities awaiting approval from the user's role
    const userRoles = await db.userRole.findMany({
      where: { userId },
      select: { roleId: true }
    });

    const roleIds = userRoles.map(ur => ur.roleId);

    return db.approvalStep.findMany({
      where: {
        roleId: { in: roleIds },
        workflow: { organizationId }
      },
      include: {
        workflow: true,
        decisions: true
      }
    });
  }

  async getDashboardStats(organizationId: string) {
    const [active, suspended, recentLogins, pendingApprovals] = await Promise.all([
      db.user.count({ where: { organizationId, status: "ACTIVE" } }),
      db.user.count({ where: { organizationId, status: "SUSPENDED" } }),
      db.loginHistory.findMany({
        where: { user: { organizationId } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      db.approvalDecision.count({
        where: { step: { workflow: { organizationId } }, decision: "PENDING" as any } // This depends on implementation details
      })
    ]);

    return {
      activeUsers: active,
      suspendedUsers: suspended,
      recentLogins,
      pendingApprovals
    };
  }
}

export const accessRepository = new AccessRepository();
