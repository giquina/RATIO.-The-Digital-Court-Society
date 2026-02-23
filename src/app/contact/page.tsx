import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Ratio team. We respond to all enquiries within 5 working days.",
};

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="text-court-base text-court-text-sec mt-2 leading-relaxed">
            Whether you have a question, feedback, or a partnership enquiry, we
            are here to help.
          </p>
        </div>

        <div className="space-y-6">
          {/* Contact methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy-card border border-court-border-light rounded-court p-4 text-center">
              <Mail size={20} className="text-gold mx-auto mb-2" />
              <p className="text-court-sm font-medium text-court-text mb-1">Email</p>
              <a
                href="mailto:mgiqui01@student.bbk.ac.uk"
                className="text-court-xs text-gold hover:underline break-all"
              >
                mgiqui01@student.bbk.ac.uk
              </a>
            </div>
            <div className="bg-navy-card border border-court-border-light rounded-court p-4 text-center">
              <MessageSquare size={20} className="text-gold mx-auto mb-2" />
              <p className="text-court-sm font-medium text-court-text mb-1">In-App Help</p>
              <p className="text-court-xs text-court-text-ter">
                Use The Clerk for instant guidance
              </p>
            </div>
            <div className="bg-navy-card border border-court-border-light rounded-court p-4 text-center">
              <Clock size={20} className="text-gold mx-auto mb-2" />
              <p className="text-court-sm font-medium text-court-text mb-1">Response Time</p>
              <p className="text-court-xs text-court-text-ter">
                Within 5 working days
              </p>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              Before You Write
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Many common questions are answered in our help resources:
            </p>
            <div className="space-y-2">
              <Link
                href="/help"
                className="flex items-center justify-between bg-navy-card border border-court-border-light rounded-court px-4 py-3 hover:border-gold/20 transition-colors"
              >
                <span className="text-court-sm text-court-text">Help Centre and FAQ</span>
                <ArrowLeft size={14} className="text-court-text-ter rotate-180" />
              </Link>
              <Link
                href="/terms"
                className="flex items-center justify-between bg-navy-card border border-court-border-light rounded-court px-4 py-3 hover:border-gold/20 transition-colors"
              >
                <span className="text-court-sm text-court-text">Terms of Service</span>
                <ArrowLeft size={14} className="text-court-text-ter rotate-180" />
              </Link>
              <Link
                href="/privacy"
                className="flex items-center justify-between bg-navy-card border border-court-border-light rounded-court px-4 py-3 hover:border-gold/20 transition-colors"
              >
                <span className="text-court-sm text-court-text">Privacy Policy</span>
                <ArrowLeft size={14} className="text-court-text-ter rotate-180" />
              </Link>
              <Link
                href="/code-of-conduct"
                className="flex items-center justify-between bg-navy-card border border-court-border-light rounded-court px-4 py-3 hover:border-gold/20 transition-colors"
              >
                <span className="text-court-sm text-court-text">Code of Conduct</span>
                <ArrowLeft size={14} className="text-court-text-ter rotate-180" />
              </Link>
            </div>
          </section>

          {/* Partnership */}
          <section>
            <h2 className="font-serif text-lg font-bold text-court-text mb-3">
              University Partnerships
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              If you represent a university mooting society or law department and
              would like to explore a partnership with Ratio, please email us
              with the subject line &quot;University Partnership&quot; and we
              will prioritise your enquiry.
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
