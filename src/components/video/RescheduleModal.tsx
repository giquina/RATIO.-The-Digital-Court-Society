"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Button } from "@/components/ui";

interface RescheduleModalProps {
  sessionTitle: string;
  currentDate: string;
  currentTime: string;
  onReschedule: (newDate: string, newStart: string, newEnd: string) => void;
  onCancel: () => void;
}

export function RescheduleModal({
  sessionTitle,
  currentDate,
  currentTime,
  onReschedule,
  onCancel,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("14:00");
  const [newEnd, setNewEnd] = useState("15:30");
  const [reason, setReason] = useState("");

  const inputClass = "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-[13px] text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";

  return (
    <motion.div
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-lg bg-navy-mid rounded-t-3xl border-t border-court-border p-5 pb-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5" />

        <h2 className="font-serif text-lg font-bold text-court-text mb-1">Reschedule Session</h2>
        <p className="text-xs text-court-text-sec mb-4">{sessionTitle}</p>

        <p className="text-[10px] text-court-text-ter mb-4">
          Currently: {currentDate} &middot; {currentTime}
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="text-[10px] text-court-text-ter uppercase tracking-widest mb-1.5 block">New Date</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-court-text-ter uppercase tracking-widest mb-1.5 block">Start</label>
              <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] text-court-text-ter uppercase tracking-widest mb-1.5 block">End</label>
              <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-court-text-ter uppercase tracking-widest mb-1.5 block">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let your opponent know why..."
              rows={2}
              className={inputClass + " resize-none"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button fullWidth disabled={!newDate} onClick={() => onReschedule(newDate, newStart, newEnd)}>
            Request Reschedule
          </Button>
          <Button fullWidth variant="ghost" onClick={onCancel}>
            Keep Original Time
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
