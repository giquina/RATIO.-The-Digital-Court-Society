"use client";

import { motion } from "framer-motion";

/*
 * SkillsRadar — a 7-axis spider/radar chart for advocacy dimensions.
 *
 * Think of it like a spider web where each strand represents a different
 * advocacy skill. The filled shape shows how strong you are in each area.
 *
 * Props:
 *  - scores: array of 7 numbers (0-100) for each dimension
 *  - size: width/height of the SVG (default 240)
 *  - animate: whether to animate the fill on scroll (default true)
 *  - className: optional wrapper class
 *
 * The 7 dimensions match RATIO's advocacy assessment framework:
 *  1. Legal Knowledge
 *  2. Case Analysis
 *  3. Oral Delivery
 *  4. Procedure
 *  5. Persuasion
 *  6. Judicial Engagement
 *  7. Professional Conduct
 */

const DIMENSIONS = [
  "Legal Knowledge",
  "Case Analysis",
  "Oral Delivery",
  "Procedure",
  "Persuasion",
  "Engagement",
  "Conduct",
];

interface SkillsRadarProps {
  scores?: number[];
  size?: number;
  animate?: boolean;
  className?: string;
}

export function SkillsRadar({
  scores = [78, 65, 82, 70, 88, 60, 74],
  size = 240,
  animate = true,
  className,
}: SkillsRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36; // leave room for labels
  const levels = 4; // concentric rings (25%, 50%, 75%, 100%)
  const angleStep = (Math.PI * 2) / DIMENSIONS.length;
  // Rotate so the first label sits at the top (12 o'clock)
  const startAngle = -Math.PI / 2;

  // Convert a score (0-100) on a given axis to x,y coordinates
  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Build the polygon path from scores
  const dataPoints = scores.map((s, i) => getPoint(i, s));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Build concentric level rings
  const levelRings = Array.from({ length: levels }, (_, lvl) => {
    const pct = ((lvl + 1) / levels) * 100;
    const points = DIMENSIONS.map((_, i) => getPoint(i, pct));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  });

  // Label positions — pushed slightly further out than the outermost ring
  const labelPoints = DIMENSIONS.map((_, i) => {
    const angle = startAngle + i * angleStep;
    const r = radius + 22;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric web rings */}
        {levelRings.map((d, i) => (
          <path
            key={`ring-${i}`}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines from centre to each vertex */}
        {DIMENSIONS.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Filled data polygon */}
        {animate ? (
          <motion.path
            d={dataPath}
            fill="rgba(201,168,76,0.15)"
            stroke="#C9A84C"
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ) : (
          <path
            d={dataPath}
            fill="rgba(201,168,76,0.15)"
            stroke="#C9A84C"
            strokeWidth={1.5}
          />
        )}

        {/* Data points (dots on each vertex) */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#C9A84C"
            initial={animate ? { opacity: 0 } : undefined}
            whileInView={animate ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
          />
        ))}

        {/* Dimension labels */}
        {DIMENSIONS.map((label, i) => (
          <text
            key={`label-${i}`}
            x={labelPoints[i].x}
            y={labelPoints[i].y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-court-text-ter"
            style={{ fontSize: "9px", fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
