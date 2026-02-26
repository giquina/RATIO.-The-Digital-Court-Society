"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Bug, Lightbulb, MessageCircle, Paperclip, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { courtToast } from "@/lib/utils/toast";
import { useDemoMutation } from "@/hooks/useDemoSafe";
import { anyApi } from "convex/server";

type Category = "bug" | "feature" | "general";

const CATEGORIES: { key: Category; label: string; icon: typeof Bug; placeholder: string }[] = [
  {
    key: "bug",
    label: "Bug Report",
    icon: Bug,
    placeholder: "Describe the issue you encountered. What did you expect to happen?",
  },
  {
    key: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    placeholder: "Describe the feature you'd like to see. How would it help you?",
  },
  {
    key: "general",
    label: "General",
    icon: MessageCircle,
    placeholder: "Share your thoughts, suggestions, or any other feedback.",
  },
];

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category>("bug");
  const [description, setDescription] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitFeedback = useDemoMutation(anyApi.appFeedback.submit);
  const generateUploadUrl = useDemoMutation(anyApi.appFeedback.generateUploadUrl);

  const handleOpen = () => {
    setIsOpen(true);
    setCategory("bug");
    setDescription("");
    setScreenshotFile(null);
    setIsSuccess(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setDescription("");
    setScreenshotFile(null);
    setIsSuccess(false);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    // Demo mode
    if (!submitFeedback) {
      courtToast.info("Feedback unavailable in demo mode.");
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotStorageId: string | undefined;

      // Upload screenshot if attached
      if (screenshotFile && generateUploadUrl) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": screenshotFile.type },
          body: screenshotFile,
        });
        if (result.ok) {
          const { storageId } = await result.json();
          screenshotStorageId = storageId;
        }
      }

      await submitFeedback({
        category,
        description: description.trim(),
        screenshotStorageId,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      });

      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      courtToast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.key === category)!;

  return (
    <>
      {/* Floating trigger button — above TheClerk */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-[7.5rem] right-4 md:bottom-[4.5rem] md:right-6 z-[69] h-10 w-10 rounded-full bg-navy-card border border-court-border hover:border-gold/30 flex items-center justify-center transition-colors duration-200 shadow-lg"
          aria-label="Send feedback"
        >
          <MessageSquarePlus size={16} className="text-court-text-sec" />
        </button>
      )}

      {/* Modal overlay + panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 inset-x-4 mx-auto md:inset-x-auto md:right-6 md:bottom-6 md:w-[380px] md:mx-0 z-[80] max-w-[400px] bg-navy-card border border-court-border rounded-court shadow-2xl overflow-hidden"
            >
              {/* Success state */}
              {isSuccess ? (
                <div className="p-8 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3"
                  >
                    <Check size={24} className="text-green-400" />
                  </motion.div>
                  <p className="font-serif text-lg font-bold text-court-text">Feedback Received</p>
                  <p className="text-court-sm text-court-text-sec mt-1">Thank you for helping improve RATIO.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-court-border-light">
                    <h3 className="font-serif text-court-base font-bold text-court-text">Send Feedback</h3>
                    <button onClick={handleClose} className="text-court-text-ter hover:text-court-text transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3">
                    {/* Category pills */}
                    <div className="flex gap-2 mb-3">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.key}
                            onClick={() => setCategory(cat.key)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-court-xs font-medium transition-colors border",
                              category === cat.key
                                ? "bg-gold/10 border-gold/30 text-gold"
                                : "bg-navy border-court-border text-court-text-sec hover:border-white/10"
                            )}
                          >
                            <Icon size={12} />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Description */}
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={selectedCategory.placeholder}
                      rows={4}
                      className="w-full bg-navy border border-court-border rounded-lg px-3 py-2.5 text-court-sm text-court-text placeholder:text-court-text-ter resize-none outline-none focus:border-gold/30 transition-colors"
                    />

                    {/* Screenshot attachment */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-court-text transition-colors"
                        >
                          <Paperclip size={12} />
                          {screenshotFile ? screenshotFile.name : "Attach screenshot"}
                        </button>
                        {screenshotFile && (
                          <button
                            onClick={() => setScreenshotFile(null)}
                            className="text-court-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setScreenshotFile(file);
                          }}
                        />
                      </div>
                      <span className="text-court-xs text-court-text-ter">
                        {description.length > 0 ? `${description.length} chars` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-court-border-light">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-court-sm text-court-text-sec hover:text-court-text transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!description.trim() || isSubmitting}
                      className={cn(
                        "px-5 py-2 rounded-xl text-court-sm font-bold transition-colors",
                        !description.trim() || isSubmitting
                          ? "bg-gold/30 text-navy/50 cursor-not-allowed"
                          : "bg-gold text-navy hover:bg-gold/90"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Send Feedback"
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
