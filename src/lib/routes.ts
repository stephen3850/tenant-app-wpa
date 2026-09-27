/**
 * Centralized Route Definitions and Helpers for TMS
 * Ensures strict separation between Tenant, Organization, Landlord, and Admin namespaces.
 */

export const tenantRoutes = {
  dashboard: () => "/portal/dashboard",

  invoices: () => "/portal/invoices",
  invoice: (id: string) => `/portal/invoices/${id}`,

  payments: () => "/portal/payments",
  payment: (id: string) => `/portal/payments/${id}`,
  payInvoice: (invoiceId: string) => `/portal/payments?invoice=${encodeURIComponent(invoiceId)}`,

  receipts: () => "/portal/receipts",
  receipt: (id: string) => `/portal/receipts/${id}`,

  lease: () => "/portal/lease",

  documents: () => "/portal/documents",
  document: (id: string) => `/portal/documents/${id}`,

  tickets: () => "/portal/tickets",
  ticket: (id: string) => `/portal/tickets/${id}`,
  newTicket: (subject?: string) =>
    subject ? `/portal/tickets/new?subject=${encodeURIComponent(subject)}` : "/portal/tickets/new",

  announcements: () => "/portal/announcements",
  announcement: (id: string) => `/portal/announcements/${id}`,

  notifications: () => "/portal/notifications",
  notification: (id: string) => `/portal/notifications/${id}`,

  reports: () => "/portal/reports",

  profile: () => "/portal/profile",
};

export const organizationRoutes = {
  dashboard: () => "/dashboard",
  invoices: () => "/invoices",
  invoice: (id: string) => `/invoices/${id}`,
  payments: () => "/payments",
  payment: (id: string) => `/payments/${id}`,
  tenants: () => "/tenants",
  leases: () => "/leases",
  documents: () => "/documents",
  tickets: () => "/tickets",
  reports: () => "/reports",
  settings: () => "/settings",
};

export const landlordRoutes = {
  dashboard: () => "/landlord/dashboard",
  documents: () => "/landlord/documents",
  financials: () => "/landlord/financials",
  profile: () => "/landlord/profile",
  communication: () => "/landlord/communication",
};

export const adminRoutes = {
  dashboard: () => "/admin/dashboard",
  users: () => "/admin/users",
  organizations: () => "/admin/organizations",
  settings: () => "/admin/settings",
};

/**
 * Returns the correct primary dashboard route based on user roles
 */
export function getDashboardForRole(roles: string[] = []): string {
  if (roles.includes("TENANT")) {
    return tenantRoutes.dashboard();
  }
  if (roles.includes("LANDLORD")) {
    return landlordRoutes.dashboard();
  }
  if (roles.includes("PLATFORM_ADMIN") || roles.includes("SUPER_ADMIN")) {
    return adminRoutes.dashboard();
  }
  return organizationRoutes.dashboard();
}
