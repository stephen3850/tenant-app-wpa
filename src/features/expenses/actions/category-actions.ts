"use server";

import { auth } from "@/auth";
import { categoryRepository } from "../repositories/category-repository";
import { revalidatePath } from "next/cache";

async function getOrgId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function getCategoriesAction() {
  const organizationId = await getOrgId();
  return categoryRepository.findMany(organizationId);
}

export async function createCategoryAction(name: string, description?: string) {
  const organizationId = await getOrgId();
  const result = await categoryRepository.create({ organizationId, name, description });
  revalidatePath("/expenses/categories");
  return result;
}

export async function deleteCategoryAction(id: string) {
  const organizationId = await getOrgId();
  const result = await categoryRepository.delete(id, organizationId);
  revalidatePath("/expenses/categories");
  return result;
}
