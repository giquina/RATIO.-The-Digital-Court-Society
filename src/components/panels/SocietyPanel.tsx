"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Globe } from "lucide-react";

// Network graph: dots (advocates) connected by lines, slowly drifting
// Shows:
// 1. Network of 8 dots with connecting lines
// 2. Dots gently drift in circular motion
// 3. Lines appear with fade-in
// 4. "The Society" heading
// 5. Growth signals

export default function SocietyPanel() {
  // Network nodes positioned in a loose circular pattern
  const nodes = [
    { cx: 50, cy: 30, r: 3, delay: 0.2 },
    { cx: 75, cy: 40, r: 2.5, delay: 0.4 },
    { cx: 85, cy: 60, r: 2, delay: 0.6 },
    { cx: 70, cy: 78, r: 2.5, delay: 0.8 },
    { cx: 45, cy: 80, r: 3, delay: 1.0 },
    { cx: 25, cy: 65, r: 2, delay: 1.2 },
    { cx: 20, cy: 42, r: 2.5, delay: 1.4 },
    { cx: 55, cy: 55, r: 3.5, delay: 0.3 }, // Center node, larger
  ];

  // Connections between nodes
  const connections = [
    [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], // All connect to center
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], // Ring
  ];

  const particles = Array.from({ length: 5 }, (_, i) => ({
    x: 15 + Math.random() * 70,
    delay: i * 0.9,
    duration: 5 + Math.random() * 3,
  }));

  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gold/15"
          initial={{ y: "100%", x: `${p.x}%`, opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 0.5, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Network graph */}
      <svg viewBox="0 0 100 100" className="w-36 h-36 mb-6">
        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={`line-${i}`}
            x1={nodes[from].cx}
            y1={nodes[from].cy}
            x2={nodes[to].cx}
            y2={nodes[to].cy}
            stroke="#C9A84C"
            strokeWidth={0.4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={i === 7 ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.15)"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: node.delay,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          />
        ))}

        {/* Pulse on center node */}
        <motion.circle
          cx={55}
          cy={55}
          r={6}
          fill="none"
          stroke="#C9A84C"
          strokeWidth={0.5}
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Heading */}
      <motion.h3
        className="font-serif text-lg text-court-text/40 mb-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        The Society
      </motion.h3>

      {/* Growth signals */}
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Users size={12} className="text-gold/30" />
        <span className="text-court-xs text-court-text-ter/50">The advocacy community</span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <UserPlus size={12} className="text-gold/25" />
        <span className="text-court-xs text-court-text-ter/40">Follow, commend, connect</span>
      </motion.div>

      {/* Motto */}
      <motion.p
        className="font-serif italic text-court-xs text-gold/20 text-center max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        "A community of advocates, united in purpose"
      </motion.p>

      {/* Bottom accent */}
      <motion.div
        className="absolute bottom-16 w-8 h-[1px] bg-gold/15"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      />
    </div>
  );
}
