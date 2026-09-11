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

          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            include: {
              organization: true,
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
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              organizationId: user.organizationId,
              organizationStatus: user.organization?.status || "ACTIVE",
              roles: user.userRoles.map(ur => ur.role.name),
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
