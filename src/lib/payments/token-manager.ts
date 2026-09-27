import { db } from "@/lib/db";
import { MpesaCredentialsConfig } from "./types";

export class MpesaTokenManager {
  /**
   * Retrieves a cached access token for the given paymentAccountId.
   * Fetches a new token from Safaricom if missing or near expiration.
   */
  async getAccessToken(paymentAccountId: string, config: MpesaCredentialsConfig): Promise<string> {
    const now = new Date();
    // Safety buffer: treat token as expired if it expires within 120 seconds
    const expirationThreshold = new Date(now.getTime() + 120 * 1000);

    const existingToken = await db.mpesaToken.findUnique({
      where: { paymentAccountId },
    });

    if (existingToken && existingToken.expiresAt > expirationThreshold) {
      return existingToken.accessToken;
    }

    // Obtain new token from Safaricom
    const newTokenData = await this.fetchNewTokenFromSafaricom(config);

    // Default Safaricom expiry is 3599 seconds (~1 hour)
    const expiresInSeconds = Number(newTokenData.expires_in) || 3599;
    const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

    await db.mpesaToken.upsert({
      where: { paymentAccountId },
      update: {
        accessToken: newTokenData.access_token,
        expiresAt,
      },
      create: {
        paymentAccountId,
        accessToken: newTokenData.access_token,
        expiresAt,
      },
    });

    return newTokenData.access_token;
  }

  private async fetchNewTokenFromSafaricom(config: MpesaCredentialsConfig) {
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
    const baseUrl =
      config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("M-Pesa OAuth Error:", errorText);
      throw new Error(`Failed to obtain M-Pesa access token from Safaricom: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const mpesaTokenManager = new MpesaTokenManager();
