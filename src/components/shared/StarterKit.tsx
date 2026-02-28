"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card, ProgressBar } from "@/components/ui";
import { useSidebarStore } from "@/stores/sidebarStore";

const STORAGE_KEY = "ratio_starter_kit_dismissed";

interface StarterKitProps {
  profile: {
    totalMoots?: number;
    totalPoints?: number;
    bio?: string;
    modules?: string[];
  } | null;
  onDismiss: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  isComplete: boolean;
}

export function StarterKit({ profile, onDismiss }: StarterKitProps) {
  const [dismissed, setDismissed] = useState(true);
  const hasVisited = useSidebarStore((s) => s.hasVisited);

  // Check localStorage on mount to determine visibility
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDismissed(stored === "true");
    } catch {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
    onDismiss();
  };

  if (dismissed) return null;

  const items: ChecklistItem[] = [
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add a bio and select your law modules",
      href: "/profile",
      actionLabel: "Edit profile",
      isComplete: Boolean(profile?.bio && (profile?.modules?.length ?? 0) > 0),
    },
    {
      id: "law-book",
      title: "Explore the Law Book",
      description: "Browse constitutional and legal foundations",
      href: "/law-book",
      actionLabel: "Open Law Book",
      isComplete: hasVisited("/law-book"),
    },
    {
      id: "ai-practice",
      title: "Try an Advocacy session",
      description: "Argue a case before the Judge",
      href: "/ai-practice",
      actionLabel: "Start practice",
      isComplete: (profile?.totalMoots ?? 0) > 0,
    },
    {
      id: "live-session",
      title: "Join a live session",
      description: "Participate in a moot with other advocates",
      href: "/sessions/create",
      actionLabel: "Find sessions",
      isComplete: (profile?.totalMoots ?? 0) > 0,
    },
    {
      id: "follow",
      title: "Follow an advocate",
      description: "Connect with peers in your chamber",
      href: "/society",
      actionLabel: "Browse society",
      isComplete: false,
    },
  ];

  const completedCount = items.filter((item) => item.isComplete).length;
  const totalCount = items.length;
  const progressPct = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Card className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-court-text">
            Your First Steps
          </h2>
          <button
            onClick={handleDismiss}
            className="text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors"
          >
            Dismiss
          </button>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <p className="text-court-xs text-court-text-ter mb-2">
            {completedCount} of {totalCount} completed
          </p>
          <ProgressBar pct={progressPct} color="gold" height={3} />
        </div>

        {/* Checklist */}
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 transition-colors",
                item.isComplete ? "opacity-60" : "hover:bg-white/[0.02]"
              )}
            >
              {/* Circle indicator */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  item.isComplete
                    ? "bg-gold"
                    : "border border-court-border bg-transparent"
                )}
              >
                {item.isComplete && (
                  <Check size={12} className="text-navy" strokeWidth={3} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-court-base font-medium",
                    item.isComplete
                      ? "text-court-text-sec line-through"
                      : "text-court-text"
                  )}
                >
                  {item.title}
                </p>
                <p className="text-court-xs text-court-text-ter mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Action link */}
              {!item.isComplete && (
                <Link
                  href={item.href}
                  className="text-court-xs text-gold font-semibold shrink-0 mt-0.5 hover:text-gold/80 transition-colors"
                >
                  {item.actionLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
