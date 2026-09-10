import { Logger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

export class AlertService {
  /**
   * Triggers an alert for financial anomalies (e.g., massive overpayment or negative balance).
   */
  static async triggerFinancialAnomalyAlert(organizationId: string, details: any) {
    const message = `FINANCIAL ANOMALY DETECTED: Org ${organizationId}`;
    Logger.error(message, null, details, "FINANCE");

    Sentry.captureMessage(message, {
      level: "fatal",
      extra: details,
      tags: { organizationId, alertType: "FINANCIAL_ANOMALY" }
    });

    // Integration with Slack or PagerDuty Webhook would go here
  }

  /**
   * Triggers an alert for critical M-Pesa failures (e.g., multiple failed callbacks).
   */
  static async triggerMpesaFailureAlert(organizationId: string, error: any) {
    const message = `CRITICAL M-PESA FAILURE: Org ${organizationId}`;
    Logger.error(message, error, undefined, "MPESA");

    Sentry.captureException(error, {
      tags: { organizationId, alertType: "MPESA_FAILURE" }
    });
  }
}
