"use client";

import { motion } from "framer-motion";
import { TrendingUp, MessageCircle, Eye, Vote } from "lucide-react";
import Link from "next/link";
import { Card, Tag } from "@/components/ui";

// Deterministic hash for consistent demo data
function hashStr(str: string, seed: number = 0): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

interface DemoDebate {
  id: string;
  title: string;
  comments: number;
  votes: number;
  views: number;
  creator: string;
  timeAgo: string;
  sessionType: string;
}

function generateDemoDebates(moduleSlug: string): DemoDebate[] {
  const h = hashStr(moduleSlug);

  const motions = [
    "This House believes that judicial activism undermines the rule of law",
    "This House believes that technology companies should bear strict liability for AI-generated harm",
    "This House would abolish the right to silence in serious fraud investigations",
    "This House believes the mandatory life sentence for murder should be reformed",
  ];

  const creators = [
    "E. Whitmore",
    "J. Adeyemi",
    "S. Patel",
    "R. Chen",
  ];

  const times = ["2h ago", "5h ago", "1d ago", "3d ago"];
  const types = ["Oxford-Style", "Moot Court", "Policy Debate", "Case Analysis"];

  return motions.slice(0, 3 + (h % 2)).map((title, i) => ({
    id: `${moduleSlug}-debate-${i}`,
    title,
    comments: ((hashStr(moduleSlug, i * 7)) % 45) + 3,
    votes: ((hashStr(moduleSlug, i * 13)) % 80) + 5,
    views: ((hashStr(moduleSlug, i * 19)) % 300) + 40,
    creator: creators[i % creators.length],
    timeAgo: times[i % times.length],
    sessionType: types[i % types.length],
  }));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function TrendingDebates({
  moduleSlug,
  moduleTitle,
}: {
  moduleSlug: string;
  moduleTitle: string;
}) {
  const debates = generateDemoDebates(moduleSlug);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-gold" />
        <h3 className="font-serif text-base font-bold text-court-text">
          Trending Debates
        </h3>
      </div>

      {/* Debate list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {debates.map((debate) => (
          <motion.div key={debate.id} variants={itemVariants}>
            <Card className="p-3.5">
              <div className="space-y-2">
                {/* Title */}
                <p className="font-serif font-medium text-court-text text-court-base leading-snug">
                  {debate.title}
                </p>

                {/* Session type tag */}
                <Tag color="gold" small>
                  {debate.sessionType}
                </Tag>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-court-xs text-court-text-ter">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} />
                    {debate.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Vote size={11} />
                    {debate.votes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {debate.views}
                  </span>
                </div>

                {/* Creator + time */}
                <p className="text-court-xs text-court-text-ter">
                  {debate.creator} &middot; {debate.timeAgo}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Browse all link */}
      <div className="mt-3 text-center">
        <Link
          href="/sessions"
          className="text-court-xs text-gold font-semibold hover:text-gold/80 transition-colors duration-200"
        >
          Browse All Sessions &rarr;
        </Link>
      </div>
    </div>
  );
}
