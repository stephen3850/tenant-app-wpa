import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | any) {
  const value = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(value || 0);
}

export function formatDate(date: Date | string) {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "N/A";
  }
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Recursively converts Prisma Decimal objects, BigInts, and Dates to a plain,
 * serializable object that can safely cross the Server-to-Client Component boundary in Next.js 15.
 */
export function serialize<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  try {
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === "bigint") return value.toString();
        return value;
      })
    );
  } catch {
    return obj;
  }
}
