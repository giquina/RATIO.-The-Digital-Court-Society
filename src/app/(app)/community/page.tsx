"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, Tag, Card, FollowButton, SectionHeader, Skeleton, EmptyState, CardSkeleton } from "@/components/ui";
import { Search, Scale, Medal, Trophy, Users } from "lucide-react";
import { courtToast } from "@/lib/utils/toast";
import type { Id } from "../../../../convex/_generated/dataModel";

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function CommunityPage() {
  const [tab, setTab] = useState(0);
  const [filterTab, setFilterTab] = useState(0);
  const [search, setSearch] = useState("");

  const profile = useQuery(api.users.myProfile);
  const leaderboard = useQuery(api.profiles.getLeaderboard, { limit: 50 });
  const following = useQuery(api.social.getFollowing, profile ? { profileId: profile._id } : "skip");
  const toggleFollow = useMutation(api.social.toggleFollow);

  // Build a set of profile IDs the current user follows
  // getFollowing returns full profile objects, so we extract _id
  const followingIds = new Set(
    (following ?? []).filter(Boolean).map((p) => p!._id as string)
  );
  const isFollowingUser = (targetId: string) => followingIds.has(targetId);

  // Exclude the current user from discover listings
  const allProfiles = (leaderboard ?? []).filter(
    (p) => p._id !== profile?._id
  );

  // Ranked list includes everyone (for rankings tab / podium)
  const rankedAll = (leaderboard ?? []).map((p, i) => ({ ...p, pos: i + 1 }));

  // Chamber-filtered profiles
  const chamberProfiles = profile?.chamber
    ? (leaderboard ?? []).filter((p) => p.chamber === profile.chamber)
    : [];

  // Search filtering helper
  const matchesSearch = (p: { fullName: string; university: string; universityShort: string; chamber?: string }) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(term) ||
      p.university.toLowerCase().includes(term) ||
      p.universityShort.toLowerCase().includes(term) ||
      (p.chamber ?? "").toLowerCase().includes(term)
    );
  };

  const filteredDiscover = allProfiles.filter(matchesSearch);
  const filteredChamber = chamberProfiles.filter(matchesSearch);

  const handleFollow = async (targetProfileId: Id<"profiles">) => {
    if (!profile) return;
    try {
      await toggleFollow({ followerId: profile._id, followingId: targetProfileId });
    } catch {
      courtToast.error("Failed to update follow");
    }
  };

  const isLoading = leaderboard === undefined || profile === undefined;

  const tabs = ["Discover", "Rankings", "Your Chamber"];

  // Stats from real profile
  const statsLine = profile
    ? `${profile.followerCount} followers \u00B7 ${profile.followingCount} following`
    : "";

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Community</h1>
        <p className="text-xs text-court-text-sec mb-3.5">
          {profile ? statsLine : <Skeleton className="h-3 w-48 inline-block" />}
        </p>
        <div className="bg-white/[0.05] rounded-xl px-3.5 py-2.5 flex items-center gap-2 mb-3.5">
          <Search size={14} className="text-court-text-ter opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search advocates, universities..."
            className="flex-1 bg-transparent text-xs text-court-text outline-none placeholder:text-court-text-ter"
            aria-label="Search community"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-court-text-ter text-xs">{"\u2715"}</button>
          )}
        </div>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-0.5">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => { setTab(i); setFilterTab(0); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all truncate px-1 ${tab === i ? "bg-gold text-navy" : "text-court-text-sec"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Discover Tab ── */}
      {tab === 0 && (
        <div className="px-4">
          <div className="flex gap-1.5 mb-3.5 flex-wrap">
            {["Suggested", "Same Modules", "Same Year", "Rising Stars"].map((f, i) => (
              <button key={f} onClick={() => setFilterTab(i)}
                className={`px-3 py-1 rounded-full text-court-xs font-semibold border transition-all ${
                  filterTab === i ? "border-gold/40 bg-gold-dim text-gold" : "border-court-border text-court-text-ter"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDiscover.length === 0 ? (
            <EmptyState
              icon={<Users size={28} />}
              title="No advocates found"
              description={search ? "Try a different search term." : "No advocates to discover yet. Check back soon."}
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredDiscover.map((p) => (
                <Card key={p._id} className="p-3.5">
                  <div className="flex gap-3 items-center">
                    <Avatar initials={getInitials(p.fullName)} chamber={p.chamber} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-court-text">{p.fullName}</p>
                          <p className="text-court-xs text-court-text-ter mt-0.5">
                            {p.universityShort} · Year {p.yearOfStudy}{p.chamber ? ` \u00B7 ${p.chamber} Chamber` : ""}
                          </p>
                        </div>
                        <FollowButton
                          isFollowing={isFollowingUser(p._id as string)}
                          onToggle={() => handleFollow(p._id)}
                        />
                      </div>
                    </div>
                  </div>
                  {p.bio && (
                    <p className="text-xs text-court-text-sec mt-2 leading-relaxed">{p.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-2.5 border-t border-court-border-light items-center">
                    {[
                      { v: p.followerCount, l: "followers" },
                      { v: p.totalMoots, l: "moots" },
                      { v: p.commendationCount, l: "commendations" },
                    ].map((s) => (
                      <div key={s.l} className="shrink-0">
                        <span className="text-court-base font-bold text-court-text">{s.v}</span>
                        <span className="text-court-xs text-court-text-ter ml-1">{s.l}</span>
                      </div>
                    ))}
                    <Tag>{p.rank}</Tag>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Rankings Tab ── */}
      {tab === 1 && (
        <div className="px-4">
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {["National", "Your University", "Your Chamber", "This Month"].map((f, i) => (
              <button key={f} onClick={() => setFilterTab(i)}
                className={`px-3 py-1 rounded-full text-court-xs font-semibold border transition-all ${
                  filterTab === i ? "border-gold/40 bg-gold-dim text-gold" : "border-court-border text-court-text-ter"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : rankedAll.length < 3 ? (
            <EmptyState
              icon={<Trophy size={28} />}
              title="Not enough advocates"
              description="Rankings will appear once more advocates join the platform."
            />
          ) : (
            <>
              {/* Top 3 Podium */}
              <div className="flex justify-center gap-2 mb-5 items-end">
                {[rankedAll[1], rankedAll[0], rankedAll[2]].map((r, i) => {
                  const isFirst = i === 1;
                  const isMe = r._id === profile?._id;
                  return (
                    <div key={r._id} className="flex-1 text-center">
                      <Avatar initials={getInitials(r.fullName)} size={isFirst ? "xl" : "lg"} chamber={r.chamber} border={isFirst} />
                      <p className={`${isFirst ? "text-court-base" : "text-court-sm"} font-bold ${isMe ? "text-gold" : "text-court-text"} mt-1.5`}>
                        {r.fullName.split(" ")[0]} {isMe && <span className="text-court-xs font-normal">(You)</span>}
                      </p>
                      <p className="text-court-xs text-court-text-ter">{r.universityShort}</p>
                      <div className={`mt-1.5 py-1 rounded-lg ${isFirst ? "bg-gold-dim border border-gold/25" : "bg-white/[0.04] border border-court-border-light"}`}>
                        <div className="flex justify-center">{[
                          <Medal key="silver" size={16} className="text-gray-300" />,
                          <Trophy key="gold" size={20} className="text-gold" />,
                          <Medal key="bronze" size={16} className="text-orange-400" />,
                        ][i]}</div>
                        <p className="text-court-xs text-court-text-ter">{r.totalPoints} pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Remaining rankings */}
              <div className="flex flex-col gap-2">
                {rankedAll.slice(3).filter(matchesSearch).map((r) => {
                  const isMe = r._id === profile?._id;
                  return (
                    <Card key={r._id} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
                      <span className="text-sm font-bold text-court-text-ter w-6 text-center font-serif">{r.pos}</span>
                      <Avatar initials={getInitials(r.fullName)} chamber={r.chamber} size="sm" />
                      <div className="flex-1">
                        <p className={`text-court-base font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                          {r.fullName} {isMe && <span className="text-court-xs font-normal">(You)</span>}
                        </p>
                        <p className="text-court-xs text-court-text-ter">{r.universityShort} · {r.totalMoots} moots</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-court-text font-serif">{r.totalPoints}</p>
                        <p className="text-court-xs text-court-text-ter uppercase">points</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Chamber Tab ── */}
      {tab === 2 && (
        <div className="px-4">
          {isLoading ? (
            <div className="flex flex-col gap-2.5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : !profile?.chamber ? (
            <EmptyState
              icon={<Scale size={28} />}
              title="No chamber selected"
              description="Join a chamber to see your fellow advocates here."
            />
          ) : (
            <>
              <Card highlight className="p-5 text-center mb-4">
                <Scale size={36} className="text-gold mx-auto" />
                <h2 className="font-serif text-xl font-bold text-court-text mt-2">{profile.chamber} Chamber</h2>
                <p className="text-court-sm text-court-text-sec mt-1">{chamberProfiles.length} members</p>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { v: String(chamberProfiles.length), l: "Members" },
                    { v: String(chamberProfiles.reduce((sum, p) => sum + p.totalMoots, 0)), l: "Moots" },
                    { v: String(chamberProfiles.reduce((sum, p) => sum + p.totalPoints, 0)), l: "Points" },
                  ].map(s => (
                    <div key={s.l} className="text-center min-w-0">
                      <p className="font-serif text-base font-bold text-court-text">{s.v}</p>
                      <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5 truncate">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <SectionHeader title="Top Advocates" />
              {filteredChamber.length === 0 ? (
                <EmptyState
                  icon={<Users size={28} />}
                  title="No advocates found"
                  description={search ? "Try a different search term." : "No chamber members found yet."}
                />
              ) : (
                filteredChamber.map((p, i) => {
                  const isMe = p._id === profile?._id;
                  return (
                    <Card key={p._id} className="px-3.5 py-3 flex items-center gap-3 mb-2">
                      <span className="text-court-base font-bold text-gold w-5 font-serif">{i + 1}</span>
                      <Avatar initials={getInitials(p.fullName)} chamber={p.chamber} size="sm" />
                      <div className="flex-1">
                        <p className={`text-court-base font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                          {p.fullName} {isMe && <span className="text-court-xs font-normal">(You)</span>}
                        </p>
                        <p className="text-court-xs text-court-text-ter">{p.universityShort} · {p.totalMoots} moots</p>
                      </div>
                      <Tag>{p.rank}</Tag>
                    </Card>
                  );
                })
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
