"use client";

import { motion } from "framer-motion";
import { Scale, BookOpen, Leaf, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CHAMBERS: {
  name: string;
  color: string;
  motto: string;
  Icon: LucideIcon;
}[] = [
  {
    name: "Gray's",
    color: "#6B2D3E",
    motto: "Wisdom through advocacy",
    Icon: Scale,
  },
  {
    name: "Lincoln's",
    color: "#2E5090",
    motto: "Justice through scholarship",
    Icon: BookOpen,
  },
  {
    name: "Inner",
    color: "#3D6B45",
    motto: "Service through practice",
    Icon: Leaf,
  },
  {
    name: "Middle",
    color: "#8B6914",
    motto: "Excellence through tradition",
    Icon: Landmark,
  },
];

export function ChambersPreview({ id }: { id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-3">
        Choose Your Chamber
      </h2>
      <p className="text-court-base text-court-text-sec text-center max-w-lg mx-auto mb-10">
        Every Advocate belongs to a Chamber. Your Chamber is your team for
        national rankings, inter-university competition, and community
        governance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
        {CHAMBERS.map((chamber) => (
          <div
            key={chamber.name}
            className="bg-navy-card border border-court-border-light rounded-court p-4 hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${chamber.color}, ${chamber.color}88)`,
                }}
              >
                <chamber.Icon size={18} className="text-white/90" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-court-text">
                  {chamber.name}
                </h3>
                <p className="text-court-xs text-court-text-ter italic">
                  {chamber.motto}
                </p>
              </div>
            </div>
            <div
              className="h-1 rounded-full w-full"
              style={{
                background: `linear-gradient(to right, ${chamber.color}, transparent)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-2 bg-gold-dim border border-gold/20 rounded-full px-4 py-2 text-court-sm text-gold font-semibold">
          Join a Chamber when you sign up
        </span>
      </div>
    </motion.section>
  );
}
