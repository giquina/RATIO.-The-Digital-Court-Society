"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Scale,
  Mic,
  BookOpen,
  Search,
  Trophy,
  Landmark,
  Users,
  User,
  FolderOpen,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Wrench,
  Flame,
  Plus,
} from "lucide-react";
import { Avatar, Tag, Skeleton, Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils/helpers";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useSidebarCounts, type SidebarCounts } from "@/lib/hooks/useSidebarCounts";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

const DEMO_PROFILE = {
  fullName: "Demo Advocate",
  chamber: "Gray's",
  rank: "Pupil",
  streakDays: 3,
  totalMoots: 0,
  totalPoints: 0,
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Key in SidebarCounts for badge. Undefined = no badge. */
  countKey?: keyof SidebarCounts;
  /** Tooltip shown in collapsed mode and for beginner terms */
  tooltip?: string;
  /** Beginner-mode subtitle */
  subtitle?: string;
  /** data-tour attribute for onboarding tour targeting */
  tourId?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Navigation Structure ──

const sections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { href: "/home", label: "Home", icon: Home, tooltip: "Dashboard" },
      { href: "/sessions", label: "Sessions", icon: Scale, countKey: "upcomingSessions", tooltip: "Moot court sessions", subtitle: "Join a moot court hearing", tourId: "nav-sessions" },
      { href: "/ai-practice", label: "AI Practice", icon: Mic, countKey: "aiDrafts", tooltip: "Practice with AI", subtitle: "Practice with an AI judge", tourId: "nav-ai-practice" },
      { href: "/notifications", label: "Notifications", icon: Bell, countKey: "unreadNotifications", tooltip: "Notifications" },
    ],
  },
  {
    title: "LEARN",
    items: [
      { href: "/law-book", label: "Law Book", icon: BookOpen, tooltip: "Legal encyclopedia", subtitle: "Collaborative legal encyclopedia", tourId: "nav-law-book" },
      { href: "/research", label: "Research", icon: Search, tooltip: "Legal research" },
      { href: "/research/saved", label: "Saved", icon: Bookmark, countKey: "savedAuthorities", tooltip: "Saved authorities" },
      { href: "/tools", label: "Tools", icon: Wrench, tooltip: "Legal tools" },
    ],
  },
  {
    title: "COMPETE",
    items: [
      { href: "/rankings", label: "Rankings", icon: Trophy, tooltip: "Advocate leaderboard", subtitle: "Advocate leaderboard" },
      { href: "/chambers", label: "Chambers", icon: Landmark, tooltip: "Your Inn of Court group", subtitle: "Your Inn of Court group" },
      { href: "/community", label: "Society", icon: Users, tooltip: "Fellow advocates", tourId: "nav-community" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { href: "/profile", label: "Profile", icon: User, tooltip: "Your profile", tourId: "nav-profile" },
      { href: "/portfolio", label: "Portfolio", icon: FolderOpen, tooltip: "Your advocacy record", subtitle: "Your advocacy record" },
      { href: "/settings", label: "Settings", icon: Settings, tooltip: "Settings" },
    ],
  },
];

// ── Badge Component ──

function SidebarBadge({ count, collapsed }: { count: number; collapsed: boolean }) {
  if (!count || count <= 0) return null;

  if (collapsed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-gold"
        />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={count}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="ml-auto min-w-[18px] h-[18px] px-1.5 rounded-full bg-gold/15 text-gold text-court-xs font-bold flex items-center justify-center"
      >
        {count > 9 ? "9+" : count}
      </motion.span>
    </AnimatePresence>
  );
}

// ── Mini Profile ──

