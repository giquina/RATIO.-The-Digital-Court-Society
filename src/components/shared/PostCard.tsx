"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Avatar, Tag } from "@/components/ui";
import { courtToast } from "@/lib/utils/toast";
import {
  Lightbulb,
  Scale,
  HelpCircle,
  Megaphone,
  Bookmark,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: typeof Lightbulb; color: string; tagColor: string }
> = {
  insight: {
    label: "Legal Insight",
    icon: Lightbulb,
    color: "text-gold",
    tagColor: "gold",
  },
  case_spot: {
    label: "Case Spot",
    icon: Scale,
    color: "text-blue-400",
    tagColor: "blue",
  },
  question: {
    label: "Question",
    icon: HelpCircle,
    color: "text-emerald-400",
    tagColor: "green",
  },
  moot_tip: {
    label: "Moot Tip",
    icon: Megaphone,
    color: "text-purple-400",
    tagColor: "purple",
  },
};

// Reaction definitions — law-themed
const REACTIONS = [
  { key: "sustained", label: "Sustained", emoji: "✓", color: "text-emerald-400", bgActive: "bg-emerald-400/15 border-emerald-400/30" },
  { key: "overruled", label: "Overruled", emoji: "✗", color: "text-red-400", bgActive: "bg-red-400/15 border-red-400/30" },
  { key: "distinguished", label: "Distinguished", emoji: "◈", color: "text-blue-400", bgActive: "bg-blue-400/15 border-blue-400/30" },
] as const;

interface PostCardProps {
  post: {
    _id: string;
    _creationTime: number;
    body: string;
    category: string;
    caseReference?: string;
    sustainedCount: number;
    overruledCount: number;
    distinguishedCount: number;
    bookmarkCount: number;
    profile?: {
      fullName: string;
      universityShort: string;
      chamber?: string;
      rank: string;
    } | null;
    profileId: string;
  };
  currentProfileId?: string;
  isDemo?: boolean;
}

export function PostCard({ post, currentProfileId, isDemo }: PostCardProps) {
  const catConfig = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.insight;
  const CatIcon = catConfig.icon;
  const authorName = post.profile?.fullName ?? "Advocate";
  const authorInitials = getInitials(authorName);

  // Reactions state
  const toggleReaction = useMutation(anyApi.posts.toggleReaction);
  const myReaction = useQuery(
    anyApi.posts.getMyReaction,
    isDemo ? "skip" : { postId: post._id as any }
  );
  const [optimisticReaction, setOptimisticReaction] = useState<string | null>(null);
  const activeReaction = optimisticReaction !== undefined ? optimisticReaction : myReaction;

  // Optimistic counts
  const [countDeltas, setCountDeltas] = useState<Record<string, number>>({});

  // Bookmark state
  const toggleBookmark = useMutation(anyApi.bookmarks.toggle);
  const isBookmarked = useQuery(
    anyApi.bookmarks.isBookmarked,
    isDemo ? "skip" : { targetId: post._id }
  );
  const [optimisticBookmark, setOptimisticBookmark] = useState<boolean | null>(null);
  const bookmarked = optimisticBookmark ?? isBookmarked ?? false;

  // Delete
  const removePost = useMutation(anyApi.posts.remove);
  const [showMenu, setShowMenu] = useState(false);
  const isOwn = currentProfileId === post.profileId;

  const handleReaction = async (reactionKey: string) => {
    if (isDemo) return;

    const wasActive = activeReaction === reactionKey;
    const countField = `${reactionKey}Count`;

    if (wasActive) {
      // Toggling off
      setOptimisticReaction(null);
      setCountDeltas((d) => ({ ...d, [countField]: (d[countField] ?? 0) - 1 }));
    } else {
      // If switching from another reaction, decrement old
      if (activeReaction) {
        const oldField = `${activeReaction}Count`;
        setCountDeltas((d) => ({ ...d, [oldField]: (d[oldField] ?? 0) - 1 }));
      }
      setOptimisticReaction(reactionKey);
      setCountDeltas((d) => ({ ...d, [countField]: (d[countField] ?? 0) + 1 }));
    }

    try {
      await toggleReaction({ postId: post._id as any, reaction: reactionKey });
    } catch {
      // Revert on error
      setOptimisticReaction(null);
      setCountDeltas({});
    }
  };

  const handleBookmark = async () => {
    if (isDemo) return;
    setOptimisticBookmark(!bookmarked);
    try {
      await toggleBookmark({ targetType: "post", targetId: post._id });
    } catch {
      setOptimisticBookmark(null);
      courtToast.error("Failed to bookmark");
    }
  };

  const handleDelete = async () => {
    if (isDemo) return;
    try {
      await removePost({ postId: post._id as any });
      courtToast.success("Post deleted");
    } catch {
      courtToast.error("Failed to delete");
    }
    setShowMenu(false);
  };

  const getCount = (field: string, base: number) => Math.max(0, base + (countDeltas[field] ?? 0));

  return (
    <Card className="overflow-hidden">
      {/* Author header */}
      <div className="flex items-start gap-2.5 px-4 pt-3.5 pb-2">
        <Avatar
          initials={authorInitials}
          chamber={post.profile?.chamber}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-court-sm font-bold text-court-text truncate">
              {authorName}
            </span>
            <span className="text-court-xs text-court-text-ter">
              {post.profile?.universityShort}
            </span>
            <span className="text-court-xs text-court-text-ter">
              · {timeAgo(post._creationTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <CatIcon size={11} className={catConfig.color} />
            <Tag color={catConfig.tagColor as any} small>
              {catConfig.label}
            </Tag>
          </div>
        </div>

        {/* Menu (own posts only) */}
        {isOwn && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-court-text-ter hover:text-court-text transition-colors p-1"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-7 z-20 bg-navy-card border border-court-border rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-court-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-2">
        <p className="text-court-base text-court-text leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>
        {post.caseReference && (
          <div className="mt-2 px-3 py-2 bg-white/[0.02] border border-court-border-light rounded-lg">
            <span className="text-court-xs text-court-text-sec italic">
              📎 {post.caseReference}
            </span>
          </div>
        )}
      </div>

      {/* Reactions bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-court-border-light">
        {REACTIONS.map((r) => {
          const countField = `${r.key}Count` as keyof typeof post;
          const count = getCount(
            `${r.key}Count`,
            (post[countField] as number) ?? 0
          );
          const isActive = activeReaction === r.key;

          return (
            <button
              key={r.key}
              onClick={() => handleReaction(r.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-court-sm font-semibold transition-all border ${
                isActive
                  ? r.bgActive
                  : "bg-transparent border-transparent text-court-text-ter hover:bg-white/[0.04]"
              }`}
              title={r.label}
            >
              <span className={isActive ? r.color : ""}>{r.emoji}</span>
              <span className={isActive ? r.color : ""}>{r.label}</span>
              {count > 0 && (
                <span className={`ml-0.5 ${isActive ? r.color : "text-court-text-ter"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Bookmark — pushed to right */}
        <button
          onClick={handleBookmark}
          className={`ml-auto flex items-center gap-1 px-2 py-1.5 rounded-full text-court-sm transition-all ${
            bookmarked
              ? "text-gold"
              : "text-court-text-ter hover:text-court-text-sec"
          }`}
          title={bookmarked ? "Saved to Brief" : "Add to Brief"}
        >
          <Bookmark
            size={14}
            className={bookmarked ? "fill-gold" : ""}
          />
          {post.bookmarkCount > 0 && (
            <span>{post.bookmarkCount}</span>
          )}
        </button>
      </div>
    </Card>
  );
}
