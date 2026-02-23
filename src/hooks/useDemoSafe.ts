"use client";

import { useQuery, useMutation } from "convex/react";

const IS_DEMO = !process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Wrapper around Convex useQuery that skips the query in demo mode
 * instead of conditionally calling the hook (which violates Rules of Hooks).
 *
 * In demo mode: returns `undefined` (same as loading state)
 * In live mode: delegates to Convex useQuery
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDemoQuery(queryRef: any, args?: Record<string, unknown>): any {
  // Always call useQuery — in demo mode, pass "skip" to prevent actual query
  return useQuery(queryRef, IS_DEMO ? "skip" : (args ?? {}));
}

/**
 * Wrapper around Convex useMutation that returns null in demo mode.
 * useMutation doesn't support "skip" — it always returns a callable function.
 * In demo mode we return null so callers can check before invoking.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDemoMutation(mutationRef: any): any {
  // Always call useMutation to maintain hook order
  const mutate = useMutation(mutationRef);
  if (IS_DEMO) return null;
  return mutate;
}
