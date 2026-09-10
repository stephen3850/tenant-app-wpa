import { Prisma, PrismaClient } from "../../prisma/generated-client";
import { db as baseDb } from "./db";

/**
 * Symbol used to bypass tenant isolation for specific queries.
 * Use this sparingly and only for trusted system-level operations.
 */
export const BYPASS_TENANT_ISOLATION = Symbol("BYPASS_TENANT_ISOLATION");

/**
 * Models that MUST be isolated by organizationId.
 */
const ISOLATED_MODELS = [
  "Property",
  "Tenant",
  "Lease",
  "Invoice",
  "Payment",
  "AuditLog",
  "Role",
  "User",
  "Task",
  "Project",
  "MpesaTransaction",
  "MpesaCredential",
  "CreditBalance",
  "TenantLedger",
  "Ticket",
  "Expense",
  "Communication",
  "Case",
  "SecurityVisitor",
  "Subscription",
  "MpesaCallbackLog",
  "Unit", // Specially handled below
  "ExpenseCategory",
  "Vendor",
  "TicketCategory",
  "CaseCategory",
  "SecurityIncident",
  "SecurityIncidentCategory",
  "SecurityPatrol",
  "SecurityShiftHandover",
  "CommunicationTemplate",
  "Announcement",
  "Notification",
  "BillingInvoice",
  "BillingPayment",
  "UsageMetric",
  "RetentionPolicy",
  "ComplianceRecord",
  "RecordAccessLog",
  "UtilityType",
  "UtilityMeter",
  "UtilityReading",
  "UtilityBillingRule",
  "Department",
  "ApprovalWorkflow",
  "SupportCategory",
  "SupportTag",
  "SupportArticle",
  "SupportDocument",
  "PropertyDocument",
  "Conversation",
  "SupportCase",
  "CollectionSetting",
  "TenantGroup",
  "RoleTemplate",
  "PaymentAllocation",
  "LeaseRenewal",
  "LeaseNotice",
  "OwnerStatement",
  "Disbursement",
  "PlatformSecurityIncident",
  "PlatformJob",
  "FeatureFlagOverride",
  "ScheduledReport",
  "ReportExport",
  "AnalyticsReport", // Specially handled below
  "InvoiceLineItem",
  "ExpenseAttachment",
  "TicketComment",
  "TicketActivity",
  "TicketAssignment",
  "MaintenanceAttachment",
  "Subtask",
  "TaskComment",
  "TaskAttachment",
  "LeaseOccupant",
  "LeaseEvent",
  "CaseActivity",
  "CaseEvidence",
  "CaseDecision",
  "SecurityActivity",
  "SecurityEvidence",
  "AnnouncementAttachment",
  "AnnouncementRead",
  "ConversationParticipant",
  "Message",
  "MessageAttachment",
  "BillingInvoiceItem",
  "OwnerStatementLine",
  "SupportArticleVersion",
  "ReportExecution"
];

/**
 * Prisma extension to automatically inject organizationId into queries.
 * Hardens TMS v1.0 against cross-tenant data exposure.
 */
