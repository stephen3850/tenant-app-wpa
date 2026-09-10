"use server";

import { auth } from "@/auth";
import { supportService } from "@/features/support/services/support-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function createArticle(data: any) {
  const user = await getSession();
  const article = await supportService.createArticle(user.id, user.organizationId, data);
  revalidatePath("/dashboard/support/knowledge-base");
  return article;
}

export async function updateArticle(id: string, data: any) {
  const user = await getSession();
  const article = await supportService.updateArticle(user.id, user.organizationId, id, data);
  revalidatePath(`/dashboard/support/articles/${id}`);
  revalidatePath("/dashboard/support/knowledge-base");
  return article;
}

export async function publishArticle(id: string) {
  const user = await getSession();
  const article = await supportService.publishArticle(user.organizationId, id);
  revalidatePath("/dashboard/support/knowledge-base");
  return article;
}

export async function archiveArticle(id: string) {
  const user = await getSession();
  const article = await supportService.archiveArticle(user.organizationId, id);
  revalidatePath("/dashboard/support/knowledge-base");
  return article;
}

export async function rollbackVersion(articleId: string, versionNumber: number) {
  const user = await getSession();
  const article = await supportService.rollbackVersion(user.id, user.organizationId, articleId, versionNumber);
  revalidatePath(`/dashboard/support/articles/${articleId}`);
  return article;
}

export async function uploadDocument(data: any) {
  const user = await getSession();
  const document = await supportService.uploadDocument(user.id, user.organizationId, data);
  revalidatePath("/dashboard/support/downloads");
  return document;
}

export async function recordDownload(documentId: string) {
  const user = await getSession();
  return supportService.recordDownload(user.id, user.organizationId, documentId);
}
