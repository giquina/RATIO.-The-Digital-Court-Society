"use client";

import { motion } from "framer-motion";
import {
  Video,
  Users,
  Timer,
  Mic,
  MonitorPlay,
  Shield,
} from "lucide-react";

export function VideoMootingShowcase() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <div className="bg-navy-card border border-court-border-light rounded-court p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Description */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Video size={20} className="text-gold" />
              <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                LIVE VIDEO
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-4">
              Live Video Mooting
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Argue your case face-to-face in a virtual courtroom. Join a
              pre-session lobby, enter through a formal courtroom entrance,
              and present your submissions live with timed speaking slots
              and real-time role allocation.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-6">
              Built for how mooting actually works: judges preside,
              leading and junior counsel take turns, clerks manage
              procedure. After each session, rate your opponent and
              receive AI-generated feedback on your performance.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Users, label: "Multi-participant rooms" },
                { Icon: Timer, label: "Timed speaking slots" },
                { Icon: Mic, label: "Role-based audio" },
                { Icon: Shield, label: "Post-session AI feedback" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-court-xs text-court-text-ter bg-white/[0.03] border border-court-border-light rounded-full px-3 py-1.5"
                >
                  <item.Icon size={12} className="text-gold" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Mock courtroom UI */}
          <div className="flex-1">
            <div className="bg-navy border border-court-border rounded-court p-4">
              {/* Courtroom header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-court-xs text-green-500 font-semibold">
                    LIVE SESSION
                  </span>
                </div>
                <span className="text-court-xs text-court-text-ter">
                  14:22 / 15:30
                </span>
              </div>

              {/* Mock video grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Judge - large */}
                <div className="col-span-2 bg-navy-mid border border-court-border-light rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
                    <MonitorPlay size={16} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-court-xs font-bold text-court-text truncate">
                      The Hon. Justice Patel
                    </p>
                    <p className="text-court-xs text-court-text-ter">
                      Presiding Judge
                    </p>
                  </div>
                  <Mic size={14} className="text-green-500 shrink-0" />
                </div>

                {/* Appellant */}
                <div className="bg-navy-mid border border-gold/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B2D3E] flex items-center justify-center text-court-xs font-bold text-white/80 font-serif shrink-0">
                      AG
                    </div>
                    <div className="min-w-0">
                      <p className="text-court-xs font-bold text-court-text truncate">
                        Ali G.
                      </p>
                      <p className="text-court-xs text-gold truncate">
                        Appellant
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic size={10} className="text-green-500" />
                    <div className="flex-1 h-1 bg-navy rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gold rounded-full" />
                    </div>
                    <span className="text-court-xs text-court-text-ter">
                      11:22
                    </span>
                  </div>
                </div>

                {/* Respondent */}
                <div className="bg-navy-mid border border-court-border-light rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#2E5090] flex items-center justify-center text-court-xs font-bold text-white/80 font-serif shrink-0">
                      PS
                    </div>
                    <div className="min-w-0">
                      <p className="text-court-xs font-bold text-court-text truncate">
                        Priya S.
                      </p>
                      <p className="text-court-xs text-court-text-ter truncate">
                        Respondent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic size={10} className="text-court-text-ter" />
                    <div className="flex-1 h-1 bg-navy rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-court-text-ter/30 rounded-full" />
                    </div>
                    <span className="text-court-xs text-court-text-ter">
                      15:00
                    </span>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="bg-gold-dim border border-gold/20 rounded-lg px-3 py-2 flex items-center gap-2">
                <Timer size={12} className="text-gold" />
                <span className="text-court-xs text-gold font-semibold">
                  Appellant submissions in progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
