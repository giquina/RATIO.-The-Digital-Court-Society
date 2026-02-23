"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/helpers";

interface PremiumEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  hint?: string;
  variant?: "default" | "compact";
}

export function PremiumEmptyState({
  icon,
  title,
  description,
  action,
  hint,
  variant = "default",
}: PremiumEmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        isCompact ? "py-10" : "py-16"
      )}
    >
      {/* Icon with radial gold gradient */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center mb-5 text-court-text-sec",
          "bg-[radial-gradient(circle,rgba(201,168,76,0.08),transparent_70%)]",
          isCompact ? "w-14 h-14" : "w-20 h-20"
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-serif font-bold text-court-text mb-2",
          isCompact ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-court-base text-court-text-sec max-w-sm leading-relaxed">
        {description}
      </p>

      {/* Hint */}
      {hint && (
        <p className="text-court-xs text-court-text-ter italic max-w-xs mt-2">
          {hint}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
