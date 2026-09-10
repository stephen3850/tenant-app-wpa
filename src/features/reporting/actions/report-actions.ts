"use server";

import { ReportService } from "../services/report-service";
import { OwnerStatementService } from "../services/owner-statement-service";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

async function getContext() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user as any;
  return {
    organizationId: user.organizationId,
    userId: user.id,
  };
}

export async function getIncomeStatement(startDate: Date, endDate: Date) {
  const { organizationId } = await getContext();
  await checkPermission("read", "records");
  const service = new ReportService(organizationId);
  return service.getIncomeStatement(startDate, endDate);
}

export async function getRentRoll() {
  const { organizationId } = await getContext();
  await checkPermission("read", "records");
  const service = new ReportService(organizationId);
  return service.getRentRoll();
}

export async function getOccupancyReport() {
  const { organizationId } = await getContext();
  await checkPermission("read", "records");
  const service = new ReportService(organizationId);
  return service.getOccupancyReport();
}

export async function generateOwnerStatement(landlordId: string, propertyId: string, startDate: Date, endDate: Date) {
  const { organizationId, userId } = await getContext();
  await checkPermission("manage", "records");
  const service = new OwnerStatementService(organizationId);
  const statement = await service.generateStatement(landlordId, propertyId, startDate, endDate);

  await createAuditLog({
    action: "OWNER_STATEMENT_GENERATED",
    entity: "OwnerStatement",
    entityId: statement.id,
    userId,
    organizationId,
  });

  revalidatePath("/reports/owner-statements");
  return statement;
}

export async function scheduleReport(templateId: string, frequency: string, recipients: string[]) {
  const { organizationId, userId } = await getContext();
  await checkPermission("manage", "records");
  const service = new ReportService(organizationId);
  const result = await service.scheduleReport(templateId, frequency, recipients);

  await createAuditLog({
    action: "REPORT_SCHEDULED",
    entity: "ScheduledReport",
    entityId: result.id,
    userId,
    organizationId,
  });

  revalidatePath("/reports/scheduled");
  return result;
}

export async function createReportExport(reportType: string, format: string, filters: any) {
  const { organizationId, userId } = await getContext();
  await checkPermission("read", "records");
  const service = new ReportService(organizationId);
  const result = await service.createExport(reportType, format, filters, userId);

  await createAuditLog({
    action: "REPORT_EXPORTED",
    entity: "ReportExport",
    entityId: result.id,
    userId,
    organizationId,
  });

  return result;
}
