import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  debug: process.env.NODE_ENV !== "production",
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
        token.roles = (user as any).roles;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).roles = token.roles;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    },
  },
  ...authConfig,
});
