import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";

type LogLevel = "info" | "warn" | "error" | "debug" | "fatal";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  environment: string;
  service: string;
  context?: string;
  organizationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    cause?: any;
  };
}

export class Logger {
  private static serviceName = "tms-v1-core";
  private static environment = process.env.NODE_ENV || "development";

  private static async getContext() {
    try {
      // headers() is async in Next.js 15 and can only be called in request context
      const headerList = await headers();
      if (!headerList) return { correlationId: "no-headers" };

      return {
        correlationId: headerList.get("x-correlation-id") || "system-generated",
        organizationId: headerList.get("x-organization-id") || undefined,
        userId: headerList.get("x-user-id") || undefined,
      };
    } catch {
      // Fallback for background jobs, static generation, or early middleware
      return { correlationId: "background-job" };
    }
  }

  private static async log(entry: Omit<LogEntry, "timestamp" | "environment" | "service" | "correlationId">) {
    const context = await this.getContext();
    const fullEntry: LogEntry = {
      ...entry,
      ...context,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      service: this.serviceName,
    };

    // 1. Structured Logging (Stdout for ELK/Axiom/Datadog)
    if (this.environment === "production") {
      console.log(JSON.stringify(fullEntry));
    } else {
      // Pretty print for development
      const color = entry.level === "error" ? "\x1b[31m" : entry.level === "warn" ? "\x1b[33m" : "\x1b[32m";
      console.log(`${color}[${fullEntry.level.toUpperCase()}]\x1b[0m ${fullEntry.message}`, entry.metadata || "");
    }

    // 2. Sentry Integration
    if (Sentry && (entry.level === "error" || entry.level === "fatal")) {
       Sentry.captureMessage(entry.message, {
         level: entry.level as any,
         extra: entry.metadata,
         tags: {
           context: entry.context,
           organizationId: fullEntry.organizationId,
           correlationId: fullEntry.correlationId,
         },
       });
    }
  }

  static info(message: string, metadata?: Record<string, any>, context?: string) {
    this.log({ level: "info", message, metadata, context });
  }

  static warn(message: string, metadata?: Record<string, any>, context?: string) {
    this.log({ level: "warn", message, metadata, context });
  }

  static error(message: string, error?: any, metadata?: Record<string, any>, context?: string) {
    this.log({
      level: "error",
      message,
      metadata,
      context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      } : { name: "UnknownError", message: String(error) },
    });
  }

  static fatal(message: string, error?: any, metadata?: Record<string, any>, context?: string) {
    this.log({
      level: "fatal",
      message,
      metadata,
      context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }
}
