"use client";

import { motion } from "framer-motion";
import { Users, Scale, MessageCircle, Award } from "lucide-react";

/*
 * SocialShowcase — landing page section showing RATIO's social community.
 *
 * Think of scrolling through a social feed and seeing your peers actively
 * practising law. It makes the platform feel alive — not a dead tool you
 * use alone. Each card mimics the actual PostCard component style.
 *
 * We show 3 types of activity:
 * 1. A moot completion post (main use case)
 * 2. A badge earned celebration
 * 3. A community commendation
 */

const MOCK_POSTS = [
  {
    name: "Amara Kessler",
    initials: "AK",
    university: "UCL",
    color: "#6B2D3E",
    time: "2h ago",
    content:
      "Just completed a moot on Constitutional Law — scored 78/100. The AI Judge's feedback on my submissions was incredibly detailed. Improving every session!",
    commends: 12,
    comments: 3,
    type: "post" as const,
  },
  {
    name: "Marcus Thompson",
    initials: "MT",
    university: "KCL",
    color: "#2E5090",
    time: "5h ago",
    content: "",
    commends: 24,
    comments: 8,
    type: "badge" as const,
    badge: "First Distinction",
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    university: "Oxford",
    color: "#3D6B45",
    time: "1d ago",
    content:
      "Brilliant session with opposing counsel on duty of care. The video moot room felt like a real courtroom. Anyone want to run a practice round this week?",
    commends: 18,
    comments: 6,
    type: "post" as const,
  },
];

export function SocialShowcase({ id }: { id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Users size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            COMMUNITY
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          A Legal Community, Not Just a Tool
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Share insights, follow advocates, commend achievements, and stay
          connected with your legal network.
        </p>
      </div>

      {/* Feed mockup — stacked cards with slight overlap for depth */}
      <div className="max-w-md mx-auto space-y-3">
        {MOCK_POSTS.map((post, i) => (
          <motion.div
            key={post.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-navy-card border border-court-border-light rounded-court p-4"
          >
            {/* Post header — avatar + name + time */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-serif text-court-sm font-bold text-white/80 shrink-0"
                style={{ background: post.color }}
              >
                {post.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-court-sm font-bold text-court-text truncate">
                    {post.name}
                  </p>
                  <span className="text-court-xs text-court-text-ter">
                    · {post.time}
                  </span>
                </div>
                <p className="text-court-xs text-court-text-ter">
                  {post.university}
                </p>
              </div>
            </div>

            {/* Post content */}
            {post.type === "badge" ? (
              <div className="bg-gold-dim border border-gold/20 rounded-xl p-3 mb-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-court-sm font-bold text-court-text">
                    Earned &ldquo;{post.badge}&rdquo;
                  </p>
                  <p className="text-court-xs text-court-text-ter">
                    Achievement unlocked
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-court-sm text-court-text-sec leading-relaxed mb-3">
                {post.content}
              </p>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-court-border-light">
              <button className="flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-gold transition-colors">
                <Scale size={13} />
                <span>Commend</span>
                <span className="text-court-text-ter">({post.commends})</span>
              </button>
              <button className="flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors">
                <MessageCircle size={13} />
                <span>Comment</span>
                <span className="text-court-text-ter">({post.comments})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
