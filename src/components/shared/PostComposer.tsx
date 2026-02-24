"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Button, Tag } from "@/components/ui";
import { courtToast } from "@/lib/utils/toast";
import {
  X,
  Loader2,
  Lightbulb,
  Scale,
  HelpCircle,
  Megaphone,
} from "lucide-react";

const CATEGORIES = [
  { key: "insight", label: "Legal Insight", icon: Lightbulb, color: "gold" },
  { key: "case_spot", label: "Case Spot", icon: Scale, color: "blue" },
  { key: "question", label: "Question", icon: HelpCircle, color: "green" },
  { key: "moot_tip", label: "Moot Tip", icon: Megaphone, color: "purple" },
] as const;

export function PostComposer({ onPosted }: { onPosted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("insight");
  const [caseRef, setCaseRef] = useState("");
  const [posting, setPosting] = useState(false);
  const createPost = useMutation(anyApi.posts.create);

  const charCount = body.length;
  const overLimit = charCount > 500;

  const handlePost = async () => {
    if (!body.trim() || overLimit) return;
    setPosting(true);
    try {
      await createPost({
        body: body.trim(),
        category,
        caseReference: caseRef.trim() || undefined,
      });
      courtToast.success("Post published");
      setBody("");
      setCaseRef("");
      setCategory("insight");
      setOpen(false);
      onPosted?.();
    } catch {
      courtToast.error("Failed to post");
    } finally {
      setPosting(false);
    }
  };

  if (!open) {
    return (
      <Card
        className="p-3.5 cursor-pointer hover:border-gold/20 transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Lightbulb size={14} className="text-gold" />
          </div>
          <span className="text-court-sm text-court-text-ter italic flex-1">
            What&apos;s on your mind, Counsel?
          </span>
          <Tag color="gold" small>
            POST
          </Tag>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-gold/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-court-border-light">
        <span className="text-court-sm font-bold text-court-text">
          New Post
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-court-text-ter hover:text-court-text transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category picker */}
      <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-white/[0.03] text-court-text-sec border border-court-border-light hover:border-white/10"
              }`}
            >
              <Icon size={12} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Body textarea */}
      <div className="px-4 py-2">
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            category === "question"
              ? "Ask your fellow advocates..."
              : category === "case_spot"
                ? "Share a case you found interesting..."
                : category === "moot_tip"
                  ? "Share advocacy advice..."
                  : "Share a legal insight..."
          }
          className="w-full bg-transparent text-court-text text-court-base resize-none outline-none placeholder:text-court-text-ter min-h-[100px]"
          maxLength={520}
        />
      </div>

      {/* Optional case reference */}
      <div className="px-4 pb-2">
        <input
          value={caseRef}
          onChange={(e) => setCaseRef(e.target.value)}
          placeholder="Case reference (optional) e.g. R v Miller [1983] 2 AC 161"
          className="w-full bg-white/[0.03] border border-court-border-light rounded-lg px-3 py-2 text-xs text-court-text placeholder:text-court-text-ter outline-none focus:border-gold/30 transition-colors"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-court-border-light">
        <span
          className={`text-xs ${overLimit ? "text-red-400 font-bold" : "text-court-text-ter"}`}
        >
          {charCount}/500
        </span>
        <Button
          size="sm"
          onClick={handlePost}
          disabled={!body.trim() || overLimit || posting}
        >
          {posting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </Card>
  );
}
