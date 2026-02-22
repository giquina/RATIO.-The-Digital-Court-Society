import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gold font-serif text-6xl font-bold mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold text-court-text mb-3">
          Page Not Found
        </h1>
        <p className="text-court-text-sec text-court-base leading-relaxed mb-8">
          The matter you have requested does not appear in the Court records.
          It may have been moved, withdrawn, or never filed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-gold text-center"
          >
            Return to the Lobby
          </Link>
          <Link
            href="/home"
            className="btn-outline text-center hover:border-white/10 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
