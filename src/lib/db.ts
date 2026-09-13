import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

declare global {
  var prisma: PrismaClient | undefined;
}

// Enable WebSocket for edge-compatibility in Node.js
if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const getConnectionString = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url || url.trim() === "" || url === "undefined") {
    return null;
  }
  return url.trim();
};

const createPrismaClient = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    // Return a proxy that throws on any access
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          "DATABASE_URL is missing. Please set it in Vercel Environment Variables and REDEPLOY."
        );
      }
    });
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter });
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
