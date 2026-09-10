import { supportArticleRepository } from "../repositories/support-article-repository";
import { supportCategoryRepository } from "../repositories/support-category-repository";
import { supportDocumentRepository } from "../repositories/support-document-repository";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { SupportArticleStatus } from "@prisma/client";
import { slugify } from "@/lib/utils";

export class SupportService {
  async getArticles(organizationId: string, filters: any) {
    await checkPermission("view", "support");
    return supportArticleRepository.findMany(organizationId, filters);
  }

  async getArticle(id: string, organizationId: string) {
    await checkPermission("view", "support");
    return supportArticleRepository.findById(id, organizationId);
  }

  async createArticle(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "support");

    const slug = slugify(data.title);

    const article = await supportArticleRepository.create({
      ...data,
      slug,
      organizationId,
      authorId: userId,
      currentVersion: 1,
    });

    await supportArticleRepository.createVersion({
      articleId: article.id,
      version: 1,
      title: article.title,
      content: article.content,
      authorId: userId,
      changeSummary: "Initial version",
    });

    await createAuditLog({
      action: "ARTICLE_CREATED",
      entity: "SupportArticle",
      entityId: article.id,
      newData: article,
    });

    return article;
  }

  async updateArticle(userId: string, organizationId: string, id: string, data: any) {
    await checkPermission("update", "support");

    const article = await supportArticleRepository.findById(id, organizationId);
    if (!article) throw new Error("Article not found");

    const newVersionNumber = article.currentVersion + 1;

    const updatedArticle = await supportArticleRepository.update(id, organizationId, {
      ...data,
      currentVersion: newVersionNumber,
    });

    await supportArticleRepository.createVersion({
      articleId: article.id,
      version: newVersionNumber,
      title: data.title || article.title,
      content: data.content || article.content,
      authorId: userId,
      changeSummary: data.changeSummary || "Updated article",
    });

    await createAuditLog({
      action: "ARTICLE_UPDATED",
      entity: "SupportArticle",
      entityId: article.id,
      oldData: article,
      newData: updatedArticle,
    });

    return updatedArticle;
  }

  async publishArticle(organizationId: string, id: string) {
    await checkPermission("publish", "support");

    const article = await supportArticleRepository.update(id, organizationId, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    await createAuditLog({
      action: "ARTICLE_PUBLISHED",
      entity: "SupportArticle",
      entityId: id,
      newData: { status: "PUBLISHED" },
    });

    return article;
  }

  async archiveArticle(organizationId: string, id: string) {
    await checkPermission("update", "support");

    const article = await supportArticleRepository.update(id, organizationId, {
      status: "ARCHIVED",
    });

    await createAuditLog({
      action: "ARTICLE_ARCHIVED",
      entity: "SupportArticle",
      entityId: id,
      newData: { status: "ARCHIVED" },
    });

    return article;
  }

  async rollbackVersion(userId: string, organizationId: string, articleId: string, versionNumber: number) {
    await checkPermission("update", "support");

    const article = await supportArticleRepository.findById(articleId, organizationId);
    if (!article) throw new Error("Article not found");

    const version = await supportArticleRepository.findVersion(articleId, versionNumber);
    if (!version) throw new Error("Version not found");

    const newVersionNumber = article.currentVersion + 1;

    const updatedArticle = await supportArticleRepository.update(articleId, organizationId, {
      title: version.title,
      content: version.content,
      currentVersion: newVersionNumber,
    });

    await supportArticleRepository.createVersion({
      articleId,
      version: newVersionNumber,
      title: version.title,
      content: version.content,
      authorId: userId,
      changeSummary: `Rolled back to version ${versionNumber}`,
    });

    await createAuditLog({
      action: "VERSION_ROLLED_BACK",
      entity: "SupportArticle",
      entityId: articleId,
      newData: { toVersion: versionNumber, newVersion: newVersionNumber },
    });

    return updatedArticle;
  }

  async getCategories(organizationId: string) {
    return supportCategoryRepository.findMany(organizationId);
  }

  async getDocuments(organizationId: string, filters: any) {
    await checkPermission("view", "support");
    return supportDocumentRepository.findMany(organizationId, filters);
  }

  async uploadDocument(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "support");

    const document = await supportDocumentRepository.create({
      ...data,
      organizationId,
      uploadedById: userId,
    });

    await createAuditLog({
      action: "DOCUMENT_UPLOADED",
      entity: "SupportDocument",
      entityId: document.id,
      newData: document,
    });

    return document;
  }

  async recordDownload(userId: string, organizationId: string, documentId: string) {
    await checkPermission("download", "support");

    const document = await supportDocumentRepository.findById(documentId, organizationId);
    if (!document) throw new Error("Document not found");

    await supportDocumentRepository.logDownload(documentId, userId);

    await createAuditLog({
      action: "DOCUMENT_DOWNLOADED",
      entity: "SupportDocument",
      entityId: documentId,
    });

    return document;
  }
}

export const supportService = new SupportService();