function SidebarProfile({ collapsed }: { collapsed: boolean }) {
  const convexProfile = useDemoQuery(anyApi.users.myProfile);
  const profile = CONVEX_URL ? convexProfile : DEMO_PROFILE;
  const isLoading = CONVEX_URL && profile === undefined;

  if (isLoading) {
    return (
      <div className={cn("px-3 py-3 border-t border-court-border", collapsed ? "flex justify-center" : "")}>
        {collapsed ? (
          <Skeleton rounded className="w-6 h-6" />
        ) : (
          <div className="hidden lg:flex gap-2.5 items-center">
            <Skeleton rounded className="w-8 h-8 shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!profile) return null;

  const content = (
    <Link href="/profile" className="block">
      <div className={cn(
        "px-3 py-3 border-t border-court-border transition-colors duration-200 hover:bg-white/[0.02]",
        collapsed ? "flex justify-center" : ""
      )}>
        {collapsed ? (
          <Avatar name={profile.fullName} chamber={profile.chamber} size="xs" />
        ) : (
          <div className="hidden lg:flex gap-2.5 items-center">
            <Avatar name={profile.fullName} chamber={profile.chamber} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-court-base font-semibold text-court-text truncate">{profile.fullName}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-court-xs text-court-text-ter">{profile.rank}</span>
                {profile.streakDays > 0 && (
                  <span className="text-court-xs text-gold flex items-center gap-0.5">
                    <Flame size={10} className="text-gold" />
                    {profile.streakDays}d
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={profile.fullName} description={profile.rank} side="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}

// ── Main Sidebar ──

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, beginnerMode, toggleCollapsed, markRouteVisited, hasVisited } = useSidebarStore();
  const convexProfile = useDemoQuery(anyApi.users.myProfile);
  const profile = CONVEX_URL ? convexProfile : DEMO_PROFILE;
  const counts = useSidebarCounts();

  // Detect beginner: no moots + no points
  const isBeginner = profile ? profile.totalMoots === 0 && profile.totalPoints === 0 : false;
  const showSubtitles = beginnerMode && isBeginner && !collapsed;

  // Track route visits for "NEW" tags
  useEffect(() => {
    if (pathname) markRouteVisited(pathname);
  }, [pathname, markRouteVisited]);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen bg-navy-mid border-r border-court-border z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "lg:w-[240px] w-[72px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-court-border shrink-0">
        <Link href="/home" className="flex items-center gap-2">
          <Scale size={24} className="text-gold shrink-0" />
          {!collapsed && (
            <span className="hidden lg:inline font-serif text-lg font-bold tracking-[0.12em] text-court-text">
              RATIO<span className="text-gold">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Create Session CTA */}
      {(() => {
        const isCreateActive = pathname === "/sessions/create";
        const ctaLink = (
          <Link
            href="/sessions/create"
            data-tour="create-session"
            className={cn(
              "flex items-center justify-center gap-2 w-full h-10 rounded-xl font-semibold text-court-sm transition-all duration-200",
              isCreateActive
                ? "bg-gold text-navy shadow-sm"
                : "bg-gold/15 text-gold hover:bg-gold hover:text-navy"
            )}
          >
            <Plus size={18} strokeWidth={2.5} className="shrink-0" />
            {!collapsed && (
              <span className="hidden lg:inline">Create Session</span>
            )}
          </Link>
        );

        return (
          <div className="px-2 pt-4 pb-2 shrink-0">
            {collapsed ? (
              <Tooltip content="Create Session" side="right">
                {ctaLink}
              </Tooltip>
            ) : (
              ctaLink
            )}
          </div>
        );
      })()}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <h3 className="hidden lg:block text-court-xs font-bold tracking-[0.15em] text-court-text-ter px-3 mb-2" role="heading" aria-level={3}>
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              const count = item.countKey && counts ? counts[item.countKey] : 0;
              const isNew = isBeginner && !hasVisited(item.href) && item.href !== "/home";

              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tour={item.tourId}
                  className={cn(
                    "flex items-center gap-3 px-3 rounded-xl mb-0.5 transition-all duration-200 group relative",
                    showSubtitles && item.subtitle ? "py-2" : "py-2.5",
                    isActive
                      ? "bg-gold-dim text-gold"
                      : "text-court-text-sec hover:bg-white/[0.04] hover:text-court-text"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-r" />
                  )}
                  <div className="relative shrink-0">
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className="shrink-0"
                    />
                    {collapsed && <SidebarBadge count={count} collapsed />}
                  </div>
                  {!collapsed && (
                    <>
                      <div className="hidden lg:block flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-court-base font-semibold truncate">{item.label}</span>
                          {isNew && <Tag color="gold" small>NEW</Tag>}
                        </div>
                        {showSubtitles && item.subtitle && (
                          <p className="text-court-xs text-court-text-ter truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                      <SidebarBadge count={count} collapsed={false} />
                    </>
                  )}
                </Link>
              );

              // Wrap in tooltip when collapsed
              if (collapsed) {
                return (
                  <Tooltip key={item.href} content={item.label} description={item.tooltip !== item.label ? item.tooltip : undefined} side="right">
                    {navLink}
                  </Tooltip>
                );
              }

              return <div key={item.href}>{navLink}</div>;
            })}
          </div>
        ))}
      </nav>

      {/* Mini Profile */}
      <SidebarProfile collapsed={collapsed} />

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex items-center justify-center h-12 border-t border-court-border text-court-text-ter hover:text-court-text transition-colors focus:outline-none focus:ring-1 focus:ring-gold/20"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
