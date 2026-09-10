import { MonitoringRepository } from "../repositories/monitoring-repository";

export class MonitoringService {
  private repository = new MonitoringRepository();

  async getHealthDashboard() {
    return this.repository.getSystemHealth();
  }

  async getIntegrations() {
    return this.repository.getIntegrationHealth();
  }

  async getSentryErrors() {
    // Mocking Sentry API response
    return {
      total: 154,
      critical: 3,
      unresolved: 24,
      trends: [12, 15, 8, 22, 18, 14, 10], // Last 7 days
      recent: [
        { id: "1", title: "PrismaClientKnownRequestError: P2002", count: 45, level: "error", lastSeen: new Date() },
        { id: "2", title: "TypeError: Cannot read property 'id' of undefined", count: 89, level: "error", lastSeen: new Date() },
        { id: "3", title: "MpesaCallbackTimeout", count: 12, level: "fatal", lastSeen: new Date() },
      ]
    };
  }

  async getAxiomLogs(query: string = "") {
    // Mocking Axiom structured logs
    return [
      { timestamp: new Date(), level: "ERROR", service: "api-gateway", message: "Failed to authenticate request", org: "org_123" },
      { timestamp: new Date(), level: "WARN", service: "payment-worker", message: "Retrying M-Pesa callback for trans_abc", org: "org_456" },
      { timestamp: new Date(), level: "INFO", service: "auth-service", message: "User login successful", userId: "user_789" },
      { timestamp: new Date(), level: "SECURITY", service: "shield", message: "Detected brute force attempt from 192.168.1.1", severity: "HIGH" },
    ].filter(log => log.message.toLowerCase().includes(query.toLowerCase()) || log.level.includes(query.toUpperCase()));
  }

  async getAlerts() {
    return this.repository.getAlertRules();
  }

  async getStatusPageData() {
    return this.repository.getStatusEntries();
  }
}
