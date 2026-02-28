"use client";

import { Scale } from "lucide-react";

interface UsherBubbleProps {
  hasUnread: boolean;
  onClick: () => void;
}

export function UsherBubble({ hasUnread, onClick }: UsherBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20 hover:bg-gold/90 transition-colors cursor-pointer"
      aria-label="Chat with The Usher"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-gold/40 animate-pulse-ring" />

      <Scale size={20} className="text-navy" />

      {/* Unread badge */}
      {hasUnread && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold border-2 border-navy-mid animate-glow-pulse" />
      )}
    </button>
  );
}
