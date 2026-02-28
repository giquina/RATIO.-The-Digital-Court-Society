"use client";

import { useRef, useEffect, useState } from "react";
import { X, VolumeX, Volume2, Send } from "lucide-react";
import { useUsherStore, type UsherMessage as MessageType } from "@/stores/usherStore";
import { UsherMessage } from "./UsherMessage";
import { UsherTypingIndicator } from "./UsherTypingIndicator";
import { UsherQuickReplies } from "./UsherQuickReplies";
import { UsherEmailCapture } from "./UsherEmailCapture";

interface UsherPanelProps {
  isTyping: boolean;
  quickReplies: string[];
  showEmailCapture: boolean;
  onSend: (message: string) => void;
  onQuickReply: (option: string) => void;
  onEmailSubmit: (email: string) => void;
  onClose: () => void;
}

export function UsherPanel({
  isTyping,
  quickReplies,
  showEmailCapture,
  onSend,
  onQuickReply,
  onEmailSubmit,
  onClose,
}: UsherPanelProps) {
  const { messages, isMuted, toggleMute } = useUsherStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showEmailCapture]);

  // Focus input on open
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 80) + "px";
  };

  // Find the index of the last usher message for quick replies placement
  const lastUsherIdx = messages.reduce(
    (acc, msg, i) => (msg.role === "usher" ? i : acc),
    -1
  );

  return (
    <div className="flex flex-col bg-navy-mid border border-court-border rounded-court shadow-xl shadow-black/40 overflow-hidden w-[360px] max-sm:w-[calc(100vw-2rem)]"
      style={{ maxHeight: "min(70vh, 500px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-navy-card px-4 py-3 border-b border-court-border">
        <h3 className="font-serif text-court-sm text-gold font-bold">
          The Usher
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-court-text-sec hover:text-gold hover:bg-gold/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-court-text-sec hover:text-gold hover:bg-gold/10 transition-colors"
            aria-label="Close chat"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin"
      >
        {messages.map((msg: MessageType, i: number) => (
          <div key={msg.id}>
            <UsherMessage message={msg} />
            {/* Show quick replies after the last usher message */}
            {i === lastUsherIdx && quickReplies.length > 0 && !isTyping && (
              <UsherQuickReplies
                options={quickReplies}
                onSelect={onQuickReply}
              />
            )}
          </div>
        ))}

        {isTyping && <UsherTypingIndicator />}

        {showEmailCapture && (
          <UsherEmailCapture onSubmit={onEmailSubmit} />
        )}
      </div>

      {/* Input area */}
      <div className="bg-navy-card border-t border-court-border px-3 py-2.5">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Usher..."
            rows={1}
            maxLength={500}
            className="flex-1 bg-transparent text-court-sm text-court-text placeholder:text-court-text-ter resize-none focus:outline-none leading-snug py-1"
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
