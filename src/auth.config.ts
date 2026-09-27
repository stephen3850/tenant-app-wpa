import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const cleanEmail = (credentials.email as string).toLowerCase().trim();

          const user = await db.user.findUnique({
            where: { email: cleanEmail },
            include: {
              organization: true,
              tenantProfile: true,
              userRoles: {
                include: {
                  role: {
                    include: {
                      permissions: {
                        include: {
                          permission: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (passwordsMatch) {
            let roles = user.userRoles.map(ur => ur.role.name);

            // Auto-detect Tenant profile if not explicitly in userRoles
            if (!roles.includes("TENANT")) {
              const tenantRecord = user.tenantProfile || await db.tenant.findFirst({
                where: {
                  OR: [
                    { userId: user.id },
                    { email: { equals: cleanEmail, mode: "insensitive" } }
                  ]
                }
              });

              if (tenantRecord) {
                roles.push("TENANT");
              }
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              organizationId: user.organizationId,
              organizationStatus: user.organization?.status || "ACTIVE",
              roles,
              permissions: user.userRoles.flatMap(ur =>
                ur.role.permissions.map(p => `${p.permission.action}:${p.permission.subject}`)
              ),
            } as any;
          }

          return null;
        } catch (err) {
          console.error("Auth Error:", err);
          return null;
        }
      },
  }),
],
} satisfies NextAuthConfig;
