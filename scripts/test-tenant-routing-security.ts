import { tenantRoutes, organizationRoutes, landlordRoutes, adminRoutes, getDashboardForRole } from "../src/lib/routes";
import fs from "fs";
import path from "path";

async function runRoutingSecurityAudit() {
  console.log("==================================================");
  console.log("TMS TENANT PORTAL - ROUTING & SECURITY AUDIT TEST");
  console.log("==================================================\n");

  let failures = 0;

  // 1. Test Centralized Route Helpers
  console.log("[TEST 1] Testing Centralized Route Helpers...");

  const testCases = [
    { name: "Tenant Dashboard", actual: tenantRoutes.dashboard(), expected: "/portal/dashboard" },
    { name: "Tenant Invoices", actual: tenantRoutes.invoices(), expected: "/portal/invoices" },
    { name: "Tenant Invoice Detail", actual: tenantRoutes.invoice("inv-123"), expected: "/portal/invoices/inv-123" },
    { name: "Tenant Payments", actual: tenantRoutes.payments(), expected: "/portal/payments" },
    { name: "Tenant Pay Invoice", actual: tenantRoutes.payInvoice("inv-123"), expected: "/portal/payments?invoice=inv-123" },
    { name: "Tenant Receipts", actual: tenantRoutes.receipts(), expected: "/portal/receipts" },
    { name: "Tenant Receipt Detail", actual: tenantRoutes.receipt("rcp-123"), expected: "/portal/receipts/rcp-123" },
    { name: "Tenant Lease", actual: tenantRoutes.lease(), expected: "/portal/lease" },
    { name: "Tenant Documents", actual: tenantRoutes.documents(), expected: "/portal/documents" },
    { name: "Tenant Document Detail", actual: tenantRoutes.document("doc-123"), expected: "/portal/documents/doc-123" },
    { name: "Tenant Tickets", actual: tenantRoutes.tickets(), expected: "/portal/tickets" },
    { name: "Tenant Ticket Detail", actual: tenantRoutes.ticket("tkt-123"), expected: "/portal/tickets/tkt-123" },
    { name: "Tenant Reports", actual: tenantRoutes.reports(), expected: "/portal/reports" },
    { name: "Tenant Profile", actual: tenantRoutes.profile(), expected: "/portal/profile" },
  ];

  for (const tc of testCases) {
    if (tc.actual === tc.expected) {
      console.log(`  ✓ ${tc.name}: ${tc.actual}`);
    } else {
      console.error(`  ✕ ${tc.name} FAILED! Got "${tc.actual}", expected "${tc.expected}"`);
      failures++;
    }
  }

  // 2. Test Role-Aware Dashboard Redirection Helper
  console.log("\n[TEST 2] Testing Role-Aware Dashboard Resolution...");
  const roleTests = [
    { roles: ["TENANT"], expected: "/portal/dashboard" },
    { roles: ["PROPERTY_MANAGER"], expected: "/dashboard" },
    { roles: ["LANDLORD"], expected: "/landlord/dashboard" },
    { roles: ["PLATFORM_ADMIN"], expected: "/admin/dashboard" },
  ];

  for (const rt of roleTests) {
    const res = getDashboardForRole(rt.roles);
    if (res === rt.expected) {
      console.log(`  ✓ Roles [${rt.roles.join(", ")}] -> ${res}`);
    } else {
      console.error(`  ✕ Roles [${rt.roles.join(", ")}] FAILED! Got "${res}", expected "${rt.expected}"`);
      failures++;
    }
  }

  // 3. Scan Tenant Components for Un-namespaced Links
  console.log("\n[TEST 3] Scanning Tenant Components for Un-namespaced Links...");

  const tenantCompDir = path.join(process.cwd(), "src", "features", "tenant", "components");
  const compFiles = fs.readdirSync(tenantCompDir).filter(f => f.endsWith(".tsx") || f.endsWith(".ts"));

  const forbiddenPatterns = [
    /href=["'`]\/invoices/g,
    /href=["'`]\/payments/g,
    /href=["'`]\/receipts/g,
    /href=["'`]\/documents/g,
    /href=["'`]\/announcements/g,
    /href=["'`]\/notifications/g,
    /href=["'`]\/maintenance/g,
    /href=["'`]\/lease/g,
    /router\.push\(["'`]\/invoices/g,
    /router\.push\(["'`]\/payments/g,
    /router\.push\(["'`]\/receipts/g,
    /router\.push\(["'`]\/documents/g,
    /router\.push\(["'`]\/announcements/g,
    /router\.push\(["'`]\/notifications/g,
  ];

  for (const file of compFiles) {
    const filePath = path.join(tenantCompDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    let fileHasIssue = false;
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        console.error(`  ✕ Forbidden un-namespaced link pattern ${pattern} found in ${file}`);
        fileHasIssue = true;
        failures++;
      }
    }
    if (!fileHasIssue) {
      console.log(`  ✓ ${file}: Clean (no un-namespaced tenant links)`);
    }
  }

  // 4. Scan App Tenant Routes for Un-namespaced Redirects or Links
  console.log("\n[TEST 4] Scanning Tenant Page Routes for Un-namespaced Nav...");
  const tenantAppDir = path.join(process.cwd(), "src", "app", "(tenant)", "portal");

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes('redirect("/dashboard")')) {
          console.error(`  ✕ Dangerous redirect("/dashboard") found in ${path.relative(process.cwd(), fullPath)}`);
          failures++;
        } else {
          console.log(`  ✓ ${path.relative(process.cwd(), fullPath)}: Clean`);
        }
      }
    }
  }

  scanDir(tenantAppDir);

  console.log("\n==================================================");
  if (failures === 0) {
    console.log("SUCCESS: ALL ROUTING & SECURITY TESTS PASSED (0 ERRORS)");
  } else {
    console.error(`FAILURE: ${failures} AUDIT ISSUE(S) DETECTED`);
    process.exit(1);
  }
}

runRoutingSecurityAudit().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
