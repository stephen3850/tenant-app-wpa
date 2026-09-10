"use server";

import { db } from "@/lib/db";

export async function checkUser(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) return { message: "User not found" };

    return {
      message: "User found",
      roles: user.userRoles.map(ur => ur.role.name),
      hasPassword: !!user.password,
      organizationId: user.organizationId
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
