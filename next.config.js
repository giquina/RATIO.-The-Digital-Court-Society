const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.convex.cloud" },
    ],
  },

  allowedDevOrigins: ["localhost", "127.0.0.1", "http://localhost", "http://127.0.0.1"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://us-assets.i.posthog.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.convex.cloud https://www.googletagmanager.com",
              "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://www.google-analytics.com https://us.i.posthog.com https://api.stripe.com https://*.sentry.io https://*.ingest.us.sentry.io https://api.elevenlabs.io https://vitals.vercel-insights.com",
              "frame-src 'self' https://js.stripe.com https://*.daily.co",
              "media-src 'self' blob: https://*.convex.cloud",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ratiothedigitalcourtsociety.com" }],
        destination: "https://ratiothedigitalcourtsociety.com/:path*",
        permanent: true,
      },
      {
        source: "/community",
        destination: "/society",
        permanent: true,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /@prisma\/instrumentation/ },
      ];
    }
    return config;
  },
};

// Only wrap with Sentry build plugin if auth token is available
// (prevents build failures when SENTRY_AUTH_TOKEN is not set on Vercel)
module.exports = process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      tunnelRoute: "/monitoring",
    })
  : nextConfig;
