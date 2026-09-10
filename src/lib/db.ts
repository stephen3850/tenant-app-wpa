import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
  var prisma: PrismaClient | undefined;
}

// Only use ws in Node.js environments. In Edge environments (like Middleware),
// globalThis.WebSocket is already defined.
if (typeof window === 'undefined' && !globalThis.WebSocket) {
  // We use dynamic import to avoid bundling ws for the browser or edge
  import('ws').then((ws) => {
    neonConfig.webSocketConstructor = ws.default;
  });
}

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const db = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
