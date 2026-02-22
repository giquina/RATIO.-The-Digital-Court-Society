"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, BookOpen, GraduationCap, Star, Bot, Check } from "lucide-react";
import { Card, Button, Avatar } from "@/components/ui";
import { playStarTap, playChime } from "@/lib/utils/sounds";

interface PostSessionRatingProps {
  sessionTitle: string;
  duration: string;
  opponent: { name: string; initials: string; chamber: string };
  onSubmit: (rating: RatingData) => void;
  onSkip: () => void;
  onViewAIFeedback?: () => void;
}

export interface RatingData {
  advocacySkill: number;
  preparation: number;
  professionalism: number;
  overall: number;
  comments: string;
}

const DIMENSIONS: { key: string; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "advocacySkill", label: "Advocacy Skill", desc: "Legal arguments and case law usage", icon: Scale },
  { key: "preparation", label: "Preparation", desc: "Knowledge of the case and authorities", icon: BookOpen },
  { key: "professionalism", label: "Professionalism", desc: "Court manner and conduct", icon: GraduationCap },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          onClick={() => { onChange(star); playStarTap(star); }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
            star <= value
              ? "bg-gold/20 border border-gold/40"
              : "bg-white/[0.03] border border-court-border"
          }`}
          whileTap={{ scale: 0.9 }}
          animate={star <= value ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {star <= value
            ? <Star size={18} className="text-gold fill-gold" />
            : <Star size={18} className="text-court-text-ter" />
          }
        </motion.button>
      ))}
    </div>
  );
}

export function PostSessionRating({
  sessionTitle,
  duration,
  opponent,
  onSubmit,
  onSkip,
  onViewAIFeedback,
}: PostSessionRatingProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    advocacySkill: 0,
    preparation: 0,
    professionalism: 0,
  });
  const [overall, setOverall] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    playChime();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        advocacySkill: ratings.advocacySkill,
        preparation: ratings.preparation,
        professionalism: ratings.professionalism,
        overall,
        comments,
      });
    }, 2000);
  };

  const canSubmit = overall > 0;

  const stagger = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] bg-navy flex items-center justify-center">
        <motion.div
          className="text-center px-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Check size={40} className="text-green-500" />
          </motion.div>
          <motion.h2
            className="font-serif text-xl font-bold text-court-text mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Rating Submitted
          </motion.h2>
          <motion.p
            className="text-sm text-court-text-sec"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Session saved to your portfolio
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-navy overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Check size={28} className="text-green-500" />
          </motion.div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-1">Session Complete</h1>
          <p className="text-xs text-court-text-sec">Duration: {duration}</p>
        </motion.div>

        {/* Session summary */}
        <motion.div custom={0} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-4" highlight>
            <h2 className="font-serif text-base font-bold text-court-text leading-tight mb-3">
              {sessionTitle}
            </h2>
            <div className="flex items-center gap-3">
              <Avatar initials={opponent.initials} chamber={opponent.chamber} size="sm" />
              <div>
                <p className="text-xs font-semibold text-court-text">{opponent.name}</p>
                <p className="text-court-xs text-court-text-ter">Opposing Counsel</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Feedback CTA */}
        {onViewAIFeedback && (
          <motion.div custom={1} variants={stagger} initial="hidden" animate="visible">
            <button
              onClick={onViewAIFeedback}
              className="w-full mb-4 relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                  <Bot size={22} className="text-gold" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-gold">View AI Judge Feedback</p>
                  <p className="text-court-xs text-court-text-sec mt-0.5">
                    Detailed analysis of your advocacy performance
                  </p>
                </div>
                <span className="text-gold">&rarr;</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Rate opponent */}
        <motion.div custom={2} variants={stagger} initial="hidden" animate="visible">
          <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3 px-1">
            Rate Your Opponent
          </h3>
          <div className="flex flex-col gap-3 mb-4">
            {DIMENSIONS.map((dim, i) => (
              <motion.div
                key={dim.key}
                custom={3 + i}
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <Card className="p-3.5">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <dim.icon size={18} className="text-gold" />
                    <div>
                      <p className="text-xs font-semibold text-court-text">{dim.label}</p>
                      <p className="text-court-xs text-court-text-ter">{dim.desc}</p>
                    </div>
                  </div>
                  <StarRating
                    value={ratings[dim.key] || 0}
                    onChange={(v) => setRatings((p) => ({ ...p, [dim.key]: v }))}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Overall */}
        <motion.div custom={6} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-4" highlight>
            <p className="text-xs font-bold text-court-text tracking-wider uppercase mb-2.5">
              Overall Performance
            </p>
            <StarRating value={overall} onChange={setOverall} />
          </Card>
        </motion.div>

        {/* Comments */}
        <motion.div custom={7} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-5">
            <label className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2 block">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any feedback for your opponent..."
              rows={3}
              className="w-full bg-white/[0.03] border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter resize-none"
            />
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div custom={8} variants={stagger} initial="hidden" animate="visible">
          <div className="flex flex-col gap-2.5">
            <Button fullWidth disabled={!canSubmit} onClick={handleSubmit}>
              Submit Rating
            </Button>
            <Button fullWidth variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
