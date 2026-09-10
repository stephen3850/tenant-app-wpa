"use client";

import React, { ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="text-center">
            <h2 className="text-lg font-bold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">The error has been reported to our engineering team.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
