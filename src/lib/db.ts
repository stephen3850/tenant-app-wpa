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
  const connectionString = getConnectionString();

  if (!connectionString) {
    // Collect all database-related env keys for diagnostics (names only, no values for security)
    const envKeys = Object.keys(process.env).filter(key =>
      key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON')
    ).join(', ');

    throw new Error(
      `DATABASE_CONFIGURATION_ERROR: No valid database connection string was found at runtime. ` +
      `Available environment keys: [${envKeys || 'None'}]. ` +
      `Please ensure DATABASE_URL is set in Vercel Settings > Environment Variables and that the project has been redeployed.`
    );
  }

  try {
    // Neon Serverless specific pool configuration.
    // We use the connectionString directly to ensure pg/neon-serverless parses it correctly.
    const pool = new Pool({
      connectionString: connectionString,
      // For Serverless environments, we keep the pool size small to avoid hitting Neon limits
      max: 2,
      connectionTimeoutMillis: 10000,
      // Explicitly enable SSL
      ssl: true
    });

    // Handle idle client errors to prevent crashes in long-running serverless functions
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });

    const adapter = new PrismaNeon(pool as any);

    // Create Prisma client with the Neon adapter
    return new PrismaClient({
      adapter,
      // Also pass the datasource URL to the client to ensure the engine is correctly aware of the target
      datasources: {
        db: {
          url: connectionString
        }
      },
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err: any) {
    // Provide safe diagnostic info: string prefix + error message
    const prefix = connectionString.substring(0, 15);
    throw new Error(`DATABASE_DRIVER_ERROR: ${err.message} (Connection string prefix: ${prefix}...)`);
  }
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
