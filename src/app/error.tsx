"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-burgundy/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-gold" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-court-text mb-3">
          An Error Has Occurred
        </h1>
        <p className="text-court-text-sec text-court-base leading-relaxed mb-8">
          The Court extends its apologies. This matter has been logged and will
          be reviewed by the relevant authorities. You may attempt to resume
          proceedings.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-gold"
          >
            Resume Proceedings
          </button>
          <Link
            href="/home"
            className="btn-outline text-center hover:border-white/10 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
