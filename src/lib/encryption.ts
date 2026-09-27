import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = process.env.ENCRYPTION_SECRET || process.env.NEXTAUTH_SECRET || "tms-default-32-byte-secret-key-32";

function getDerivedKey(): Buffer {
  return crypto.scryptSync(SECRET_KEY, "tms-payment-salt", 32);
}

/**
 * Encrypts an object or string into an encrypted string payload (hex encoded iv:tag:ciphertext)
 */
export function encryptCredentials(data: Record<string, any> | string): string {
  const text = typeof data === "string" ? data : JSON.stringify(data);
  const iv = crypto.randomBytes(16);
  const key = getDerivedKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted string payload back into an object or string
 */
export function decryptCredentials<T = Record<string, any>>(encryptedData: string): T {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      // If raw JSON was passed (e.g., in development/seed data), try parsing directly
      return JSON.parse(encryptedData) as T;
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getDerivedKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted as unknown as T;
    }
  } catch (error) {
    console.error("Failed to decrypt credentials:", error);
    throw new Error("Credential decryption error");
  }
}

/**
 * Masks phone numbers for secure logging (e.g. 2547****1234)
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "N/A";
  const str = phone.trim();
  if (str.length <= 6) return "****";
  return `${str.slice(0, 4)}****${str.slice(-4)}`;
}
