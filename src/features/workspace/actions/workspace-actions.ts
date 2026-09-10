"use server";

import { auth } from "@/auth";
import { workspaceService } from "../services/workspace-service";
import { serialize } from "@/lib/utils";

export async function getDashboardDataAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const organizationId = (session.user as any).organizationId;
  const data = await workspaceService.getDashboardData(organizationId);
  return serialize(data);
}
