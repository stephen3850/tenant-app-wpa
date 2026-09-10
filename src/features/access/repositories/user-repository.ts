import { db } from "@/lib/db";
import { Prisma, UserStatus } from "@prisma/client";

export class UserRepository {
  async findMany(organizationId: string, filters?: { status?: UserStatus; departmentId?: string }) {
    return db.user.findMany({
      where: {
        organizationId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
      },
      include: {
        department: true,
        userRoles: {
          include: {
            role: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, organizationId: string) {
    return db.user.findUnique({
      where: { id, organizationId },
      include: {
        department: true,
        userRoles: {
          include: {
            role: true
          }
        },
        loginHistory: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      },
    });
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    return db.user.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.UserUncheckedUpdateInput) {
    return db.user.update({
      where: { id, organizationId },
      data,
    });
  }

  async findDepartments(organizationId: string) {
    return db.department.findMany({
      where: { organizationId },
      include: { _count: { select: { users: true } } },
      orderBy: { name: "asc" }
    });
  }

  async createDepartment(data: Prisma.DepartmentUncheckedCreateInput) {
    return db.department.create({ data });
  }
}

export const userRepository = new UserRepository();
