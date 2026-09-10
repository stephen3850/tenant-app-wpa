import { caseRepository } from "../repositories/case-repository";
import { CaseSeverity, CaseStatus, CaseActivityType, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";

export class CaseService {
  private async generateCaseNumber(organizationId: string) {
    const count = await db.case.count({ where: { organizationId } });
    return `CASE-${(count + 1).toString().padStart(5, '0')}`;
  }

  async createCase(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "case" as any); // Updated permissions.ts will include "case"

    const caseNumber = await this.generateCaseNumber(organizationId);

    const caseRecord = await caseRepository.create({
      ...data,
      caseNumber,
      organizationId,
      creatorId: userId,
      status: "OPEN",
    });

    await caseRepository.createActivity({
      caseId: caseRecord.id,
      userId,
      type: "COMMENT",
      content: "Case opened",
    });

    await createAuditLog({
      action: "CREATE",
      entity: "Case",
      entityId: caseRecord.id,
      newData: caseRecord,
    });

    return caseRecord;
  }

  async updateCase(userId: string, organizationId: string, caseId: string, data: any) {
    await checkPermission("update", "case" as any);

    const oldCase = await caseRepository.findById(caseId, organizationId);
    const caseRecord = await caseRepository.update(caseId, organizationId, data);

    await createAuditLog({
      action: "UPDATE",
      entity: "Case",
      entityId: caseRecord.id,
      oldData: oldCase,
      newData: caseRecord,
    });

    return caseRecord;
  }

  async assignCase(userId: string, organizationId: string, caseId: string, assigneeId: string) {
    await checkPermission("assign", "case" as any);

    const caseRecord = await caseRepository.update(caseId, organizationId, {
        assigneeId,
        status: "INVESTIGATING"
    });

    await caseRepository.createActivity({
      caseId,
      userId,
      type: "ASSIGNMENT",
      newValue: assigneeId,
    });

    await createAuditLog({
      action: "ASSIGN",
      entity: "Case",
      entityId: caseId,
      newData: { assigneeId },
    });

    return caseRecord;
  }

  async changeStatus(userId: string, organizationId: string, caseId: string, status: CaseStatus, notes?: string) {
    await checkPermission("update", "case" as any);

    const oldCase = await caseRepository.findById(caseId, organizationId);
    const caseRecord = await caseRepository.update(caseId, organizationId, {
      status,
      ...(status === "CLOSED" ? { closedAt: new Date() } : {})
    });

    await caseRepository.createActivity({
      caseId,
      userId,
      type: "STATUS_CHANGE",
      oldValue: oldCase?.status,
      newValue: status,
      content: notes,
    });

    await createAuditLog({
      action: "STATUS_CHANGE",
      entity: "Case",
      entityId: caseId,
      oldData: { status: oldCase?.status },
      newData: { status },
    });

    return caseRecord;
  }

  async addComment(userId: string, organizationId: string, caseId: string, content: string) {
    await checkPermission("view", "case" as any);

    const activity = await caseRepository.createActivity({
      caseId,
      userId,
      type: "COMMENT",
      content,
    });

    await createAuditLog({
      action: "COMMENT",
      entity: "Case",
      entityId: caseId,
      newData: { activityId: activity.id },
    });

    return activity;
  }

  async escalateCase(userId: string, organizationId: string, caseId: string, notes: string) {
    await checkPermission("update", "case" as any);

    const caseRecord = await this.changeStatus(userId, organizationId, caseId, "ESCALATED", notes);

    await caseRepository.createActivity({
      caseId,
      userId,
      type: "ESCALATION",
      content: notes,
    });

    return caseRecord;
  }

  async recordDecision(userId: string, organizationId: string, caseId: string, data: any) {
    await checkPermission("update", "case" as any);

    const decision = await caseRepository.recordDecision({
      ...data,
      caseId,
      decidedById: userId,
    });

    await caseRepository.createActivity({
      caseId,
      userId,
      type: "DECISION",
      content: data.summary,
    });

    await createAuditLog({
      action: "DECISION",
      entity: "Case",
      entityId: caseId,
      newData: decision,
    });

    return decision;
  }

  async archiveCase(userId: string, organizationId: string, caseId: string) {
    await checkPermission("archive", "case" as any);

    const caseRecord = await this.changeStatus(userId, organizationId, caseId, "ARCHIVED");

    await createAuditLog({
      action: "ARCHIVE",
      entity: "Case",
      entityId: caseId,
    });

    return caseRecord;
  }
}

export const caseService = new CaseService();
