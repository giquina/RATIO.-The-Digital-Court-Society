"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0C1220",
          color: "#F2EDE6",
          fontFamily: "DM Sans, system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            An unexpected error has occurred
          </h1>
          <p
            style={{
              color: "rgba(242,237,230,0.6)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            The Court extends its apologies. This matter has been logged and
            will be reviewed. You may attempt to resume proceedings.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#C9A84C",
              color: "#0C1220",
              fontWeight: 700,
              border: "none",
              borderRadius: "12px",
              padding: "12px 32px",
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Resume Proceedings
          </button>
        </div>
      </body>
    </html>
  );
}
