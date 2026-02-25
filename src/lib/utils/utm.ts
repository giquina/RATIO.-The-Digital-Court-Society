// ═══════════════════════════════════════════
// UTM PARAMETER CAPTURE
// ═══════════════════════════════════════════
// Captures UTM parameters from landing page URLs and stores them
// in sessionStorage. Retrieved on signup to populate signupAttribution.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "ratio_utm";

export interface UTMData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrerUrl?: string;
  landingPage?: string;
}

/** Call on landing page mount. Reads UTM params from URL, stores in sessionStorage. */
export function captureUTMParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const hasUTM = UTM_KEYS.some((key) => params.has(key));
  if (!hasUTM) return;

  const data: UTMData = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    referrerUrl: document.referrer || undefined,
    landingPage: window.location.pathname,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private browsing, etc.)
  }
}

/** Retrieve stored UTM data. Returns null if none captured. */
export function getStoredUTM(): UTMData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UTMData;
  } catch {
    return null;
  }
}

/** Clear UTM data after use (e.g., after recording attribution). */
export function clearUTM(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
