"use client";

import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Card, DynamicIcon, EmptyState, Skeleton } from "@/components/ui";
import { useIsDemoAccount } from "@/hooks/useIsDemoAccount";
import { DEMO_NOTIFICATIONS } from "@/lib/constants/demo-data";
import { courtToast } from "@/lib/utils/toast";
import { Bell } from "lucide-react";

// ── Notification type → icon mapping ──
const TYPE_ICON: Record<string, string> = {
  feedback_received: "Star",
  role_claimed: "Scale",
  new_follower: "User",
  commendation: "Award",
  badge_earned: "Medal",
  session_reminder: "Calendar",
  streak: "Flame",
  session_invite: "Calendar",
  chamber_update: "Shield",
  achievement: "Trophy",
  referral_activated: "UserPlus",
};

function getIconForType(type: string) {
  return TYPE_ICON[type] ?? "Bell";
}

// ── Relative time formatter ──
function formatTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const isDemo = useIsDemoAccount();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notificationsRaw: any[] | undefined = useQuery(
    anyApi.notifications.getAll,
    profile ? { profileId: profile._id } : "skip"
  );
  // Demo fallback: show mock notifications when real ones are empty
  const notifications = (notificationsRaw && notificationsRaw.length > 0) ? notificationsRaw : (isDemo ? DEMO_NOTIFICATIONS : notificationsRaw);
  const markRead = useMutation(anyApi.notifications.markRead);
  const markAllRead = useMutation(anyApi.notifications.markAllRead);

  const unread = (notifications ?? []).filter((n) => !n.read);
  const read = (notifications ?? []).filter((n) => n.read);

  const handleMarkAllRead = async () => {
    if (!profile || isDemo) return;
    try {
      await markAllRead({ profileId: profile._id });
    } catch {
      courtToast.error("Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    // Skip Convex mutation for demo mock notifications
    if (isDemo) return;
    try {
      await markRead({ notificationId: notificationId as any });
    } catch {
      // silent fail
    }
  };

  // ── Loading state ──
  if (notifications === undefined) {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-4">
          <Skeleton className="h-7 w-36 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="px-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="px-3.5 py-3 flex gap-3 items-start">
              <Skeleton rounded className="w-9 h-9 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (notifications.length === 0) {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text">Notifications</h1>
          <p className="text-xs text-court-text-sec mt-0.5">0 unread</p>
        </div>
        <EmptyState
          icon={<Bell size={28} />}
          title="No notifications yet"
          description="When you receive feedback, followers, or session updates, they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-court-text">Notifications</h1>
          <p className="text-xs text-court-text-sec mt-0.5">{unread.length} unread</p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-gold font-semibold hover:text-gold/80 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <section className="px-4 mb-4">
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">New</p>
          <div className="flex flex-col gap-2">
            {unread.map((n) => (
              <Card
                key={n._id}
                onClick={() => handleNotificationClick(n._id)}
                className="px-3.5 py-3 flex gap-3 items-start border-gold/15 bg-gold/[0.02] cursor-pointer hover:bg-gold/[0.05] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center shrink-0">
                  <DynamicIcon name={getIconForType(n.type)} size={16} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-court-base font-bold text-court-text min-w-0 break-words">{n.title}</p>
                    <span className="text-court-xs text-court-text-ter shrink-0">
                      {formatTimeAgo(n._creationTime)}
                    </span>
                  </div>
                  {n.body && (
                    <p className="text-court-sm text-court-text-sec mt-0.5">{n.body}</p>
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Read */}
      {read.length > 0 && (
        <section className="px-4">
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Earlier</p>
          <div className="flex flex-col gap-2">
            {read.map((n) => (
              <Card
                key={n._id}
                onClick={() => handleNotificationClick(n._id)}
                className="px-3.5 py-3 flex gap-3 items-start cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 opacity-60">
                  <DynamicIcon name={getIconForType(n.type)} size={16} className="text-court-text-sec" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-court-base font-medium text-court-text-sec min-w-0 break-words">{n.title}</p>
                    <span className="text-court-xs text-court-text-ter shrink-0">
                      {formatTimeAgo(n._creationTime)}
                    </span>
                  </div>
                  {n.body && (
                    <p className="text-court-sm text-court-text-ter mt-0.5">{n.body}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All caught up state */}
      {unread.length === 0 && read.length > 0 && (
        <div className="px-4 mb-4">
          <div className="text-center py-4 bg-white/[0.02] rounded-xl border border-court-border-light">
            <p className="text-sm text-court-text-sec">All caught up</p>
          </div>
        </div>
      )}
    </div>
  );
}
