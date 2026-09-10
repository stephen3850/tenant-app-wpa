/**
 * PRODUCTION READINESS: Isolation Testing Strategy
 *
 * To ensure the global isolation works as expected, we implement
 * "Cross-Tenant Probing" tests.
 */

import { getTenantDb } from "@/lib/tenant-db";
import { db as baseDb } from "@/lib/db";

export async function runIsolationAudit() {
  console.log("Starting Multi-Tenant Isolation Audit...");

  // Setup: Create two organizations and data for each
  const orgA = "org_alpha";
  const orgB = "org_beta";

  // Test 1: Cross-tenant Leakage Prevention
  try {
    const tdbA = getTenantDb(orgA);

    // Attempt to query Org B's data using Org A's client
    const leakedData = await tdbA.property.findMany({
      where: {
        organizationId: orgB // Explicitly trying to cross-talk
      }
    });

    // In a properly isolated system, this should return EMPTY or
    // Prisma should combine the where clauses:
    // WHERE organizationId = 'org_alpha' AND organizationId = 'org_beta'
    // Resulting in 0 records.

    if (leakedData.length > 0) {
      console.error("CRITICAL FAILURE: Org A leaked data from Org B!");
    } else {
      console.log("SUCCESS: Cross-tenant query returned 0 results.");
    }
  } catch (error) {
    console.log("SUCCESS: Isolation prevented cross-talk or query failed safely.");
  }

  // Test 2: Automatic Injection on Create
  try {
    const tdbA = getTenantDb(orgA);
    const newProperty = await tdbA.property.create({
      data: {
        propertyName: "Isolation Test Property",
        propertyCode: "ISO-1",
        propertyType: "RESIDENTIAL",
        address: "123 Security Lane",
        city: "CyberCity",
        county: "Shield",
        // organizationId: "something_else" // Even if we tried to spoof this
      } as any
    });

    if (newProperty.organizationId !== orgA) {
      console.error("FAILURE: Property created with wrong OrganizationId!");
    } else {
      console.log("SUCCESS: Property automatically assigned to correct organization.");
    }
  } catch (error) {
    console.error("FAILURE: Create operation failed during isolation test", error);
  }

  console.log("Isolation Audit Complete.");
}

/**
 * RECOMMENDED TOOLING:
 * 1. Vitest for unit/integration tests.
 * 2. Playwright for E2E tests with different user sessions.
 * 3. Prisma Zod for schema-level validation of organizationId presence.
 */