export const tenantIsolationExtension = (organizationId: string) => {
  return Prisma.defineExtension({
    name: "tenantIsolation",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // 1. Skip isolation for non-isolated models or explicit bypass
          const bypass = (args as any)?.[BYPASS_TENANT_ISOLATION];
          if (!ISOLATED_MODELS.includes(model) || bypass) {
            if (args) delete (args as any)[BYPASS_TENANT_ISOLATION];
            return query(args);
          }

          // Ensure args is an object to prevent crashes on count() etc.
          const finalArgs = (args as any) || {};

          // 2. Handle Read Operations
          const readOperations = ["findMany", "findFirst", "count", "aggregate", "groupBy"];
          if (readOperations.includes(operation)) {
            // Force organization isolation
            // Special handling for models without direct organizationId
            if (model === "Role") {
                finalArgs.where = { ...finalArgs.where, OR: [{ organizationId }, { organizationId: null }] };
            } else if (model === "Unit") {
                finalArgs.where = { ...finalArgs.where, property: { organizationId } };
            } else if (model === "AnalyticsReport") {
                finalArgs.where = { ...finalArgs.where, creator: { organizationId } };
            } else if (["InvoiceLineItem"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, invoice: { organizationId } };
            } else if (["ExpenseAttachment"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, expense: { organizationId } };
            } else if (["TicketComment", "TicketActivity", "TicketAssignment", "TicketActivity"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, ticket: { organizationId } };
            } else if (model === "MaintenanceAttachment") {
                finalArgs.where = { ...finalArgs.where, OR: [{ ticket: { organizationId } }, { comment: { ticket: { organizationId } } }] };
            } else if (["Subtask", "TaskComment", "TaskAttachment"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, task: { organizationId } };
            } else if (["LeaseOccupant", "LeaseEvent"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, lease: { organizationId } };
            } else if (["CaseActivity", "CaseEvidence", "CaseDecision"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, case: { organizationId } };
            } else if (["SecurityActivity", "SecurityEvidence"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, incident: { organizationId } };
            } else if (["AnnouncementAttachment", "AnnouncementRead"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, announcement: { organizationId } };
            } else if (["ConversationParticipant", "Message"].includes(model)) {
                finalArgs.where = { ...finalArgs.where, conversation: { organizationId } };
            } else if (model === "MessageAttachment") {
                finalArgs.where = { ...finalArgs.where, message: { conversation: { organizationId } } };
            } else if (model === "BillingInvoiceItem") {
                finalArgs.where = { ...finalArgs.where, billingInvoice: { organizationId } };
            } else if (model === "OwnerStatementLine") {
                finalArgs.where = { ...finalArgs.where, ownerStatement: { organizationId } };
            } else if (model === "SupportArticleVersion") {
                finalArgs.where = { ...finalArgs.where, article: { organizationId } };
            } else if (model === "ReportExecution") {
                finalArgs.where = { ...finalArgs.where, scheduledReport: { organizationId } };
            } else {
                finalArgs.where = { ...finalArgs.where, organizationId };
            }

            // Global Soft-Delete filter for models that support it
            // Only Property, Unit and Lease have deletedAt in the schema
            const modelsWithSoftDelete = ["Property", "Unit", "Lease"];
            if (modelsWithSoftDelete.includes(model)) {
               finalArgs.where.deletedAt = null;
            }

            // Global Archive filter for Property model
            if (model === "Property" && !finalArgs.where.status) {
               finalArgs.where.status = { not: "ARCHIVED" };
            }
          }

          // 3. Handle Unique Lookups (Convert findUnique to findFirst to allow filters)
          if (operation === "findUnique" || operation === "findUniqueOrThrow") {
            const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
            const whereClause: any = { ...finalArgs.where };

            if (model === "Unit") {
                whereClause.property = { organizationId };
            } else if (model === "AnalyticsReport") {
                whereClause.creator = { organizationId };
            } else if (["InvoiceLineItem"].includes(model)) {
                whereClause.invoice = { organizationId };
            } else if (["ExpenseAttachment"].includes(model)) {
                whereClause.expense = { organizationId };
            } else if (["TicketComment", "TicketActivity", "TicketAssignment"].includes(model)) {
                whereClause.ticket = { organizationId };
            } else if (model === "MaintenanceAttachment") {
                whereClause.OR = [{ ticket: { organizationId } }, { comment: { ticket: { organizationId } } }];
            } else if (["Subtask", "TaskComment", "TaskAttachment"].includes(model)) {
                whereClause.task = { organizationId };
            } else if (["LeaseOccupant", "LeaseEvent"].includes(model)) {
                whereClause.lease = { organizationId };
            } else if (["CaseActivity", "CaseEvidence", "CaseDecision"].includes(model)) {
                whereClause.case = { organizationId };
            } else if (["SecurityActivity", "SecurityEvidence"].includes(model)) {
                whereClause.incident = { organizationId };
            } else if (["AnnouncementAttachment", "AnnouncementRead"].includes(model)) {
                whereClause.announcement = { organizationId };
            } else if (["ConversationParticipant", "Message"].includes(model)) {
                whereClause.conversation = { organizationId };
            } else if (model === "MessageAttachment") {
                whereClause.message = { conversation: { organizationId } };
            } else if (model === "BillingInvoiceItem") {
                whereClause.billingInvoice = { organizationId };
            } else if (model === "OwnerStatementLine") {
                whereClause.ownerStatement = { organizationId };
            } else if (model === "SupportArticleVersion") {
                whereClause.article = { organizationId };
            } else if (model === "ReportExecution") {
                whereClause.scheduledReport = { organizationId };
            } else if (model !== "Role") {
                whereClause.organizationId = organizationId;
            }

            const findFirstArgs = { ...finalArgs, where: whereClause };
            return (baseDb as any)[modelKey].findFirst(findFirstArgs);
          }

          // 4. Handle Write Operations (Update/Delete)
          const writeOperations = ["updateMany", "deleteMany", "update", "delete"];
          if (writeOperations.includes(operation)) {
            const whereClause: any = { ...finalArgs.where };
            if (model === "Unit") {
                whereClause.property = { organizationId };
            } else if (model === "AnalyticsReport") {
                whereClause.creator = { organizationId };
            } else if (["InvoiceLineItem"].includes(model)) {
                whereClause.invoice = { organizationId };
            } else if (["ExpenseAttachment"].includes(model)) {
                whereClause.expense = { organizationId };
            } else if (["TicketComment", "TicketActivity", "TicketAssignment"].includes(model)) {
                whereClause.ticket = { organizationId };
            } else if (model === "MaintenanceAttachment") {
                whereClause.OR = [{ ticket: { organizationId } }, { comment: { ticket: { organizationId } } }];
            } else if (["Subtask", "TaskComment", "TaskAttachment"].includes(model)) {
                whereClause.task = { organizationId };
            } else if (["LeaseOccupant", "LeaseEvent"].includes(model)) {
                whereClause.lease = { organizationId };
            } else if (["CaseActivity", "CaseEvidence", "CaseDecision"].includes(model)) {
                whereClause.case = { organizationId };
            } else if (["SecurityActivity", "SecurityEvidence"].includes(model)) {
                whereClause.incident = { organizationId };
            } else if (["AnnouncementAttachment", "AnnouncementRead"].includes(model)) {
                whereClause.announcement = { organizationId };
            } else if (["ConversationParticipant", "Message"].includes(model)) {
                whereClause.conversation = { organizationId };
            } else if (model === "MessageAttachment") {
                whereClause.message = { conversation: { organizationId } };
            } else if (model === "BillingInvoiceItem") {
                whereClause.billingInvoice = { organizationId };
            } else if (model === "OwnerStatementLine") {
                whereClause.ownerStatement = { organizationId };
            } else if (model === "SupportArticleVersion") {
                whereClause.article = { organizationId };
            } else if (model === "ReportExecution") {
                whereClause.scheduledReport = { organizationId };
            } else {
                whereClause.organizationId = organizationId;
            }
            finalArgs.where = whereClause;
          }

          // 5. Handle Creation (Ensure organizationId is forced)
          if (operation === "create" || operation === "createMany") {
             if (operation === "create") {
                finalArgs.data = {
                    ...finalArgs.data,
                    organizationId: organizationId,
                };
             } else if (operation === "createMany") {
                if (Array.isArray(finalArgs.data)) {
                    finalArgs.data = finalArgs.data.map((item: any) => ({
                        ...item,
                        organizationId: organizationId,
                    }));
                }
             }
          }

          // 6. Execute modified query
          return query(finalArgs);
        },
      },
    },
  });
};

/**
 * Factory to get a tenant-aware Prisma client.
 * Use this in Server Actions and Services that handle user requests.
 */
export const getTenantDb = (organizationId: string) => {
  if (!organizationId) {
    throw new Error("Critical Security Error: organizationId is required for tenant isolation.");
  }
  return baseDb.$extends(tenantIsolationExtension(organizationId));
};

/**
 * System DB for background jobs or super-admin tasks.
 * Bypass isolation explicitly by using the base client.
 */
export const systemDb = baseDb;
