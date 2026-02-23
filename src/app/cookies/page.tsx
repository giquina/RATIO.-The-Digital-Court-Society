import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for Ratio. — The Digital Court Society. Learn how we use cookies and how to manage your preferences.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-court-text-ter text-court-sm hover:text-court-text-sec transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Return to home
        </Link>

        <div className="mb-8">
          <p className="font-serif text-lg font-bold tracking-[0.12em] mb-1">
            RATIO<span className="text-gold">.</span>
          </p>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-court-text">
            Cookie Policy
          </h1>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last updated: 23 February 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. What Are Cookies */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              1. What Are Cookies
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when
              you visit a website. They are widely used to make websites work
              more efficiently and to provide information to the site operators.
              Some cookies are essential for the website to function, while
              others help us understand how you use the platform so we can
              improve it.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              We also use similar technologies such as{" "}
              <span className="font-medium text-court-text">localStorage</span>{" "}
              to store preferences and consent choices on your device.
            </p>
          </section>

          {/* 2. How We Use Cookies */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              2. How We Use Cookies
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. uses a minimal number of cookies and local storage items.
              We do not use advertising cookies, tracking pixels, or
              fingerprinting technologies. Our cookies fall into three
              categories, described below.
            </p>
          </section>

          {/* 3. Cookie Categories */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              3. Cookie Categories
            </h2>

            {/* Strictly Necessary */}
            <div className="mb-6">
              <h3 className="text-court-base font-bold text-court-text mb-2">
                Strictly Necessary
              </h3>
              <p className="text-court-base text-court-text-sec leading-relaxed mb-3">
                These cookies are essential for the platform to function. They
                enable core features such as authentication, session management,
                and security protections. They cannot be disabled.
              </p>
              <div className="bg-white/[0.03] border border-court-border rounded-court p-4">
                <ul className="list-disc list-inside space-y-1.5 text-court-sm text-court-text-sec">
                  <li>
                    <span className="font-medium text-court-text">
                      Authentication tokens
                    </span>{" "}
                    &mdash; Convex Auth session tokens that keep you signed in
                  </li>
                  <li>
                    <span className="font-medium text-court-text">
                      CSRF protection
                    </span>{" "}
                    &mdash; Security tokens that prevent cross-site request
                    forgery
                  </li>
                  <li>
                    <span className="font-medium text-court-text">
                      Cookie consent
                    </span>{" "}
                    &mdash; Your preference stored in localStorage (
                    <code className="text-court-xs bg-white/[0.06] px-1 rounded">
                      ratio-cookie-consent
                    </code>
                    )
                  </li>
                </ul>
              </div>
            </div>

            {/* Functional */}
            <div className="mb-6">
              <h3 className="text-court-base font-bold text-court-text mb-2">
                Functional
              </h3>
              <p className="text-court-base text-court-text-sec leading-relaxed mb-3">
                These store your display preferences and interface settings in
                localStorage. They improve your experience but are not essential
                for the platform to operate.
              </p>
              <div className="bg-white/[0.03] border border-court-border rounded-court p-4">
                <ul className="list-disc list-inside space-y-1.5 text-court-sm text-court-text-sec">
                  <li>
                    <span className="font-medium text-court-text">
                      Sidebar state
                    </span>{" "}
                    &mdash; Whether the sidebar is collapsed or expanded
                  </li>
                  <li>
                    <span className="font-medium text-court-text">
                      Splash screen
                    </span>{" "}
                    &mdash; Whether you have seen the welcome animation
                  </li>
                  <li>
                    <span className="font-medium text-court-text">
                      Display preferences
                    </span>{" "}
                    &mdash; Notification settings and view preferences
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h3 className="text-court-base font-bold text-court-text mb-2">
                Analytics
              </h3>
              <p className="text-court-base text-court-text-sec leading-relaxed mb-3">
                These cookies are set by Google Analytics 4 and help us
                understand how Advocates use the platform. They collect
                anonymised data only. These cookies are{" "}
                <span className="font-medium text-court-text">
                  only loaded after you give consent
                </span>{" "}
                via the privacy notice banner.
              </p>
              <div className="bg-white/[0.03] border border-court-border rounded-court p-4">
                <ul className="list-disc list-inside space-y-1.5 text-court-sm text-court-text-sec">
                  <li>
                    <span className="font-medium text-court-text">
                      <code className="text-court-xs bg-white/[0.06] px-1 rounded">
                        _ga
                      </code>
                    </span>{" "}
                    &mdash; Distinguishes unique visitors (expires after 2
                    years)
                  </li>
                  <li>
                    <span className="font-medium text-court-text">
                      <code className="text-court-xs bg-white/[0.06] px-1 rounded">
                        _ga_*
                      </code>
                    </span>{" "}
                    &mdash; Maintains session state (expires after 2 years)
                  </li>
                </ul>
                <p className="text-court-xs text-court-text-ter mt-3">
                  IP addresses are anonymised. No personal data is shared with
                  third parties. Cookie flags are set to{" "}
                  <code className="bg-white/[0.06] px-1 rounded">
                    SameSite=None; Secure
                  </code>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 4. Third-Party Cookies */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              4. Third-Party Services
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The only third-party service that sets cookies on Ratio. is Google
              Analytics 4. We do not use any advertising networks, social media
              tracking pixels, or third-party analytics platforms beyond GA4.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              Our hosting provider (Vercel) and backend service (Convex) may set
              cookies necessary for infrastructure operation, such as load
              balancing and edge routing. These are strictly necessary and cannot
              be disabled.
            </p>
          </section>

          {/* 5. Managing Your Preferences */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              5. Managing Your Preferences
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              When you first visit Ratio., a privacy notice banner appears
              asking for your consent to analytics cookies. You may accept or
              decline. Your choice is stored locally and persists across
              sessions.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To change your preference at any time:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Clear your browser&apos;s cookies and localStorage for this
                site, then revisit to see the consent banner again
              </li>
              <li>
                Use your browser&apos;s built-in cookie management settings to
                block or delete specific cookies
              </li>
              <li>
                Use a browser extension or privacy tool to manage cookie consent
                across websites
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              Declining analytics cookies does not affect your ability to use
              Ratio. All features remain fully accessible regardless of your
              cookie preference.
            </p>
          </section>

          {/* 6. Changes to This Policy */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              6. Changes to This Policy
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for operational, legal, or regulatory
              reasons. The &quot;Last updated&quot; date at the top of this page
              indicates when it was most recently revised. We encourage you to
              review this policy periodically.
            </p>
          </section>

          {/* 7. Contact */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              7. Contact Us
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If you have questions about this Cookie Policy or how we use
              cookies, please contact us:
            </p>
            <div className="bg-white/[0.03] border border-court-border rounded-court p-4">
              <p className="text-court-sm text-court-text-sec">
                <span className="font-medium text-court-text">Email:</span>{" "}
                mgiqui01@student.bbk.ac.uk
              </p>
              <p className="text-court-sm text-court-text-sec mt-1">
                <span className="font-medium text-court-text">
                  Response time:
                </span>{" "}
                Within 5 working days
              </p>
            </div>
            <p className="text-court-base text-court-text-sec leading-relaxed mt-4">
              You may also wish to review our{" "}
              <Link
                href="/privacy"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              for more detailed information about how we handle personal data.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-court-border">
          <p className="text-court-xs text-court-text-ter">
            Ratio<span className="text-gold">.</span> Built for the Bar.
          </p>
        </div>
      </div>
    </div>
  );
}
