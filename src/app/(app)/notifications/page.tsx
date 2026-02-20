"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Card, Tag, DynamicIcon } from "@/components/ui";

const INITIAL_NOTIFICATIONS = [
  { id: "n1", type: "feedback_received", title: "Priya Sharma gave you feedback", body: "Score: 4.2 \u2014 \"Excellent use of authorities\"", time: "2h", read: false, icon: "Star", link: "/profile" },
  { id: "n2", type: "role_claimed", title: "Sophie Chen claimed Junior Counsel (Res.)", body: "Judicial Review of Executive Power \u00b7 Tue 25 Feb", time: "3h", read: false, icon: "Scale", link: "/sessions" },
  { id: "n3", type: "new_follower", title: "James Okafor started following you", body: "LSE \u00b7 Year 2 \u00b7 Inner Chamber", time: "5h", read: false, icon: "User", link: "/community" },
  { id: "n4", type: "commendation", title: "14 commendations on your moot session", body: "Contract Law \u2014 Anticipatory Breach", time: "6h", read: true, icon: "Award", link: "/sessions" },
  { id: "n5", type: "badge_earned", title: "Badge earned: Regular Advocate", body: "You completed 5 moot sessions!", time: "1d", read: true, icon: "Medal", link: "/profile" },
  { id: "n6", type: "session_reminder", title: "Session tomorrow at 14:00", body: "Judicial Review of Executive Power \u00b7 UCL Room 101", time: "1d", read: true, icon: "Calendar", link: "/sessions" },
  { id: "n7", type: "streak", title: "12-day streak! Keep going", body: "You're in the top 24% nationally", time: "1d", read: true, icon: "Flame", link: "/profile" },
  { id: "n8", type: "new_follower", title: "Fatima Al-Rashid started following you", body: "Oxford \u00b7 Year 3 \u00b7 Gray's Chamber", time: "2d", read: true, icon: "User", link: "/community" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (notification: typeof INITIAL_NOTIFICATIONS[number]) => {
    handleMarkRead(notification.id);
    router.push(notification.link);
  };

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
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="px-3.5 py-3 flex gap-3 items-start border-gold/15 bg-gold/[0.02] cursor-pointer hover:bg-gold/[0.05] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center shrink-0">
                  <DynamicIcon name={n.icon} size={16} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-court-base font-bold text-court-text">{n.title}</p>
                    <span className="text-court-xs text-court-text-ter shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-court-sm text-court-text-sec mt-0.5">{n.body}</p>
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
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="px-3.5 py-3 flex gap-3 items-start cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 opacity-60">
                  <DynamicIcon name={n.icon} size={16} className="text-court-text-sec" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-court-base font-medium text-court-text-sec">{n.title}</p>
                    <span className="text-court-xs text-court-text-ter shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-court-sm text-court-text-ter mt-0.5">{n.body}</p>
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
            <p className="text-sm text-court-text-sec">All caught up!</p>
          </div>
        </div>
      )}
    </div>
  );
}
