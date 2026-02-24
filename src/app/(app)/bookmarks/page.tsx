"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Skeleton, EmptyState } from "@/components/ui";
import { PostCard } from "@/components/shared/PostCard";
import { QuerySafeBoundary } from "@/components/shared/QuerySafeBoundary";
import { Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useIsDemoAccount } from "@/hooks/useIsDemoAccount";

// Isolated component — contains the bookmarks.list query
// which may crash if Convex schema isn't deployed yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BookmarksContent({ profile }: { profile: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmarks: any[] | undefined = useQuery(anyApi.bookmarks.list, {});
  const isDemo = useIsDemoAccount();
  const isLoading = bookmarks === undefined;

  const postBookmarks = (bookmarks ?? []).filter(
    (b: any) => b.targetType === "post" && b.target
  );

  return (
    <>
      {/* Loading */}
      {isLoading && (
        <>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-3.5">
              <Skeleton className="w-full h-20 rounded-lg" />
            </Card>
          ))}
        </>
      )}

      {/* Empty */}
      {!isLoading && postBookmarks.length === 0 && (
        <EmptyState
          icon={<Bookmark size={28} />}
          title="No saved posts yet"
          description="Tap the bookmark icon on any post to save it to your Brief for later"
        />
      )}

      {/* Bookmarked posts */}
      {postBookmarks.map((bookmark: any) => (
        <div key={bookmark._id}>
          <PostCard
            post={{
              ...bookmark.target,
              profile: bookmark.authorProfile,
            }}
            currentProfileId={profile?._id}
            isDemo={isDemo}
          />
          {bookmark.note && (
            <div className="mx-4 -mt-1 px-3 py-2 bg-gold/[0.05] border border-gold/10 rounded-b-lg">
              <span className="text-court-xs text-gold/80 italic">
                📝 {bookmark.note}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default function BookmarksPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);

  return (
    <div className="pb-28 pt-3 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/profile"
            className="text-court-text-ter hover:text-court-text transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="text-gold" />
            <h1 className="font-serif text-xl font-bold text-court-text">
              My Brief
            </h1>
          </div>
        </div>
        <p className="text-court-sm text-court-text-ter ml-8">
          Your privately saved posts — only you can see these
        </p>
      </div>

      <div className="px-4 flex flex-col gap-2.5">
        <QuerySafeBoundary
          fallback={
            <EmptyState
              icon={<Bookmark size={28} />}
              title="No saved posts yet"
              description="Tap the bookmark icon on any post to save it to your Brief for later"
            />
          }
        >
          <BookmarksContent profile={profile} />
        </QuerySafeBoundary>
      </div>
    </div>
  );
}
