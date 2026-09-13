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

console.log("DATABASE_INIT_START: Checking environment...");

const getConnectionString = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!url) {
    console.error("DATABASE_INIT_ERROR: No URL found in process.env");
    return null;
  }

  if (url.trim() === "" || url === "undefined") {
    console.error(`DATABASE_INIT_ERROR: URL is invalid string: "${url}"`);
    return null;
  }

  console.log("DATABASE_INIT_SUCCESS: Found URL of length:", url.length);
  return url.trim();
};

const createPrismaClient = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return new Proxy({} as PrismaClient, {
      get(target, prop) {
        // Return a helper if it's not a prisma method
        if (prop === "toString") return () => "PrismaClientProxy";

        throw new Error(
          "CRITICAL_DATABASE_ERROR: The connection string is missing from Vercel. " +
          "Please verify DATABASE_URL is set in Vercel Settings > Environment Variables " +
          "AND that you have REDEPLOYED the app."
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
