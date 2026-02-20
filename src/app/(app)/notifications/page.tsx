"use client";

import { Avatar, Card, Tag } from "@/components/ui";

const NOTIFICATIONS = [
  { type: "feedback_received", title: "Priya Sharma gave you feedback", body: "Score: 4.2 — \"Excellent use of authorities\"", time: "2h", read: false, icon: "⭐" },
  { type: "role_claimed", title: "Sophie Chen claimed Junior Counsel (Res.)", body: "Judicial Review of Executive Power · Tue 25 Feb", time: "3h", read: false, icon: "⚖️" },
  { type: "new_follower", title: "James Okafor started following you", body: "LSE · Year 2 · Inner Chamber", time: "5h", read: false, icon: "👤" },
  { type: "commendation", title: "14 commendations on your moot session", body: "Contract Law — Anticipatory Breach", time: "6h", read: true, icon: "🏅" },
  { type: "badge_earned", title: "Badge earned: Regular Advocate", body: "You completed 5 moot sessions!", time: "1d", read: true, icon: "🎖️" },
  { type: "session_reminder", title: "Session tomorrow at 14:00", body: "Judicial Review of Executive Power · UCL Room 101", time: "1d", read: true, icon: "📅" },
  { type: "streak", title: "12-day streak! Keep going 🔥", body: "You're in the top 24% nationally", time: "1d", read: true, icon: "🔥" },
  { type: "new_follower", title: "Fatima Al-Rashid started following you", body: "Oxford · Year 3 · Gray's Chamber", time: "2d", read: true, icon: "👤" },
];

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read);
  const read = NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-court-text">Notifications</h1>
          <p className="text-xs text-court-text-sec mt-0.5">{unread.length} unread</p>
        </div>
        <button className="text-xs text-gold font-semibold">Mark all read</button>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <section className="px-4 mb-4">
          <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">New</p>
          <div className="flex flex-col gap-2">
            {unread.map((n, i) => (
              <Card key={i} className="px-3.5 py-3 flex gap-3 items-start border-gold/15 bg-gold/[0.02]">
                <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center text-base shrink-0">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-[13px] font-bold text-court-text">{n.title}</p>
                    <span className="text-[10px] text-court-text-ter shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-court-text-sec mt-0.5">{n.body}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Read */}
      <section className="px-4">
        <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">Earlier</p>
        <div className="flex flex-col gap-2">
          {read.map((n, i) => (
            <Card key={i} className="px-3.5 py-3 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center text-base shrink-0 opacity-60">
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-[13px] font-medium text-court-text-sec">{n.title}</p>
                  <span className="text-[10px] text-court-text-ter shrink-0 ml-2">{n.time}</span>
                </div>
                <p className="text-[11px] text-court-text-ter mt-0.5">{n.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
