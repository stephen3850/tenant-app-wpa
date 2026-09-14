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
    console.error("[DB_INIT] CRITICAL: DATABASE_URL is completely missing from process.env");
    return null;
  }

  // Handle potential quoting issues and hidden characters
  // Also check if Vercel has passed a literal "undefined" string
  let cleaned = url.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[\r\n]/g, "");

  if (cleaned === "undefined" || cleaned === "null" || cleaned === "") {
    console.error("[DB_INIT] CRITICAL: DATABASE_URL is set to a placeholder string:", cleaned);
    return null;
  }

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

    // LIST ALL ENV KEYS (not values) to debug Vercel visibility
    const allEnvKeys = Object.keys(process.env).sort().join(', ');
    console.error(`[DB_INIT] CRITICAL ERROR: DATABASE_URL is missing. Available env keys: ${allEnvKeys}`);

    throw new Error(
      `DATABASE_CONFIGURATION_ERROR: The database connection string (DATABASE_URL) is missing or empty in the production environment. ` +
      `Please check Vercel Settings > Environment Variables. ` +
      `Available environment keys detected: [${allEnvKeys.substring(0, 100)}...]`
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

// Use a proxy to ensure the database client is ONLY initialized when first accessed.
// This prevents build-time crashes and allows us to capture errors at the exact moment of use.
const createLazyDb = () => {
  let _instance: PrismaClient | null = null;

  return new Proxy({} as PrismaClient, {
    get(target, prop, receiver) {
      // Return the constructor name if requested (useful for some libraries)
      if (prop === 'constructor') return PrismaClient;

      if (!_instance) {
        _instance = createPrismaClient();
      }
      // @ts-ignore
      const value = Reflect.get(_instance, prop, receiver);
      return typeof value === 'function' ? value.bind(_instance) : value;
    }
  });
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || createLazyDb();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
