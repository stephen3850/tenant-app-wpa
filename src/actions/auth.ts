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
  try {
    const { email, password, name, organizationName } = values;

    if (!email || !password || !organizationName) {
      return { error: "Please fill in all required fields." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    // Transaction to create Organization, User, and assign Role
    const result = await db.$transaction(async (tx) => {
      // 1. Create Organization
      const slug = organizationName.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const existingOrg = await tx.organization.findUnique({
        where: { slug }
      });

      if (existingOrg) {
        throw new Error("An organization with a similar name already exists. Please choose a different name.");
      }

      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug,
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          organizationId: org.id,
          status: "ACTIVE"
        },
      });

      // 3. Assign Role (PROPERTY_MANAGER is the default for new registrations)
      let adminRole = await tx.role.findFirst({
        where: { name: "PROPERTY_MANAGER", organizationId: null },
      });

      // Fallback: If roles aren't seeded yet, create the role on the fly or just continue
      if (!adminRole) {
        console.warn("System roles not found. Creating default PROPERTY_MANAGER role.");
        adminRole = await tx.role.create({
          data: {
            name: "PROPERTY_MANAGER",
            description: "Default organization manager",
            organizationId: null
          }
        });
      }

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      });

      return { user, org };
    });

    return { success: "Account created successfully! You can now sign in." };
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: error.message || "Something went wrong. Please try again." };
  }
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
