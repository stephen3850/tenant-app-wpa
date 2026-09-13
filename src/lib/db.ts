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

  if (!url) return null;

  const cleaned = url.trim().replace(/^["']|["']$/g, "");
  if (cleaned === "" || cleaned === "undefined" || cleaned === "null") return null;

  return cleaned;
};

const createPrismaClient = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error(
      "DIAGNOSTIC_ERROR: DATABASE_URL is literally null or undefined in Vercel. " +
      "Check Settings > Environment Variables."
    );
  }

  try {
    const pool = new Pool({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  } catch (err: any) {
    throw new Error(`DRIVER_INIT_ERROR: ${err.message} | String starts with: ${connectionString.substring(0, 15)}...`);
  }
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
