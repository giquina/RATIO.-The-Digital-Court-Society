"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUsherStore } from "@/stores/usherStore";
import { useDemoMutation } from "@/hooks/useDemoSafe";
import { anyApi } from "convex/server";
import { matchFAQ } from "@/lib/visitor-chat/faq-data";
import { playUsherChime } from "@/lib/visitor-chat/usher-sound";
import { UsherBubble } from "./UsherBubble";
import { UsherPanel } from "./UsherPanel";

const GREETING_DELAY = 800;
const TYPING_MIN = 600;
const TYPING_MAX = 1200;

/** Page-aware greeting messages */
function getGreeting(path: string): { text: string; quickReplies: string[] } {
  if (path.includes("pricing")) {
    return {
      text: "Good day. I see you're reviewing our plans. May I help you find the right one?",
      quickReplies: ["Compare plans", "Is it free?", "Student discount?"],
    };
  }
  if (path.includes("ambassador")) {
    return {
      text: "Welcome. Interested in the Ambassador Programme? I can answer any questions.",
      quickReplies: ["How do I apply?", "What are the benefits?", "Who can join?"],
    };
  }
  if (path.includes("feature") || path.includes("about")) {
    return {
      text: "Good day. I'm The Usher — happy to explain any of RATIO's features.",
      quickReplies: ["What is RATIO?", "How does mooting work?", "AI Judge?"],
    };
  }
  return {
    text: "Good day. I'm The Usher, the Court's digital attendant. How may I assist you?",
    quickReplies: ["What is RATIO?", "Is it free?", "How do I sign up?"],
  };
}

/** Static fallback when AI route is unavailable */
const FALLBACK_RESPONSES = [
  "I'm afraid that's beyond my brief at the moment. Try rephrasing, or I can connect you with the team.",
  "That's a good question, though I don't have a specific answer. Would you like to leave your email so our team can follow up?",
  "I'm not sure I have the answer to that. You might find what you need on our FAQ page, or I can take your email for a follow-up.",
];

/** Call the AI fallback API route */
async function fetchAIResponse(
  message: string,
  pageUrl: string,
  sessionId: string,
): Promise<string | null> {
  try {
    const res = await fetch("/api/visitor-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, pageUrl, sessionId }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.content || null;
  } catch {
    return null;
  }
}

export function UsherChat() {
  const {
    sessionId,
    isOpen,
    hasGreeted,
    lastPageUrl,
    open,
    close,
    addMessage,
    setGreeted,
    setEmail,
    setPageUrl,
  } = useUsherStore();

  // Convex mutations — null in demo mode
  const saveMessage = useDemoMutation(anyApi.visitorChat.saveMessage);
  const captureEmail = useDemoMutation(anyApi.visitorChat.captureEmail);

  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const fallbackCount = useRef(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track page URL for context-aware responses
  useEffect(() => {
    setPageUrl(window.location.pathname);
  }, [setPageUrl]);

  // Clear unread when panel opens
  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  // Cleanup typing timer
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  /** Persist a message to Convex (fire-and-forget) */
  const persistMessage = useCallback(
    (role: string, content: string, type: string, source?: string) => {
      if (!saveMessage) return;
      saveMessage({
        sessionId,
        role,
        content,
        type,
        source,
        pageUrl: lastPageUrl || window.location.pathname,
      }).catch(() => {
        // Silent fail — local state is the source of truth
      });
    },
    [saveMessage, sessionId, lastPageUrl],
  );

  /** Simulate typing then deliver a usher message */
  const sendUsherMessage = useCallback(
    (
      content: string,
      opts?: {
        type?: "text" | "greeting";
        source?: "faq" | "ai" | "fallback" | "system";
        delay?: number;
        onDelivered?: () => void;
      },
    ) => {
      const delay = opts?.delay ?? TYPING_MIN + Math.random() * (TYPING_MAX - TYPING_MIN);
      setIsTyping(true);

      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
        const type = opts?.type ?? "text";
        const source = opts?.source ?? "system";
        addMessage({ role: "usher", content, type, source });
        persistMessage("usher", content, type, source);
        playUsherChime();
        if (!isOpen) setHasUnread(true);
        opts?.onDelivered?.();
      }, delay);
    },
    [addMessage, persistMessage, isOpen],
  );

  /** Send greeting on first open */
  const handleOpen = useCallback(() => {
    open();
    if (!hasGreeted) {
      setGreeted();
      const { text, quickReplies: replies } = getGreeting(window.location.pathname);
      sendUsherMessage(text, {
        type: "greeting",
        source: "system",
        delay: GREETING_DELAY,
        onDelivered: () => setQuickReplies(replies),
      });
    }
  }, [open, hasGreeted, setGreeted, sendUsherMessage]);

  /** Handle visitor sending a message */
  const handleSend = useCallback(
    async (text: string) => {
      // Add visitor message
      addMessage({ role: "visitor", content: text, type: "text" });
      persistMessage("visitor", text, "text");
      setQuickReplies([]);
      setShowEmailCapture(false);

      // Try FAQ match first
      const faqMatch = matchFAQ(text, window.location.pathname);

      if (faqMatch) {
        fallbackCount.current = 0;
        sendUsherMessage(faqMatch.answer, {
          source: "faq",
          onDelivered: () => {
            setQuickReplies(["Tell me more", "How do I sign up?", "What else?"]);
          },
        });
        return;
      }

      // No FAQ match — try AI fallback
      setIsTyping(true);
      const aiResponse = await fetchAIResponse(
        text,
        window.location.pathname,
        sessionId,
      );

      if (aiResponse) {
        fallbackCount.current = 0;
        setIsTyping(false);
        addMessage({ role: "usher", content: aiResponse, type: "text", source: "ai" });
        persistMessage("usher", aiResponse, "text", "ai");
        playUsherChime();
        if (!isOpen) setHasUnread(true);
        return;
      }

      // AI failed — use static fallback
      setIsTyping(false);
      const idx = fallbackCount.current % FALLBACK_RESPONSES.length;
      fallbackCount.current += 1;

      sendUsherMessage(FALLBACK_RESPONSES[idx], {
        source: "fallback",
        onDelivered: () => {
          if (fallbackCount.current >= 2) {
            setShowEmailCapture(true);
          }
        },
      });
    },
    [addMessage, persistMessage, sendUsherMessage, sessionId, isOpen],
  );

  /** Handle quick reply selection */
  const handleQuickReply = useCallback(
    (option: string) => {
      handleSend(option);
    },
    [handleSend],
  );

  /** Handle email submission */
  const handleEmailSubmit = useCallback(
    (email: string) => {
      setEmail(email);
      setShowEmailCapture(false);
      fallbackCount.current = 0;

      // Persist email to Convex
      if (captureEmail) {
        captureEmail({ sessionId, email }).catch(() => {
          // Silent fail
        });
      }
    },
    [setEmail, captureEmail, sessionId],
  );

  return (
    <>
      {/* Chat panel — positioned above bubble */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 animate-scale-in">
          <UsherPanel
            isTyping={isTyping}
            quickReplies={quickReplies}
            showEmailCapture={showEmailCapture}
            onSend={handleSend}
            onQuickReply={handleQuickReply}
            onEmailSubmit={handleEmailSubmit}
            onClose={close}
          />
        </div>
      )}

      {/* Floating bubble trigger */}
      <div className="fixed bottom-6 right-4 z-50">
        <UsherBubble
          hasUnread={hasUnread}
          onClick={isOpen ? close : handleOpen}
        />
      </div>
    </>
  );
}
