import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description:
    "Code of Conduct for Ratio. — The Digital Court Society. Standards of professional decorum and academic integrity for all Advocates.",
};

export default function CodeOfConductPage() {
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
            Code of Conduct
          </h1>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last updated: 22 February 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. is a constitutional training ground for legal advocacy. Every
              Advocate who participates in this community is expected to uphold the
              highest standards of professional decorum, intellectual honesty, and
              mutual respect. This Code of Conduct establishes the principles that
              govern conduct on the platform and reflects the values of the legal
              profession we seek to prepare our Advocates for.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              By using Ratio., you agree to abide by this Code. Violations may
              result in enforcement action, up to and including permanent removal
              from the platform.
            </p>
          </section>

          {/* Our Standards */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              1. Our Standards
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Ratio. aspires to cultivate an environment that mirrors the
              professionalism expected of officers of the court. Our community is
              founded upon the following principles:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <span className="font-medium">Integrity</span> — Honesty in all
                submissions, arguments, and interactions. The strength of advocacy
                lies in truthful representation.
              </li>
              <li>
                <span className="font-medium">Respect</span> — Courtesy toward all
                Advocates, regardless of experience, background, Chamber
                affiliation, or viewpoint.
              </li>
              <li>
                <span className="font-medium">Rigour</span> — Commitment to
                thorough preparation, careful reasoning, and proper citation of
                authorities.
              </li>
              <li>
                <span className="font-medium">Fairness</span> — Equitable
                treatment of opposing arguments and good-faith engagement in
                sessions and debates.
              </li>
              <li>
                <span className="font-medium">Collegiality</span> — Recognition
                that all Advocates share the common purpose of developing their
                skills and contributing to the community.
              </li>
            </ul>
          </section>

          {/* Expected Behaviour */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              2. Expected Behaviour
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              All Advocates are expected to conduct themselves in a manner
              befitting the professional standards of the Bar. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Engaging constructively in moot sessions, parliamentary debates,
                and Law Book discussions
              </li>
              <li>
                Providing thoughtful and respectful feedback to fellow Advocates
              </li>
              <li>
                Properly attributing sources and authorities in all submissions,
                including Law Book contributions and argument texts
              </li>
              <li>
                Respecting the decisions of session chairs, judges, and moderators
              </li>
              <li>
                Representing your qualifications, experience, and institutional
                affiliation truthfully
              </li>
              <li>
                Honouring commitments to scheduled sessions and notifying relevant
                parties promptly if unable to attend
              </li>
              <li>
                Contributing to a welcoming environment for new Advocates and
                junior members of Chambers
              </li>
              <li>
                Using the platform&apos;s features, including AI tools, honestly
                and in the spirit of genuine learning
              </li>
            </ul>
          </section>

          {/* Unacceptable Behaviour */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              3. Unacceptable Behaviour
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              The following conduct is strictly prohibited on Ratio. and may result
              in immediate enforcement action:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                Harassment, bullying, or intimidation of any Advocate, whether in
                sessions, comments, or private communications through the platform
              </li>
              <li>
                Discriminatory language or behaviour on the basis of race,
                ethnicity, gender, sexual orientation, disability, religion, age,
                or any other protected characteristic
              </li>
              <li>
                Plagiarism or misrepresentation of another&apos;s work as your own,
                including uncredited use of AI-generated content in contexts
                requiring original work
              </li>
              <li>
                Deliberate disruption of sessions, including persistent
                interruption, bad-faith argumentation, or refusal to follow
                procedural directions
              </li>
              <li>
                Sharing or publishing another Advocate&apos;s personal information
                without their consent
              </li>
              <li>
                Manipulation of rankings, scores, or badges through fraudulent
                means
              </li>
              <li>
                Abuse of the Tribunal system, including filing frivolous or
                vexatious complaints
              </li>
              <li>
                Posting content that is obscene, defamatory, or otherwise unlawful
              </li>
              <li>
                Persistent failure to meet commitments to scheduled sessions
                without reasonable cause
              </li>
              <li>
                Any conduct that would bring the legal profession or the Ratio.
                community into disrepute
              </li>
            </ul>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              4. Enforcement
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Enforcement of this Code is administered through the Ratio. Tribunal
              system. The Tribunal operates as the platform&apos;s adjudicatory
              body and handles complaints of Code violations with due regard for
              procedural fairness.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Enforcement actions may include, but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                <span className="font-medium">Formal warning</span> — A recorded
                notice that the Advocate&apos;s conduct has fallen below the
                expected standard
              </li>
              <li>
                <span className="font-medium">Temporary suspension</span> —
                Restriction of access to the platform for a defined period
              </li>
              <li>
                <span className="font-medium">Content removal</span> — Deletion of
                specific submissions that violate the Code
              </li>
              <li>
                <span className="font-medium">Ranking penalty</span> — Reduction
                of standing or removal of badges obtained through prohibited
                conduct
              </li>
              <li>
                <span className="font-medium">Permanent ban</span> — Irrevocable
                removal from the platform, reserved for the most serious or
                repeated violations
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              All enforcement decisions are made with reference to the severity of
              the violation, the Advocate&apos;s history, and any mitigating
              circumstances. Advocates subject to enforcement action will be
              informed of the grounds and given an opportunity to respond before a
              final determination is made, except in cases requiring immediate
              action to protect the safety of the community.
            </p>
          </section>

          {/* Reporting */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              5. Reporting
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              If you witness or experience conduct that violates this Code, you are
              encouraged to report it promptly. Reports may be submitted through:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>
                The Tribunal filing system, accessible from within the platform
              </li>
              <li>
                Direct email to{" "}
                <a
                  href="mailto:mgiqui01@student.bbk.ac.uk"
                  className="text-gold hover:underline"
                >
                  mgiqui01@student.bbk.ac.uk
                </a>
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              All reports will be treated with appropriate confidentiality. We will
              not disclose the identity of a reporting Advocate to the respondent
              without the reporter&apos;s consent, except where required by law or
              necessary for the fair resolution of the matter.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Retaliation against any Advocate who reports a violation in good
              faith is itself a serious violation of this Code and will be treated
              accordingly.
            </p>
          </section>

          {/* Scope */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              6. Scope
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              This Code of Conduct applies to all interactions on the Ratio.
              platform, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-court-base text-court-text-sec mb-4">
              <li>Moot sessions, parliamentary debates, and AI practice sessions</li>
              <li>Law Book contributions, reviews, and editorial discussions</li>
              <li>Chamber activities and inter-Chamber communications</li>
              <li>Tribunal proceedings</li>
              <li>Profile content and public-facing information</li>
              <li>
                Any communications facilitated through the platform, including
                notifications and feedback
              </li>
            </ul>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Where an Advocate&apos;s conduct outside the platform has a direct
              and material impact on the safety or integrity of the Ratio.
              community, such conduct may also fall within the scope of this Code.
            </p>
          </section>

          {/* Attribution */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              7. Attribution
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              This Code of Conduct is inspired by the standards of the professional
              Bar, the principles articulated in the Bar Standards Board Handbook,
              and the Contributor Covenant. It has been adapted to reflect the
              specific educational and community purposes of Ratio.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              We are grateful to the many open-source communities and professional
              bodies whose commitment to fair and respectful conduct has informed
              these standards.
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
