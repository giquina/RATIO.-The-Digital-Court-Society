"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  /** What to show if the query crashes (e.g. function not deployed yet) */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches errors from Convex useQuery calls inside children.
 *
 * Why this exists: When new Convex functions/tables are added in code
 * but not yet deployed to the Convex server, useQuery throws a
 * "function not found" error. This boundary catches that and renders
 * a fallback instead of crashing the whole page.
 *
 * Once Convex is deployed with the new schema, this boundary becomes
 * transparent — the children render normally with no errors to catch.
 */
export class QuerySafeBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log but don't crash — this is expected when Convex schema
    // hasn't been deployed yet
    console.warn("[QuerySafeBoundary] Caught query error:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
