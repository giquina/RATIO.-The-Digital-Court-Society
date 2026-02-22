import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance monitoring — sample 10% in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session replay — capture 1% of sessions, 100% on error
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error exception captured",
    "Non-Error promise rejection captured",
    /Loading chunk \d+ failed/,
  ],
});
