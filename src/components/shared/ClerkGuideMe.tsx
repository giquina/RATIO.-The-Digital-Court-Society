"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3, Activity, Zap, Search, UserPlus, Plus, History, List, FileText,
  Users, Send, CheckCircle, Trophy, Vote, MessageSquare, BookOpen, FilePlus,
  Scale, Gavel, PenLine, Quote, Award, TrendingUp, Briefcase, Share2,
  FolderOpen, Home, Mic, MapPin
} from "lucide-react";
import { getGuideForRoute } from "@/lib/constants/clerk-guides";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3, Activity, Zap, Search, UserPlus, Plus, History, List, FileText,
  Users, Send, CheckCircle, Trophy, Vote, MessageSquare, BookOpen, FilePlus,
  Scale, Gavel, PenLine, Quote, Award, TrendingUp, Briefcase, Share2,
  FolderOpen, Home, Mic, MapPin,
};

export function ClerkGuideMe() {
  const pathname = usePathname();
  const guide = useMemo(() => getGuideForRoute(pathname), [pathname]);

  return (
    <div className="flex flex-col">
      {/* Route indicator */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-court-xs text-court-text-ter font-mono">{pathname}</p>
      </div>

      {/* Guide header */}
      <div className="px-4 py-2">
        <h3 className="font-serif text-court-md font-bold text-court-text mb-1">{guide.title}</h3>
        <p className="text-court-sm text-court-text-sec leading-relaxed">{guide.description}</p>
      </div>

      {/* Steps */}
      <div className="px-4 py-2 space-y-2">
        {guide.steps.map((step, idx) => {
          const Icon = ICON_MAP[step.icon];
          return (
            <div key={idx} className="flex gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <span className="text-court-sm font-bold text-gold">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {Icon && <Icon size={12} className="text-gold/60 shrink-0" />}
                  <span className="text-court-base font-semibold text-court-text">{step.title}</span>
                </div>
                <p className="text-court-sm text-court-text-sec leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
