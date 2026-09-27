/**
 * Helper to generate direct WhatsApp share URLs with pre-formatted login credentials.
 */

export function cleanPhoneForWhatsApp(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  } else if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

export interface TenantWhatsAppMessageParams {
  tenantName: string;
  phone: string;
  email?: string | null;
  propertyCode?: string | null;
  unitNumber?: string | null;
  portalUrl?: string;
}

export function generateTenantWhatsAppMessage({
  tenantName,
  phone,
  email,
  propertyCode,
  unitNumber,
  portalUrl
}: TenantWhatsAppMessageParams): string {
  const loginUrl = portalUrl || (typeof window !== "undefined" ? `${window.location.origin}/login` : "https://tenant-app-wpa.vercel.app/login");
  const loginEmail = email || phone;
  const password = phone;

  let msg = `Hello *${tenantName}*,\n\n`;
  msg += `Welcome to your Tenant Portal! Your login account details are as follows:\n\n`;
  msg += `🌐 *Portal Link:* ${loginUrl}\n`;
  msg += `📧 *Login Email:* ${loginEmail}\n`;
  msg += `🔑 *Default Password:* ${password}\n\n`;

  if (propertyCode || unitNumber) {
    msg += `🏠 *Assigned Unit:* ${propertyCode || ""} ${unitNumber ? `- Unit ${unitNumber}` : ""}\n\n`;
  }

  msg += `You can log in anytime to view your rent statements, pay invoices, download receipts, and log maintenance tickets.\n\n`;
  msg += `Thank you!`;

  return msg;
}

export function getTenantWhatsAppShareLink(params: TenantWhatsAppMessageParams): string {
  const cleanPhone = cleanPhoneForWhatsApp(params.phone);
  const message = generateTenantWhatsAppMessage(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
