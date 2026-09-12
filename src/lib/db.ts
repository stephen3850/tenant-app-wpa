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

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Strict check for valid connection string
if (!url || url.trim() === "" || url === "undefined") {
  throw new Error(
    "FATAL: DATABASE_URL (or POSTGRES_URL) is missing or invalid. " +
    "Ensure the variable is set in Vercel Environment Variables and the project is REDEPLOYED."
  );
}

const pool = new Pool({
  connectionString: url,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const adapter = new PrismaNeon(pool as any);

export const db = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
