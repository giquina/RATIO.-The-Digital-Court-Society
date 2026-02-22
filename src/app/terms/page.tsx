import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Ratio. — The Digital Court Society. Read the terms governing your use of the platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last updated: 22 February 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              These Terms of Service (&quot;Terms&quot;) govern your access to and
              use of Ratio. — The Digital Court Society (&quot;the platform&quot;),
              operated by Ratio. (&quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;). Please read these Terms carefully before using the
              platform.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              By creating an account or otherwise accessing the platform, you agree
              to be bound by these Terms, our{" "}
              <Link href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>
              , and our{" "}
              <Link href="/code-of-conduct" className="text-gold hover:underline">
                Code of Conduct
              </Link>
              . If you do not agree to these Terms, you must not use the platform.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We reserve the right to update these Terms at any time. Material
              changes will be communicated through the platform. Your continued use
              following such changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              2. Eligibility
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. is designed for law students, legal academics, and aspiring
              legal professionals. To use the platform, you must:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>Be at least 16 years of age</li>
              <li>
                Be currently enrolled in, or have completed, a programme of legal
                study at a recognised institution, or have a genuine professional
                interest in legal advocacy training
              </li>
              <li>
                Provide accurate and truthful information during registration
              </li>
              <li>
                Comply with all applicable laws and regulations in your
                jurisdiction
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We reserve the right to verify your eligibility and to refuse or
              revoke access at our discretion.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              3. Account Registration
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To access the platform, you must create an Advocate account. You are
              responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>
                All activity that occurs under your account, whether or not
                authorised by you
              </li>
              <li>
                Notifying us immediately of any unauthorised access to or use of
                your account
              </li>
              <li>
                Ensuring that your profile information remains accurate and up to
                date
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              You may not create multiple accounts, share your account with others,
              or transfer your account to another person without our prior written
              consent.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              4. Acceptable Use
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              You agree to use the platform in a manner consistent with its purpose
              as a constitutional training ground for legal advocacy. You must not:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Use the platform for any unlawful purpose or in violation of any
                applicable law
              </li>
              <li>
                Harass, abuse, threaten, or intimidate other Advocates or any
                person
              </li>
              <li>
                Impersonate another person or misrepresent your affiliation with
                any entity
              </li>
              <li>
                Upload or transmit viruses, malware, or any code of a destructive
                nature
              </li>
              <li>
                Attempt to gain unauthorised access to other accounts, platform
                systems, or data
              </li>
              <li>
                Scrape, crawl, or use automated tools to extract data from the
                platform without authorisation
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                platform
              </li>
              <li>
                Use AI-generated content dishonestly in contexts where original
                work is expected, such as Law Book contributions or moot arguments
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Violations may result in account suspension or termination, and
              referral to the Tribunal for adjudication in accordance with the Code
              of Conduct.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              5. Intellectual Property
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              All content, features, and functionality of the platform — including
              but not limited to the design, code, text, graphics, logos, and
              trademarks — are the property of Ratio. or its licensors and are
              protected by intellectual property laws.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              You are granted a limited, non-exclusive, non-transferable, revocable
              licence to access and use the platform for its intended educational
              purposes. You may not reproduce, distribute, modify, create
              derivative works from, or commercially exploit any part of the
              platform without our express written permission.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              6. User Content
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Advocates may contribute content to the platform, including Law Book
              entries, session submissions, argument texts, and case briefs
              (&quot;User Content&quot;). By submitting User Content, you:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Retain ownership of your original work, subject to the licence
                granted below
              </li>
              <li>
                Grant Ratio. a worldwide, non-exclusive, royalty-free licence to
                use, display, reproduce, and distribute your User Content on the
                platform for the purposes of operating and improving the service
              </li>
              <li>
                Warrant that your User Content does not infringe the intellectual
                property rights of any third party
              </li>
              <li>
                Acknowledge that Law Book contributions are subject to editorial
                review and may be edited, approved, or rejected at the discretion
                of the editorial team
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We reserve the right to remove any User Content that violates these
              Terms, the Code of Conduct, or applicable law.
            </p>
          </section>

          {/* AI Services Disclaimer */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              7. AI Services Disclaimer
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. incorporates artificial intelligence features, including the
              AI Judge, argument analysis tools, and case law research assistance.
              These AI-powered services are provided for educational and training
              purposes only. You acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                AI-generated feedback, scores, and analysis are not substitutes for
                qualified legal advice or professional assessment
              </li>
              <li>
                AI outputs may contain inaccuracies, hallucinations, or errors and
                should be critically evaluated
              </li>
              <li>
                AI Judge rulings are simulated and carry no legal authority or
                precedential value
              </li>
              <li>
                We make no guarantees regarding the accuracy, completeness, or
                reliability of AI-generated content
              </li>
              <li>
                You should not rely upon AI outputs for actual legal matters,
                academic submissions, or professional practice
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To the maximum extent permitted by applicable law, Ratio. and its
              officers, directors, employees, and agents shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of data, loss of profits,
              or damage to reputation, arising from or in connection with your use
              of the platform.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The platform is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. We make no warranties, express or implied,
              regarding the platform&apos;s availability, reliability, accuracy, or
              fitness for a particular purpose. We do not guarantee uninterrupted
              access to the platform and shall not be liable for any downtime or
              service interruptions.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Nothing in these Terms excludes or limits liability for death or
              personal injury caused by negligence, fraud, or any other liability
              that cannot be excluded or limited under English law.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              9. Termination
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              You may terminate your account at any time by contacting us at{" "}
              <a
                href="mailto:support@ratio.law"
                className="text-gold hover:underline"
              >
                support@ratio.law
              </a>{" "}
              or through the account settings page. Upon termination, your right to
              access the platform will cease immediately.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We may suspend or terminate your account at any time, with or without
              notice, for any reason, including but not limited to violation of
              these Terms or the Code of Conduct. Serious breaches may be referred
              to the Tribunal for formal adjudication prior to termination.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Upon termination, we may retain certain data as required by law or
              for legitimate business purposes, in accordance with our Privacy
              Policy.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              10. Governing Law
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the
              laws of England and Wales. Any disputes arising from or in connection
              with these Terms or your use of the platform shall be subject to the
              exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If any provision of these Terms is found to be invalid or
              unenforceable by a court of competent jurisdiction, that provision
              shall be enforced to the maximum extent permissible, and the
              remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              11. Changes to These Terms
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. When we make
              material changes, we will provide notice through the platform and
              update the &quot;Last updated&quot; date above. Your continued use of
              the platform after the effective date of any changes constitutes your
              acceptance of the revised Terms.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We encourage you to review these Terms periodically to stay informed
              about the conditions governing your use of Ratio.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              12. Contact
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If you have any questions or concerns regarding these Terms, please
              contact us at:
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              <a
                href="mailto:support@ratio.law"
                className="text-gold hover:underline"
              >
                support@ratio.law
              </a>
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
