import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Checking database connection...");
    await prisma.$connect();
    console.log("SUCCESS: Database connected.");

    const userCount = await prisma.user.count();
    console.log(`SUCCESS: Found ${userCount} users in database.`);

    const orgCount = await prisma.organization.count();
    console.log(`SUCCESS: Found ${orgCount} organizations in database.`);

  } catch (error) {
    console.error("FAILURE: Could not connect to database.");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
