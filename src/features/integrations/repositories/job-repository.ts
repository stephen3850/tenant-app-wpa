import { systemDb } from "@/lib/tenant-db";
import { JobStatus, Prisma } from "@prisma/client";

export class JobRepository {
  async getJobs(params: {
    status?: JobStatus;
    organizationId?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { status, organizationId, type, page = 1, pageSize = 20 } = params;
    const where: Prisma.PlatformJobWhereInput = {};

    if (status) where.status = status;
    if (organizationId) where.organizationId = organizationId;
    if (type) where.jobType = type;

    const [items, total] = await Promise.all([
      systemDb.platformJob.findMany({
        where,
        include: {
          organization: {
            select: { name: true, slug: true },
          },
          integration: {
            select: { name: true, provider: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      systemDb.platformJob.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async getJobById(id: string) {
    return systemDb.platformJob.findUnique({
      where: { id },
      include: {
        organization: true,
        integration: true,
      },
    });
  }

  async updateJob(id: string, data: Prisma.PlatformJobUpdateInput) {
    return systemDb.platformJob.update({
      where: { id },
      data,
    });
  }

  async getScheduledTasks() {
    return systemDb.platformScheduledTask.findMany({
      orderBy: { nextRunAt: "asc" },
    });
  }

  async updateScheduledTask(id: string, data: Prisma.PlatformScheduledTaskUpdateInput) {
    return systemDb.platformScheduledTask.update({
      where: { id },
      data,
    });
  }
}
