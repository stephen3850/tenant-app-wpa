import { AdminProfileRepository } from "../repositories/admin-profile-repository";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export class AdminProfileService {
  private repository = new AdminProfileRepository();

  async getProfile(userId: string) {
    const profile = await this.repository.getProfile(userId);
    if (!profile) throw new Error("Super Admin profile not found");
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    return this.repository.updateProfile(userId, {
      name: data.name,
      phone: data.phone,
      preferredLanguage: data.preferredLanguage,
      preferredTimeZone: data.preferredTimeZone,
      image: data.image,
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.repository.getProfile(userId);
    if (!user || !user.password) throw new Error("User not found or password not set");

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) throw new Error("Incorrect current password");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return this.repository.updateProfile(userId, {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    });
  }

  async getSessions(userId: string) {
    return this.repository.getSessions(userId);
  }

  async revokeSession(sessionToken: string) {
    return this.repository.revokeSession(sessionToken);
  }

  async revokeAllOtherSessions(userId: string, currentSessionToken: string) {
    return this.repository.revokeAllOtherSessions(userId, currentSessionToken);
  }

  async getLoginHistory(userId: string) {
    return this.repository.getLoginHistory(userId);
  }

  async updateNotifications(userId: string, data: any) {
    return this.repository.updateNotificationPreferences(userId, data);
  }

  async getApiTokens(userId: string) {
    return this.repository.getApiTokens(userId);
  }

  async createApiToken(userId: string, name: string, scopes: string[], expiresAt?: Date) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const tokenRecord = await this.repository.createApiToken({
      name,
      token: hashedToken,
      scopes,
      expiresAt,
      user: { connect: { id: userId } },
    });

    return {
      ...tokenRecord,
      secret: rawToken, // Only return the raw token once during creation
    };
  }

  async revokeApiToken(tokenId: string, userId: string) {
    return this.repository.revokeApiToken(tokenId, userId);
  }
}
