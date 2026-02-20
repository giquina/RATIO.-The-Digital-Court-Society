"use client";

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

const LEGAL_LINKS = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Code of Conduct", href: "/code-of-conduct" },
];

export function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 border-t border-court-border px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="font-serif text-lg font-bold tracking-[0.12em]">
          RATIO<span className="text-gold">.</span>
        </div>
        <p className="text-gold text-court-xs tracking-[0.18em] uppercase mt-1.5">
          The Digital Court Society
        </p>

        {/* Social links */}
        <div className="flex justify-center gap-6 mt-6">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-court-text-ter hover:text-gold transition-colors"
              aria-label={s.name}
            >
              <s.Icon size={18} />
            </a>
          ))}
        </div>

        {/* Legal links */}
        <div className="flex justify-center gap-6 mt-4">
          {LEGAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-court-xs text-court-text-ter hover:text-gold cursor-pointer transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <p className="text-court-xs text-court-text-ter mt-4">
          &copy; 2026 Ratio. Built for the Bar.
        </p>
      </div>
    </motion.footer>
  );
}
