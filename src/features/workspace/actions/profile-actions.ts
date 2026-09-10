"use server";

import { auth } from "@/auth";
import { systemDb } from "@/lib/tenant-db";
import { revalidatePath } from "next/cache";
import { serialize } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function getManagerProfile() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await systemDb.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      organization: true,
      notificationPreferences: true,
    },
  });

  return serialize(profile);
}

export async function updateManagerProfile(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const result = await systemDb.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      preferredLanguage: data.preferredLanguage,
      preferredTimeZone: data.preferredTimeZone,
      image: data.image,
    },
  });

  revalidatePath("/dashboard/settings/profile");
  return serialize(result);
}

export async function changeManagerPassword(oldPassword: string, newPassword: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    const userId = (session.user as any).id;

    const user = await systemDb.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) throw new Error("User not found or password not set");

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) throw new Error("Incorrect current password");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await systemDb.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      },
    });

    return { success: true };
}
