"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function login(values: any) {
  const { email, password } = values;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}

export async function register(values: any) {
  const { email, password, name, organizationName } = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Transaction to create Organization, User, and assign Role
  await db.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/ /g, "-"),
      },
    });

    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizationId: org.id,
      },
    });

    // Default Role for the creator (Owner/Manager)
    const adminRole = await tx.role.findFirst({
      where: { name: "PROPERTY_MANAGER", organizationId: null },
    });

    if (adminRole) {
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      });
    }
  });

  return { success: "User created!" };
}

export async function logout() {
  await signOut();
}

export async function verifyPassword(password: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.password) return { error: "User profile or password not found" };

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) return { error: "Incorrect password" };

  return { success: true };
}
