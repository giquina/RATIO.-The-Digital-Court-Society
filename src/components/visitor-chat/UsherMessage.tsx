"use client";

import type { UsherMessage as MessageType } from "@/stores/usherStore";

interface UsherMessageProps {
  message: MessageType;
}

export function UsherMessage({ message }: UsherMessageProps) {
  const isUsher = message.role === "usher";

  if (message.type === "greeting") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] bg-gold/[0.06] border border-gold/10 rounded-court px-3.5 py-2.5">
          <p className="font-serif text-court-xs text-gold font-bold mb-1">The Usher</p>
          <p className="text-court-base text-court-text leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  if (isUsher) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] bg-gold/[0.06] border border-gold/10 rounded-court px-3.5 py-2.5">
          <p className="font-serif text-court-xs text-gold font-bold mb-1">The Usher</p>
          <p className="text-court-base text-court-text leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // Visitor message
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-navy-card border border-court-border-light rounded-court px-3.5 py-2.5">
        <p className="text-court-base text-court-text leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
