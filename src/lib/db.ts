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
  // Check for ALL possible Vercel/Neon environment variables to be extremely thorough
  const url = process.env.DATABASE_URL ||
              process.env.POSTGRES_URL ||
              process.env.POSTGRES_PRISMA_URL ||
              process.env.POSTGRES_URL_NON_POOLING ||
              process.env.NEON_DATABASE_URL;

  if (!url) {
    console.error("[DB_INIT] Error: No database connection string found in process.env");
    return null;
  }

  // Handle potential quoting issues and hidden characters common in Vercel/Neon copy-pastes
  const cleaned = url.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[\r\n]/g, "");

  if (!cleaned || cleaned === "undefined" || cleaned === "null" || cleaned.length < 10) {
    console.error("[DB_INIT] Error: Database connection string is invalid or effectively empty.");
    return null;
  }

  return cleaned;
};

const createPrismaClient = () => {
  // During Next.js build phase, process.env.DATABASE_URL might be missing.
  // We should not throw an error during the build, only at runtime.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  const connectionString = getConnectionString();

  if (!connectionString) {
    if (isBuildPhase) {
      console.warn("[DB_INIT] Warning: No connection string found during build phase. Skipping initialization.");
      return null as any;
    }

    const envKeys = Object.keys(process.env).filter(key =>
      key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON')
    ).join(', ');

    throw new Error(
      `DATABASE_CONFIGURATION_ERROR: No valid database connection string was found at runtime. ` +
      `Available environment keys: [${envKeys || 'None'}]. ` +
      `Please ensure DATABASE_URL is set in Vercel Settings > Environment Variables.`
    );
  }

  try {
    const pool = new Pool({
      connectionString: connectionString,
      max: 2,
      connectionTimeoutMillis: 10000,
      ssl: true
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });

    const adapter = new PrismaNeon(pool as any);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err: any) {
    const prefix = connectionString ? connectionString.substring(0, 15) : "None";
    throw new Error(`DATABASE_DRIVER_ERROR: ${err.message} (Connection string prefix: ${prefix}...)`);
  }
};

// Use a getter to prevent initialization during module load (especially during build)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
