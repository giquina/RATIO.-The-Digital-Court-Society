import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Ratio. — The Digital Court Society. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last updated: 22 February 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates
              The Digital Court Society platform. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your personal data when you
              use our platform. We are committed to protecting your privacy in
              accordance with the UK General Data Protection Regulation (UK GDPR)
              and the Data Protection Act 2018.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              By accessing or using Ratio., you acknowledge that you have read and
              understood this Privacy Policy. If you do not agree with our
              practices, please do not use the platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              1. Information We Collect
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We collect information that you provide directly, as well as data
              generated through your use of the platform.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-2 font-medium">
              Information you provide:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Account registration details, including your name, email address,
                university affiliation, and year of study
              </li>
              <li>
                Profile information such as your display name, biography, and
                Chamber membership
              </li>
              <li>
                Content you create or submit, including Law Book contributions,
                session participation records, argument submissions, and case briefs
              </li>
              <li>
                Communications with us, such as support enquiries or feedback
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-2 font-medium">
              Information collected automatically:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Device and browser information, including device type, operating
                system, and browser version
              </li>
              <li>
                Usage data, such as pages visited, features used, session duration,
                and interaction patterns
              </li>
              <li>
                Performance data, including error logs and load times, to improve
                the platform experience
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We process your personal data on the basis of legitimate interests,
              contractual necessity, and, where applicable, your consent. We use
              your information to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Provide and maintain the platform, including account management,
                session scheduling, and Chamber operations
              </li>
              <li>
                Deliver AI-powered services, such as the AI Judge feedback system
                and argument analysis tools
              </li>
              <li>
                Calculate rankings, award badges, and maintain advocacy portfolios
              </li>
              <li>
                Process and display Law Book contributions, subject to editorial
                review
              </li>
              <li>
                Send essential service communications, such as session reminders
                and Tribunal notifications
              </li>
              <li>
                Analyse usage patterns to improve the platform and develop new
                features
              </li>
              <li>
                Ensure platform security and enforce our Terms of Service and Code
                of Conduct
              </li>
            </ul>
          </section>

          {/* Data Storage & Security */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              3. Data Storage and Security
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Your data is stored and processed using Convex, our backend database
              provider. Convex employs industry-standard encryption for data at
              rest and in transit, and maintains robust access controls.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access, alteration,
              disclosure, or destruction. These measures include encryption of data
              in transit via TLS, secure authentication through Convex Auth, and regular
              security reviews of our infrastructure.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              While we take reasonable steps to protect your data, no method of
              electronic storage or transmission is entirely secure. We cannot
              guarantee absolute security but will notify affected Advocates
              promptly in the event of a data breach, in compliance with our
              obligations under the UK GDPR.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              4. Third-Party Services
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We use a limited number of third-party services to operate the
              platform. Each provider is selected for its commitment to data
              protection:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <span className="font-medium">Convex</span> — Backend database and
                real-time data synchronisation
              </li>
              <li>
                <span className="font-medium">Convex Auth</span> — Authentication and
                user identity management
              </li>
              <li>
                <span className="font-medium">Vercel</span> — Hosting and content
                delivery
              </li>
              <li>
                <span className="font-medium">OpenAI / Anthropic</span> — AI model
                providers for the AI Judge and analytical tools
              </li>
              <li>
                <span className="font-medium">Google Analytics 4</span> — Anonymous
                usage analytics (subject to cookie consent)
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We do not sell, rent, or trade your personal data to third parties.
              Data shared with service providers is limited to what is necessary for
              them to perform their functions on our behalf.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              5. Your Rights Under UK GDPR
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              As a data subject under the UK GDPR, you have the following rights
              in relation to your personal data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <span className="font-medium">Right of access</span> — You may
                request a copy of the personal data we hold about you
              </li>
              <li>
                <span className="font-medium">Right to rectification</span> — You
                may request correction of inaccurate or incomplete data
              </li>
              <li>
                <span className="font-medium">Right to erasure</span> — You may
                request deletion of your personal data, subject to legal
                obligations we may have to retain certain information
              </li>
              <li>
                <span className="font-medium">Right to restrict processing</span>{" "}
                — You may request that we limit the processing of your data in
                certain circumstances
              </li>
              <li>
                <span className="font-medium">Right to data portability</span> —
                You may request your data in a structured, commonly used,
                machine-readable format
              </li>
              <li>
                <span className="font-medium">Right to object</span> — You may
                object to the processing of your data where we rely on legitimate
                interests as our legal basis
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:mgiqui01@student.bbk.ac.uk"
                className="text-gold hover:underline"
              >
                mgiqui01@student.bbk.ac.uk
              </a>
              . We will respond to your request within one month, as required by
              law. If you are unsatisfied with our response, you have the right to
              lodge a complaint with the Information Commissioner&apos;s Office
              (ICO).
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              6. Cookies
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. uses cookies and similar technologies to provide, secure, and
              improve the platform. Cookies fall into the following categories:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <span className="font-medium">Strictly necessary cookies</span> —
                Required for authentication, session management, and security. The
                platform cannot function without these.
              </li>
              <li>
                <span className="font-medium">Functional cookies</span> —
                Remember your preferences, such as display settings and
                notification choices.
              </li>
              <li>
                <span className="font-medium">Analytics cookies</span> — Help us
                understand how Advocates use the platform so we can improve it.
                These collect anonymised data only.
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              You may manage your cookie preferences through the cookie consent
              banner displayed on your first visit, or through your browser
              settings. Disabling certain cookies may affect platform functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              7. Children&apos;s Privacy
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. is designed for university law students and is not intended
              for use by individuals under the age of 16. We do not knowingly
              collect personal data from children under 16. If we become aware that
              we have collected data from a child under 16 without appropriate
              parental consent, we will take steps to delete that information
              promptly.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              8. Changes to This Policy
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, or legal requirements. When we
              make material changes, we will notify Advocates by posting a notice
              on the platform and, where appropriate, by sending an email to the
              address associated with your account.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The &quot;Last updated&quot; date at the top of this page indicates
              when the policy was most recently revised. Continued use of the
              platform after changes are posted constitutes acceptance of the
              revised policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              9. Contact Us
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy
              Policy or our data practices, please contact us at:
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              <a
                href="mailto:mgiqui01@student.bbk.ac.uk"
                className="text-gold hover:underline"
              >
                mgiqui01@student.bbk.ac.uk
              </a>
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We aim to respond to all enquiries within 5 working days. For data
              protection requests made under the UK GDPR, we will respond within
              the statutory period of one calendar month.
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
