"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  /** Current pathname — boundary resets automatically when this changes */
  pathname: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Route-aware error boundary for app pages.
 *
 * Unlike the global error.tsx, this boundary:
 * 1. Auto-resets when the user navigates to a different page (pathname change)
 * 2. Shows a compact, non-scary recovery UI instead of the full "An unexpected error" page
 * 3. Lets the user retry without losing their place in the sidebar
 *
 * Why this exists: Pages that use Convex useQuery/useMutation can crash
 * if the backend function isn't deployed yet or the connection drops.
 * Instead of nuking the entire layout, we catch the error and let the
 * user try again or navigate elsewhere.
 */
export class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || "Something went wrong",
    };
  }

  componentDidCatch(error: Error) {
    // Log but don't crash — the error is already captured by getDerivedStateFromError
    console.warn("[RouteErrorBoundary] Caught page error:", error.message);
  }

  componentDidUpdate(prevProps: Props) {
    // Auto-reset when the user navigates to a different page
    if (this.props.pathname !== prevProps.pathname && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: "" });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[50vh] px-6">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-burgundy/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-gold" />
            </div>
            <h2 className="font-serif text-lg font-bold text-court-text mb-2">
              Unable to load this page
            </h2>
            <p className="text-court-sm text-court-text-sec leading-relaxed mb-5">
              This is likely a temporary connection issue. Your session data is safe.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: "" })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy text-court-sm font-bold rounded-xl hover:bg-gold/90 transition-colors"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
