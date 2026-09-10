import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    organizationId?: string | null;
    roles?: string[];
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      organizationId?: string | null;
      roles?: string[];
      permissions?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId?: string | null;
    roles?: string[];
    permissions?: string[];
  }
}
