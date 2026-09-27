"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getDashboardForRole } from "@/lib/routes";

// Production Auth Server Actions v2.1.5 - Verified for Neon PostgreSQL & Vercel

export async function login(values: any) {
  const { email, password } = values;

  try {
    let targetDashboard = "/portal/dashboard";

    if (email) {
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: {
          userRoles: {
            include: { role: true }
          }
        }
      });

      if (user) {
        const roles = user.userRoles.map(ur => ur.role.name);
        targetDashboard = getDashboardForRole(roles);
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: targetDashboard,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        default:
          return { error: "Something went wrong with the login process." };
      }
    }
    // Very important: Next.js redirects work by throwing an error.
    // We MUST re-throw it so Next.js can handle the redirect.
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
      where: { email: email.toLowerCase().trim() },
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
          email: email.toLowerCase().trim(),
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
    console.error("[AUTH_ACTION_ERROR] Registration Failure:", error);

    const message = error.message || "";

    if (
      message.includes("DATABASE_URL_NOT_SET") ||
      message.includes("DATABASE_CONFIGURATION_ERROR") ||
      message.includes("No database host or connection string")
    ) {
      return {
        error: "Database configuration error: DATABASE_URL is missing or invalid in environment variables. Please set DATABASE_URL in Vercel Settings > Environment Variables or in your local .env file."
      };
    }

    const isDbError = message.toLowerCase().includes("database") ||
                      message.toLowerCase().includes("connection") ||
                      message.toLowerCase().includes("pool") ||
                      message.toLowerCase().includes("host");

    const uiErrorMessage = isDbError
      ? `[PROD_DB_ERROR]: ${message}`
      : message || "An unexpected error occurred during registration.";

    return { error: uiErrorMessage };
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
