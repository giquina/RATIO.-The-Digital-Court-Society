"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";

/**
 * Provides the user context object needed by AI API routes.
 * Returns undefined while loading, or a context object with userType,
 * professionalRole, and practiceAreas. Designed to be spread directly
 * into /api/ai/chat and /api/ai/feedback request bodies.
 */
export function useAIUserContext() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);

  if (!profile) return undefined;

  return {
    userType: (profile.userType as "student" | "professional") || "student",
    professionalRole: profile.professionalRole as string | undefined,
    practiceAreas: profile.practiceAreas as string[] | undefined,
  };
}
