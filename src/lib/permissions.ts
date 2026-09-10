"use server";

import { auth } from "@/auth";

export type Action = "create" | "read" | "update" | "delete" | "manage" | "view" | "assign" | "close" | "archive" | "export" | "retention" | "send" | "announce" | "template" | "approve" | "bill" | "suspend" | "pay" | "publish" | "download";
export type Subject = "property" | "unit" | "tenant" | "lease" | "user" | "organization" | "ticket" | "case" | "security" | "records" | "communications" | "utilities" | "users" | "roles" | "billing" | "support" | "all";

/**
 * Validates if a user has a specific permission.
 * This is a server-side only function.
 */
export async function hasPermission(action: Action, subject: Subject): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user) return false;

    const user = session.user as any;
    const permissions = user.permissions as string[] || [];

    // Super Admin bypass
    if (user.roles?.includes("SUPER_ADMIN")) return true;

    // Business Owner / Manager bypass for organization-level actions
    if (user.roles?.includes("MANAGER") || user.roles?.includes("PROPERTY_MANAGER")) return true;

    return permissions.includes(`${action}:${subject}`) || permissions.includes(`manage:all`);
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
}

/**
 * Throws an error if the user lacks a permission.
 */
export async function checkPermission(action: Action, subject: Subject): Promise<void> {
  const allowed = await hasPermission(action, subject);
  if (!allowed) {
    throw new Error(`Unauthorized: Missing required permission for ${action}:${subject}`);
  }
}
