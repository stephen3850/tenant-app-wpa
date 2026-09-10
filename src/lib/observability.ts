import * as Sentry from "@sentry/nextjs";
import { Logger } from "./logger";
import { headers } from "next/headers";

/**
 * Higher-order function to wrap Server Actions with observability.
 */
export function withObservability<T extends (...args: any[]) => Promise<any>>(
  actionName: string,
  fn: T
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const startTime = Date.now();
    const correlationId = (await headers()).get("x-correlation-id") || "unknown";

    try {
      const result = await fn(...args);

      const duration = Date.now() - startTime;
      if (duration > 500) { // Log slow actions
        Logger.warn(`Slow Action: ${actionName}`, { duration, actionName, correlationId });
      }

      return result;
    } catch (error) {
      Logger.error(`Action Failed: ${actionName}`, error, {
        actionName,
        args: JSON.stringify(args),
        correlationId
      });

      Sentry.captureException(error, {
        tags: { actionName, correlationId },
        extra: { args }
      });

      throw error;
    }
  };
}

/**
 * Utility to track financial anomalies.
 */
export async function trackFinancialAnomaly(
  type: "OVERPAYMENT" | "NEGATIVE_BALANCE" | "LARGE_REVERSAL",
  data: Record<string, any>
) {
  const correlationId = (await headers()).get("x-correlation-id") || "system";

  Logger.warn(`Financial Anomaly: ${type}`, data, "FINANCE");

  Sentry.captureMessage(`Financial Anomaly: ${type}`, {
    level: "warning",
    extra: { ...data, correlationId },
    tags: { anomalyType: type }
  });
}
