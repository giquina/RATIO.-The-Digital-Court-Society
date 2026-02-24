"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { courtToast } from "@/lib/utils/toast";
import {
  Avatar,
  Tag,
  Card,
  Button,
  SectionHeader,
  CommendButton,
  Skeleton,
  EmptyState,
} from "@/components/ui";
import { Scale, Calendar, Target, Trophy, Flame, Award, MessageCircle, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StarterKit } from "@/components/shared/StarterKit";
import { PostComposer } from "@/components/shared/PostComposer";
import { PostCard } from "@/components/shared/PostCard";
import { useIsDemoAccount } from "@/hooks/useIsDemoAccount";
import { DEMO_ACTIVITY_FEED, DEMO_PROFILE_STATS, DEMO_POSTS } from "@/lib/constants/demo-data";

// ── Activity type → icon & colour mapping ──
const ACTIVITY_ICON_MAP: Record<string, { Icon: LucideIcon; color: string }> = {
  moot_completed: { Icon: Scale, color: "text-gold" },
  session_created: { Icon: Calendar, color: "text-blue-400" },
  badge_earned: { Icon: Award, color: "text-green-500" },
  milestone: { Icon: Trophy, color: "text-amber-400" },
  streak: { Icon: Flame, color: "text-orange-400" },
  resource_shared: { Icon: ExternalLink, color: "text-purple-400" },
};

