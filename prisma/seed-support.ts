import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const systemOrgId = "SYSTEM";

  // Ensure the SYSTEM organization exists
  await prisma.organization.upsert({
    where: { id: systemOrgId },
    update: {},
    create: {
      id: systemOrgId,
      name: "System",
      slug: "system",
      status: "ACTIVE",
    },
  });

  const categories = [
    { name: "Getting Started", slug: "getting-started" },
    { name: "Property Management", slug: "property-management" },
    { name: "Finance & Billing", slug: "finance-billing" },
    { name: "Tenant Management", slug: "tenant-management" },
    { name: "Maintenance", slug: "maintenance" },
    { name: "Security", slug: "security" },
    { name: "Utilities", slug: "utilities" },
    { name: "Reports", slug: "reports" },
    { name: "Field Operations", slug: "field-operations" },
    { name: "Property Inspection", slug: "property-inspection" },
    { name: "Meter Reading", slug: "meter-reading" },
    { name: "Troubleshooting", slug: "troubleshooting" },
    { name: "FAQs", slug: "faqs" },
  ];

  for (const cat of categories) {
    await prisma.supportCategory.upsert({
      where: { organizationId_slug: { organizationId: systemOrgId, slug: cat.slug } },
      update: {},
      create: {
        ...cat,
        organizationId: systemOrgId,
        isSystem: true,
      },
    });
  }

  console.log("Support categories seeded.");

  const expenseCategories = [
    { name: "Maintenance & Repairs", description: "General repairs and maintenance of the property." },
    { name: "Utilities", description: "Water, electricity, gas, and other utility bills." },
    { name: "Property Management Fees", description: "Fees paid to property managers or agencies." },
    { name: "Taxes & Insurance", description: "Property taxes and insurance premiums." },
    { name: "Cleaning & Landscaping", description: "Regular cleaning services and grounds maintenance." },
    { name: "Security Services", description: "Security guards, CCTV maintenance, and other security costs." },
    { name: "Legal & Professional Fees", description: "Lawyer fees, accounting services, and other professional costs." },
    { name: "Advertising & Marketing", description: "Costs for marketing vacant units." },
    { name: "Supplies & Materials", description: "Office supplies, cleaning materials, etc." },
    { name: "Miscellaneous", description: "Any other expenses not covered by the above categories." },
  ];

  for (const cat of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { organizationId_name: { organizationId: systemOrgId, name: cat.name } },
      update: {},
      create: {
        ...cat,
        organizationId: systemOrgId,
        isSystem: true,
      },
    });
  }

  console.log("Expense categories seeded.");

  // Seed default Collection Settings for the SYSTEM organization
  await prisma.collectionSetting.upsert({
    where: { organizationId: systemOrgId },
    update: {},
    create: {
      organizationId: systemOrgId,
      gracePeriod: 0,
      upcomingDueDays: "5,3,1",
      overdueDays: "1,3,7,14,30",
      autoEscalateAfter: 60,
      enableBalanceSms: false,
      firstSendDay: 16,
      repeatEvery: 3,
    },
  });

  console.log("Default collection settings seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
