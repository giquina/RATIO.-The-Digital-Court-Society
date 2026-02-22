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
  {
    name: "Instagram",
    url: "https://instagram.com/ratio.law",
    Icon: Instagram,
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@ratio.law",
    Icon: Music2,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/ratio-law",
    Icon: Linkedin,
  },
  {
    name: "X",
    url: "https://x.com/ratio_law",
    Icon: Twitter,
  },
];

const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { name: "AI Judge", href: "/ai-practice" },
      { name: "Live Mooting", href: "/sessions" },
      { name: "Legal Research", href: "/research" },
      { name: "Tournaments", href: "/sessions/tournaments" },
      { name: "AI Tools", href: "/tools" },
      { name: "Law Book", href: "/law-book" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Chambers", href: "/chambers" },
      { name: "Rankings", href: "/rankings" },
      { name: "Parliament", href: "/parliament" },
      { name: "Tribunal", href: "/tribunal" },
      { name: "Community", href: "/community" },
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
            <p className="text-gold text-court-xs tracking-[0.18em] uppercase mt-1.5 mb-4">
              The Digital Court Society
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-court-text-ter hover:text-gold transition-colors"
                  aria-label={s.name}
                >
                  <s.Icon size={16} />
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
                      className="text-court-sm text-court-text-sec hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-court-border pt-6 text-center">
          <p className="text-court-xs text-court-text-ter">
            &copy; 2026 Ratio. Built for the Bar.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