function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function HomePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const isDemo = useIsDemoAccount();
  const [feedTab, setFeedTab] = useState<"posts" | "following" | "discover" | "chamber">("posts");

  // Posts feed (user-authored content)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: any[] | undefined = useQuery(anyApi.posts.list, { limit: 30 });

  // Real Convex feed + notifications
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feed: any[] | undefined = useQuery(
    anyApi.social.getFeed,
    profile && feedTab !== "posts" ? { profileId: profile._id, feedType: feedTab, limit: 30 } : "skip"
  );
  const toggleCommend = useMutation(anyApi.social.toggleCommend);
  const [optimisticCommends, setOptimisticCommends] = useState<Record<string, boolean>>({});

  const handleCommend = async (activityId: string) => {
    if (!profile) return;
    setOptimisticCommends((p) => ({ ...p, [activityId]: !p[activityId] }));
    try {
      await toggleCommend({
        fromProfileId: profile._id,
        activityId: activityId as any,
      });
    } catch {
      setOptimisticCommends((p) => ({ ...p, [activityId]: !p[activityId] }));
      courtToast.error("Could not commend");
    }
  };

  const isLoading = profile === undefined;

  // Demo account stat overrides — so stats section isn't all zeros
  const stats = isDemo ? {
    streakDays: DEMO_PROFILE_STATS.streakDays,
    readinessScore: DEMO_PROFILE_STATS.readinessScore,
    followerCount: 7,
    commendationCount: 3,
    totalMoots: DEMO_PROFILE_STATS.totalSessions,
    totalHours: 4,
  } : {
    streakDays: profile?.streakDays ?? 0,
    readinessScore: profile?.readinessScore ?? 0,
    followerCount: profile?.followerCount ?? 0,
    commendationCount: profile?.commendationCount ?? 0,
    totalMoots: profile?.totalMoots ?? 0,
    totalHours: profile?.totalHours ?? 0,
  };

  return (
    <div className="pt-2 pb-6">
      {/* ── Starter Kit (new advocates) ── */}
      <section className="px-4 mb-5">
        <StarterKit profile={profile} onDismiss={() => {}} />
      </section>

      {/* ── Streak + Stats Card ── */}
      <section className="px-4 mb-5" data-tour="dashboard">
        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-court" />
        ) : (
          <Card highlight className="p-3 md:p-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-5 w-32 h-32 rounded-full bg-gold/[0.04]" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-1">Practice Streak</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">{stats.streakDays}</span>
                  <span className="text-sm text-court-text-sec">days</span>
                </div>
                <p className="text-court-xs text-court-text-ter mt-1 flex items-center gap-1">
                  <Flame size={12} className="text-orange-400" /> {stats.streakDays === 0 ? "Start your streak today" : "Keep it going"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                  style={{ background: `conic-gradient(#C9A84C 0% ${stats.readinessScore}%, rgba(255,255,255,0.05) ${stats.readinessScore}% 100%)` }}>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-navy-card flex items-center justify-center">
                    <span className="text-sm font-bold text-court-text">{stats.readinessScore}%</span>
                  </div>
                </div>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-1">SQE2 Ready</p>
              </div>
            </div>
            {/* Social stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-4 pt-3.5 border-t border-court-border">
              {[
                { v: stats.followerCount, l: "Followers" },
                { v: stats.commendationCount, l: "Comms" },
                { v: stats.totalMoots, l: "Sessions" },
                { v: `${stats.totalHours}h`, l: "Advocacy" },
              ].map((s) => (
                <div key={s.l} className="text-center min-w-0">
                  <div className="font-serif text-base font-bold text-court-text">{s.v}</div>
                  <div className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5 truncate">{s.l}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* ── Quick Actions ── */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5" data-tour="quick-actions">
          {([
            { Icon: Scale, label: "Create Session", sub: "Host a moot or trial", href: "/sessions/create" },
            { Icon: Calendar, label: "View Timetable", sub: "This week's sessions", href: "/sessions" },
            { Icon: Target, label: "AI Practice", sub: "Train with AI Judge", href: "/ai-practice" },
            { Icon: Trophy, label: "League Table", sub: "National rankings", href: "/society" },
          ] as { Icon: LucideIcon; label: string; sub: string; href: string }[]).map((a) => (
            <Link key={a.label} href={a.href}>
              <Card className="p-3.5 hover:border-white/10">
                <a.Icon size={20} className="text-gold" />
                <p className="text-court-base font-bold text-court-text mt-1.5 mb-0.5">{a.label}</p>
                <p className="text-court-xs text-court-text-ter">{a.sub}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Desktop: two-column layout for session + feed ── */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-4">

      {/* ── Upcoming Session ── */}
      <section className="px-4 lg:px-0 mb-6">
        <SectionHeader title="Your Next Session" action="View all" onAction={() => router.push("/sessions")} />
        {isDemo ? (
          <Card className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-court-sm font-bold text-court-text">Constitutional Law — Royal Prerogative</p>
                <p className="text-court-xs text-court-text-ter">Public Law · Group Moot</p>
              </div>
              <Tag color="green">Upcoming</Tag>
            </div>
            <p className="text-court-xs text-court-text-sec">
              {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              {" · "}4 advocates · Hosted by Amara K.
            </p>
          </Card>
        ) : (
        <EmptyState
          icon={<Calendar size={28} />}
          title="No upcoming sessions"
          description="Create or join a session to get started"
          action={<Button onClick={() => router.push("/sessions")}>Browse Sessions</Button>}
        />
        )}
      </section>

      {/* ── Activity Feed ── */}
      <section className="px-4 lg:px-0">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="font-serif text-lg font-bold text-court-text">Activity</h2>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            {(["posts", "following", "discover", "chamber"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFeedTab(t)}
                className={`text-court-xs sm:text-court-sm font-semibold pb-0.5 capitalize focus:outline-none focus:ring-1 focus:ring-gold/30 rounded-sm ${
                  feedTab === t ? "text-gold border-b-[1.5px] border-gold" : "text-court-text-ter"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* ── Posts tab ── */}
          {feedTab === "posts" && (
            <>
              <PostComposer />

              {/* Posts loading */}
              {posts === undefined && (
                <>
                  {[1, 2].map((i) => (
                    <Card key={i} className="p-3.5">
                      <div className="flex gap-2.5 items-center mb-2.5">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="w-32 h-3.5 mb-1.5" />
                          <Skeleton className="w-20 h-2.5" />
                        </div>
                      </div>
                      <Skeleton className="w-full h-16 rounded-lg mb-2.5" />
                      <Skeleton className="w-48 h-3" />
                    </Card>
                  ))}
                </>
              )}

              {/* Posts empty state */}
              {posts !== undefined && posts.length === 0 && !isDemo && (
                <EmptyState
                  icon={<MessageCircle size={28} />}
                  title="No posts yet"
                  description="Be the first to share a legal insight with your fellow advocates"
                />
              )}

              {/* Demo posts */}
              {posts !== undefined && posts.length === 0 && isDemo && (
                DEMO_POSTS.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post as any}
                    currentProfileId={profile?._id}
                    isDemo={true}
                  />
                ))
              )}

              {/* Real post cards */}
              {(posts ?? []).length > 0 && (posts ?? []).map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentProfileId={profile?._id}
                  isDemo={isDemo}
                />
              ))}
            </>
          )}

          {/* ── Activity tabs (following / discover / chamber) ── */}
          {feedTab !== "posts" && (
            <>
          {/* Loading skeleton */}
          {feed === undefined && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-3.5">
                  <div className="flex gap-2.5 items-center mb-2.5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="w-32 h-3.5 mb-1.5" />
                      <Skeleton className="w-20 h-2.5" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-12 rounded-lg mb-2.5" />
                  <Skeleton className="w-16 h-3" />
                </Card>
              ))}
            </>
          )}

          {/* Empty state */}
          {feed !== undefined && feed.length === 0 && !isDemo && (
            <EmptyState
              icon={<MessageCircle size={28} />}
              title="No activity yet"
              description="Follow other advocates or join a session to see activity here"
            />
          )}

          {/* Demo feed items */}
          {feed !== undefined && feed.length === 0 && isDemo && (
            DEMO_ACTIVITY_FEED.map((item) => {
              const iconConfig = ACTIVITY_ICON_MAP[item.type] || { Icon: Scale, color: "text-court-text-sec" };
              return (
                <Card key={item._id} className="p-3.5">
                  <div className="flex gap-2.5 items-start">
                    <div className={`w-8 h-8 rounded-full bg-navy-card border border-court-border flex items-center justify-center shrink-0 ${iconConfig.color}`}>
                      <iconConfig.Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-court-sm font-bold text-court-text">{item.title}</p>
                      <p className="text-court-xs text-court-text-sec mt-0.5">{item.description}</p>
                      <p className="text-court-xs text-court-text-ter mt-1.5">
                        {new Date(item.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}

          {/* Real feed items */}
          {(feed ?? []).map((item) => {
            const activityMeta = ACTIVITY_ICON_MAP[item.type] ?? { Icon: Scale, color: "text-court-text-sec" };
            const ActivityIcon = activityMeta.Icon;
            const authorName = item.profile?.fullName ?? "Advocate";
            const authorInitials = getInitials(authorName);
            const authorChamber = item.profile?.chamber;
            const authorUni = item.profile?.universityShort ?? "";
            const isCommended = !!optimisticCommends[item._id];
            const displayCount = item.commendationCount + (isCommended ? 1 : 0);

            return (
              <Card key={item._id} className="p-3.5">
                {/* User header */}
                <div className="flex gap-2.5 items-center mb-2.5">
                  <Avatar initials={authorInitials} chamber={authorChamber} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-court-base font-bold text-court-text truncate">{authorName}</span>
                        <span className="text-court-xs text-court-text-ter ml-1.5">{timeAgo(item._creationTime)}</span>
                      </div>
                    </div>
                    <p className="text-court-xs text-court-text-ter mt-0.5">
                      {authorUni}{authorChamber ? ` · ${authorChamber} Chamber` : ""}
                    </p>
                  </div>
                </div>

                {/* Content by type */}
                {item.type === "moot_completed" && (
                  <>
                    <p className="text-court-base text-court-text-sec mb-1">{item.title}</p>
                    {item.metadata && (
                      <div className="bg-white/[0.03] rounded-lg p-2.5 border-l-[3px] border-gold mb-2.5">
                        {item.metadata.topic && (
                          <p className="text-court-base font-bold text-court-text mb-1">{item.metadata.topic}</p>
                        )}
                        {item.metadata.role && <Tag>{item.metadata.role}</Tag>}
                      </div>
                    )}
                  </>
                )}
                {item.type === "badge_earned" && (
                  <div className="bg-green-500/[0.08] rounded-lg p-3 border border-green-500/20 flex gap-2.5 items-center mb-2.5">
                    <Award size={24} className="text-green-500 shrink-0" />
                    <div>
                      <p className="text-court-sm text-green-500 font-semibold mb-0.5">Distinction Earned</p>
                      <p className="text-court-base font-bold text-court-text">
                        {item.metadata?.badgeName ?? item.title}
                      </p>
                    </div>
                  </div>
                )}
                {item.type === "streak" && (
                  <div className="bg-orange-500/[0.08] rounded-lg p-3 border border-orange-500/20 flex gap-2.5 items-center mb-2.5">
                    <Flame size={24} className="text-orange-400 shrink-0" />
                    <p className="text-court-base font-bold text-court-text">{item.title}</p>
                  </div>
                )}
                {item.type === "milestone" && (
                  <div className="bg-amber-500/[0.08] rounded-lg p-3 border border-amber-500/20 flex gap-2.5 items-center mb-2.5">
                    <Trophy size={24} className="text-amber-400 shrink-0" />
                    <p className="text-court-base font-bold text-court-text">{item.title}</p>
                  </div>
                )}
                {item.type === "session_created" && (
                  <p className="text-court-base text-court-text-sec mb-2.5">{item.title}</p>
                )}
                {item.type === "resource_shared" && (
                  <p className="text-court-base text-court-text-sec mb-2.5">{item.title}</p>
                )}
                {item.description && !["moot_completed", "badge_earned"].includes(item.type) && (
                  <p className="text-court-xs text-court-text-ter mb-2.5">{item.description}</p>
                )}

                {/* Activity type indicator */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <ActivityIcon size={12} className={activityMeta.color} />
                  <span className="text-court-xs text-court-text-ter capitalize">
                    {item.type.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2.5 border-t border-court-border-light">
                  <CommendButton
                    isCommended={isCommended}
                    count={displayCount}
                    onToggle={() => handleCommend(item._id)}
                  />
                  <div className="flex gap-3">
                    <button type="button" className="text-court-text-ter cursor-pointer" aria-label="Comment"><MessageCircle size={14} /></button>
                    <button type="button" className="text-court-text-ter cursor-pointer" aria-label="Share"><ExternalLink size={14} /></button>
                  </div>
                </div>
              </Card>
            );
          })}
            </>
          )}
        </div>
      </section>

      </div>{/* end desktop two-column */}
    </div>
  );
}
