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
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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
 * Recursively converts Prisma Decimal objects to numbers and ensures
 * the object is a plain object that can be passed from Server to Client Components.
 */
export function serialize<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Prisma.Decimal (decimal.js)
  // These objects have d, e, s properties and a toJSON method
  if (
    typeof obj === "object" &&
    (obj as any).constructor &&
    ((obj as any).constructor.name === "Decimal" || (obj as any).d !== undefined) &&
    (obj as any).toNumber
  ) {
    return (obj as any).toNumber();
  }

  // Handle Dates
  if (obj instanceof Date) {
    return obj as any;
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => serialize(item)) as any;
  }

  // Handle Objects
  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serialize(value);
    }
    return result;
  }

  return obj;
}
