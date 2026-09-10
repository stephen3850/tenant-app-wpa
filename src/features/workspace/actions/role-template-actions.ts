"use server";

import { auth } from "@/auth";
import { getTenantDb } from "@/lib/tenant-db";
import { revalidatePath } from "next/cache";
import { serialize } from "@/lib/utils";

export async function getRoleTemplatesAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const templates = await (db as any).roleTemplate.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return serialize(templates);
}

export async function createRoleTemplateAction(data: {
  name: string;
  description: string;
  baseRole: string;
  permissions: any;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const template = await (db as any).roleTemplate.create({
    data: {
      ...data,
      organizationId,
    },
  });

  revalidatePath("/settings");
  return serialize(template);
}
