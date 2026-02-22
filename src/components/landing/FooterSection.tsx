"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Music2, Linkedin, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SOCIAL_LINKS: {
  name: string;
  url: string;
  Icon: LucideIcon;
}[] = [
  { name: "Instagram", url: "https://instagram.com/ratio.law", Icon: Instagram },
  { name: "TikTok", url: "https://tiktok.com/@ratio.law", Icon: Music2 },
  { name: "LinkedIn", url: "https://linkedin.com/company/ratio-law", Icon: Linkedin },
  { name: "X", url: "https://x.com/ratio_law", Icon: Twitter },
];

const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { name: "AI Judge", href: "/#ai-showcase" },
      { name: "Live Mooting", href: "/#video-mooting" },
      { name: "Legal Research", href: "/#features" },
      { name: "Tournaments", href: "/#tournaments" },
      { name: "AI Tools", href: "/#tools" },
      { name: "Law Book", href: "/#law-book" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Chambers", href: "/#chambers" },
      { name: "Rankings", href: "/#features" },
      { name: "Parliament", href: "/#governance" },
      { name: "Tribunal", href: "/#governance" },
      { name: "Community", href: "/#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Code of Conduct", href: "/code-of-conduct" },
    ],
  },
];

const UNIVERSITIES = [
  "UCL", "KCL", "LSE", "Oxford", "Cambridge", "Bristol", "Edinburgh", "Manchester",
];

export function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 border-t border-court-border px-4 md:px-6 lg:px-8 py-10"
    >
      <div className="max-w-3xl mx-auto">
        {/* Top section: Logo + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-lg font-bold tracking-[0.12em]">
              RATIO<span className="text-gold">.</span>
            </div>
            <p className="text-gold text-court-xs tracking-[0.18em] uppercase mt-1.5 mb-2">
              The Digital Court Society
            </p>
            <p className="text-court-xs text-court-text-ter leading-relaxed mb-4">
              Constitutional training for the next generation of advocates.
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-court-text-ter hover:text-gold active:scale-95 hover:scale-110 transition-all duration-200"
                  aria-label={s.name}
                >
                  <s.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter uppercase mb-3">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-court-sm text-court-text-sec hover:text-gold active:scale-95 transition-all inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Universities bar */}
        <div className="border-t border-court-border pt-6 mb-6">
          <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter uppercase mb-3">
            Universities
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {UNIVERSITIES.map((uni) => (
              <span key={uni} className="text-court-xs text-court-text-sec">
                {uni}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-court-border pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-court-xs text-court-text-ter">
            &copy; 2026 Ratio. Built for the Bar.
          </p>
          <p className="text-court-xs text-court-text-ter">
            Built by law students, for law students.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
