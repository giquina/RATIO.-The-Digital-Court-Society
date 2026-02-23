import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Terms",
  description:
    "Referral Programme Terms for Ratio. — The Digital Court Society. Read the terms governing the Share & Reward referral programme.",
};

export default function ReferralTermsPage() {
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
            Referral Programme Terms
          </h1>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last updated: 23 February 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              These Referral Programme Terms (&quot;Referral Terms&quot;) govern
              participation in the Ratio. referral programme (&quot;the
              Programme&quot;). The Programme allows existing Advocates to invite
              prospective members to join the platform. By participating in the
              Programme, you agree to be bound by these Referral Terms, in
              addition to our{" "}
              <Link href="/terms" className="text-gold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              1. Eligibility
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To participate in the Programme as a referring Advocate, you must:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Hold an active Advocate account on the platform in good standing
              </li>
              <li>
                Have completed your profile, including university affiliation
              </li>
              <li>
                Not be subject to any active disciplinary sanctions or account
                restrictions
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Invited individuals must meet all standard eligibility
              requirements for Ratio. membership as set out in the Terms of
              Service, including being at least 16 years of age and having a
              genuine connection to legal study or the legal profession.
            </p>
          </section>

          {/* How the Programme Works */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              2. How the Programme Works
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Each eligible Advocate is assigned a unique referral handle, which
              forms part of a personalised invitation link. When a new user
              registers via your referral link, a referral record is created.
              The referral progresses through the following stages:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <strong className="text-court-text">Pending</strong> — the
                invitation link has been generated or shared
              </li>
              <li>
                <strong className="text-court-text">Signed Up</strong> — the
                invitee has registered an account via your link
              </li>
              <li>
                <strong className="text-court-text">Activated</strong> — the
                invitee has completed their first practice session, triggering
                reward eligibility
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Rewards are only issued upon activation. Registration alone does
              not qualify for a reward.
            </p>
          </section>

          {/* Rewards */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              3. Rewards
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Upon successful activation of a referral, the referring Advocate
              may receive one of the following rewards, subject to availability
              and applicable caps:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <strong className="text-court-text">AI Judge Session</strong> —
                one additional AI-powered practice session
              </li>
              <li>
                <strong className="text-court-text">Advanced Feedback</strong>{" "}
                — enhanced analysis on your next session
              </li>
              <li>
                <strong className="text-court-text">Archive Access</strong> —
                term-based access to the session archive
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Rewards are non-transferable, non-exchangeable, and carry no
              monetary value. Rewards expire at the end of the current academic
              year (31 July). Expired rewards cannot be reinstated.
            </p>
          </section>

          {/* Limits and Caps */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              4. Limits and Caps
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              To maintain the integrity of the Programme and prevent abuse, the
              following limits apply:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                A maximum of <strong className="text-court-text">10 invitations per rolling 7-day period</strong> (velocity cap)
              </li>
              <li>
                A maximum of <strong className="text-court-text">5 credited referrals per calendar month</strong> (monthly reward cap)
              </li>
              <li>
                A maximum of <strong className="text-court-text">15 credited referrals per academic term</strong> (term cap)
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Pending referrals that remain inactive for 30 days will
              automatically expire. We reserve the right to adjust these limits
              at any time.
            </p>
          </section>

          {/* Prohibited Conduct and Fraud */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              5. Prohibited Conduct and Fraud Prevention
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The following conduct is strictly prohibited and may result in
              immediate revocation of rewards, suspension of referral
              privileges, or termination of your account:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Self-referral, including creating multiple accounts to claim
                rewards
              </li>
              <li>
                Referring individuals who do not meet the eligibility criteria
              </li>
              <li>
                Using automated tools, bots, or scripts to generate or share
                referral links
              </li>
              <li>
                Distributing referral links via spam, unsolicited messages, or
                deceptive practices
              </li>
              <li>
                Colluding with others to artificially inflate referral counts
              </li>
              <li>
                Misrepresenting the platform or the Programme in any
                communication
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We employ automated fraud detection measures and reserve the right
              to flag, investigate, and revoke any referral or reward at our sole
              discretion. Flagged referrals will not generate rewards. Serious or
              repeated violations may be referred to the Tribunal for formal
              adjudication.
            </p>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              6. Data and Privacy
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The Programme processes personal data in accordance with our{" "}
              <Link href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>{" "}
              and applicable data protection legislation, including the UK
              General Data Protection Regulation (UK GDPR) and the Data
              Protection Act 2018.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Referral activity displayed to the referring Advocate is limited to
              first name and last initial of the invitee only, in accordance
              with the principle of data minimisation. We do not share the
              invitee&apos;s email address, university, or other personal data
              with the referring Advocate.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              By sharing a referral link, you confirm that you have a genuine
              personal or professional connection with the intended recipient
              and are not engaging in unsolicited bulk messaging.
            </p>
          </section>

          {/* Revocation and Modification */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              7. Revocation and Modification
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Revoke any reward at any time if we reasonably believe it was
                obtained through prohibited conduct
              </li>
              <li>
                Modify the reward types, caps, or Programme mechanics at any
                time with reasonable notice
              </li>
              <li>
                Suspend or discontinue the Programme entirely at our discretion
              </li>
              <li>
                Amend these Referral Terms, with material changes communicated
                through the platform
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Your continued participation in the Programme following any
              changes constitutes acceptance of the revised Referral Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              8. Governing Law
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              These Referral Terms shall be governed by and construed in
              accordance with the laws of England and Wales. Any disputes
              arising from or in connection with the Programme shall be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              9. Contact
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If you have any questions regarding the Programme or these
              Referral Terms, please contact us at:
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              <a
                href="mailto:mgiqui01@student.bbk.ac.uk"
                className="text-gold hover:underline"
              >
                mgiqui01@student.bbk.ac.uk
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
