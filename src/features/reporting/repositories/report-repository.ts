import { getTenantDb, systemDb } from "@/lib/tenant-db";
import { Prisma, ReportCategory } from "@prisma/client";

export class ReportRepository {
  private db;

  constructor(organizationId?: string) {
    this.db = organizationId ? getTenantDb(organizationId) : systemDb;
  }

  async getTemplates(category?: ReportCategory) {
    return this.db.reportTemplate.findMany({
      where: {
        category,
      },
      orderBy: { name: "asc" },
    });
  }

  async getTemplateById(id: string) {
    return this.db.reportTemplate.findUnique({
      where: { id },
    });
  }

  async createTemplate(data: Prisma.ReportTemplateCreateUncheckedInput) {
    return this.db.reportTemplate.create({ data });
  }

  async updateTemplate(id: string, data: Prisma.ReportTemplateUpdateUncheckedInput) {
    return this.db.reportTemplate.update({
      where: { id },
      data,
    });
  }

  async getSavedReports() {
    return this.db.savedReport.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getScheduledReports() {
    return this.db.scheduledReport.findMany({
      include: {
        template: true,
      },
      orderBy: { nextRunAt: "asc" },
    });
  }

  async createScheduledReport(data: Prisma.ScheduledReportCreateUncheckedInput) {
    return this.db.scheduledReport.create({ data });
  }

  async getExports() {
    return this.db.reportExport.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async createExport(data: Prisma.ReportExportCreateUncheckedInput) {
    return this.db.reportExport.create({ data });
  }

  async updateExport(id: string, data: Prisma.ReportExportUpdateUncheckedInput) {
    return this.db.reportExport.update({
      where: { id },
      data,
    });
  }
}
