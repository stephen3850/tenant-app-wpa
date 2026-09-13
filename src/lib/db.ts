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
  let url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!url) return null;

  // Auto-clean the string
  url = url.trim().replace(/^["']|["']$/g, "");

  if (url === "" || url === "undefined" || url === "null") return null;

  return url;
};

const createPrismaClient = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return new Proxy({} as PrismaClient, {
      get(target, prop) {
        if (prop === "toString") return () => "PrismaClientProxy";
        throw new Error(
          "DATABASE_URL is missing in Vercel settings. Please add it and REDEPLOY."
        );
      }
    });
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 5000,
  });

  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter });
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
