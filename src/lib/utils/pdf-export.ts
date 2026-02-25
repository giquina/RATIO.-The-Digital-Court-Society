/**
 * PDF Portfolio Export — Branded, context-aware PDF generation
 *
 * Uses pdf-lib (already installed) to generate professional PDFs client-side.
 * Adapts content based on userType: students get an advocacy portfolio,
 * professionals get that + a CPD compliance section.
 *
 * Brand: navy background header, gold accents, serif headings.
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";

// ── Brand Colors ──

const NAVY = rgb(10 / 255, 14 / 255, 26 / 255);        // #0A0E1A
const NAVY_LIGHT = rgb(22 / 255, 28 / 255, 45 / 255);   // #161C2D
const GOLD = rgb(201 / 255, 168 / 255, 76 / 255);       // #C9A84C
const GOLD_DIM = rgb(201 / 255, 168 / 255, 76 / 255);
const WHITE = rgb(1, 1, 1);
const GREY = rgb(0.55, 0.55, 0.55);
const TEXT = rgb(0.15, 0.15, 0.15);
const LIGHT_BG = rgb(0.97, 0.96, 0.94);                 // warm off-white

// ── Types ──

export interface PDFSession {
  date: string;
  title: string;
  role: string;
  score: number;
  module: string;
  mode: string;
}

export interface PDFProfile {
  fullName: string;
  userType: "student" | "professional";
  // Student fields
  university?: string;
  yearOfStudy?: string;
  // Professional fields
  professionalRole?: string;
  firmOrChambers?: string;
  practiceAreas?: string[];
  // Stats
  totalSessions: number;
  averageScore: number;
  bestModule: string;
  streakDays: number;
  rank?: string;
  chamber?: string;
}

export interface PDFCpdEntry {
  date: string;
  title: string;
  activityType: string;
  durationMinutes: number;
}

export interface PDFCpdSummary {
  year: number;
  totalHours: number;
  entryCount: number;
  targetHours: number;
}

export interface PDFExportData {
  profile: PDFProfile;
  sessions: PDFSession[];
  cpd?: {
    entries: PDFCpdEntry[];
    summary: PDFCpdSummary;
  };
  generatedAt: string;
}

// ── Helpers ──

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

/** Draw a filled rectangle */
function drawRect(
  page: PDFPage,
  x: number, y: number, w: number, h: number,
  color: ReturnType<typeof rgb>,
) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

/** Draw text and return the y position after it */
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb> = TEXT,
): number {
  page.drawText(text, { x, y, size, font, color });
  return y - size - 2;
}

/** Simple word-wrap: returns lines that fit within maxWidth */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(test, size);
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ── Main Export Function ──

export async function generatePortfolioPDF(data: PDFExportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`RATIO Portfolio — ${data.profile.fullName}`);
  doc.setAuthor("RATIO — The Digital Court Society");
  doc.setSubject("Advocacy Portfolio");
  doc.setCreator("RATIO Platform");

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  const W = 595.28; // A4 width
  const H = 841.89; // A4 height
  const MARGIN = 50;
  const CONTENT_W = W - MARGIN * 2;

  // ═══════════════════════════════════════
  // PAGE 1: Cover / Profile
  // ═══════════════════════════════════════

  let page = doc.addPage([W, H]);
  let y = H;

  // ── Navy header band ──
  const headerH = 200;
  drawRect(page, 0, H - headerH, W, headerH, NAVY);

  // Gold accent line
  drawRect(page, 0, H - headerH, W, 3, GOLD);

  // RATIO. logo text
  y = H - 45;
  page.drawText("RATIO", { x: MARGIN, y, size: 28, font: timesBold, color: WHITE });
  const ratioW = timesBold.widthOfTextAtSize("RATIO", 28);
  page.drawText(".", { x: MARGIN + ratioW, y, size: 28, font: timesBold, color: GOLD });

  // Subtitle
  y -= 22;
  page.drawText("The Digital Court Society", { x: MARGIN, y, size: 10, font: helvetica, color: GREY });

  // Profile name
  y -= 50;
  page.drawText(data.profile.fullName, { x: MARGIN, y, size: 24, font: timesBold, color: WHITE });

  // Subtitle line (role/university)
  y -= 22;
  const isPro = data.profile.userType === "professional";
  const subtitleParts: string[] = [];
  if (isPro) {
    if (data.profile.professionalRole) subtitleParts.push(data.profile.professionalRole);
    if (data.profile.firmOrChambers) subtitleParts.push(data.profile.firmOrChambers);
  } else {
    if (data.profile.university) subtitleParts.push(data.profile.university);
    if (data.profile.yearOfStudy) subtitleParts.push(data.profile.yearOfStudy);
  }
  if (data.profile.chamber) subtitleParts.push(`${data.profile.chamber}'s Inn`);
  const subtitle = subtitleParts.join("  ·  ");
  page.drawText(subtitle, { x: MARGIN, y, size: 11, font: helvetica, color: GOLD_DIM });

  // Practice areas for professionals
  if (isPro && data.profile.practiceAreas?.length) {
    y -= 18;
    page.drawText(data.profile.practiceAreas.join("  ·  "), { x: MARGIN, y, size: 9, font: helvetica, color: GREY });
  }

  // ── Stats Row ──
  y = H - headerH - 40;
  const stats = [
    { label: "SESSIONS", value: String(data.profile.totalSessions) },
    { label: "AVG SCORE", value: `${data.profile.averageScore}%` },
    { label: "BEST AREA", value: data.profile.bestModule },
    { label: "STREAK", value: `${data.profile.streakDays}d` },
  ];
  if (data.profile.rank) {
    stats.push({ label: "RANK", value: data.profile.rank });
  }

  const statBoxW = CONTENT_W / stats.length;
  stats.forEach((stat, i) => {
    const sx = MARGIN + i * statBoxW;
    // Light background box
    drawRect(page, sx + 2, y - 42, statBoxW - 4, 50, LIGHT_BG);
    // Value
    page.drawText(stat.value, { x: sx + 12, y: y - 10, size: 18, font: timesBold, color: TEXT });
    // Label
    page.drawText(stat.label, { x: sx + 12, y: y - 30, size: 7, font: helveticaBold, color: GREY });
  });

  // ── Session History Heading ──
  y -= 75;
  drawRect(page, MARGIN, y - 1, CONTENT_W, 1.5, GOLD);
  y -= 20;
  page.drawText("SESSION HISTORY", { x: MARGIN, y, size: 10, font: helveticaBold, color: TEXT });
  y -= 6;

  // ── Session Table ──
  const colX = [MARGIN, MARGIN + 70, MARGIN + 300, MARGIN + 400];
  const colLabels = ["Date", "Case / Topic", "Area", "Score"];

  // Table header
  y -= 16;
  drawRect(page, MARGIN, y - 4, CONTENT_W, 18, NAVY);
  colLabels.forEach((label, i) => {
    page.drawText(label, { x: colX[i] + 6, y: y, size: 8, font: helveticaBold, color: WHITE });
  });
  y -= 20;

  // Table rows
  for (const session of data.sessions) {
    if (y < 80) {
      // New page
      page = doc.addPage([W, H]);
      y = H - 50;
      // Repeat header
      drawRect(page, MARGIN, y - 4, CONTENT_W, 18, NAVY);
      colLabels.forEach((label, i) => {
        page.drawText(label, { x: colX[i] + 6, y: y, size: 8, font: helveticaBold, color: WHITE });
      });
      y -= 20;
    }

    // Alternate row shading
    const rowIdx = data.sessions.indexOf(session);
    if (rowIdx % 2 === 0) {
      drawRect(page, MARGIN, y - 4, CONTENT_W, 16, LIGHT_BG);
    }

    page.drawText(session.date, { x: colX[0] + 6, y, size: 8, font: helvetica, color: TEXT });
    page.drawText(truncate(session.title, 40), { x: colX[1] + 6, y, size: 8, font: helvetica, color: TEXT });
    page.drawText(truncate(session.module, 18), { x: colX[2] + 6, y, size: 8, font: helvetica, color: TEXT });

    // Score with color coding
    const scoreColor = session.score >= 75 ? rgb(0.15, 0.6, 0.3) : session.score >= 60 ? rgb(0.7, 0.55, 0.1) : rgb(0.7, 0.2, 0.2);
    page.drawText(`${session.score}%`, { x: colX[3] + 6, y, size: 9, font: helveticaBold, color: scoreColor });

    y -= 18;
  }

  // ═══════════════════════════════════════
  // CPD PAGE (Professionals only)
  // ═══════════════════════════════════════

  if (isPro && data.cpd) {
    page = doc.addPage([W, H]);
    y = H - 50;

    // Section header
    drawRect(page, MARGIN, y - 1, CONTENT_W, 2, GOLD);
    y -= 22;
    page.drawText("CPD COMPLIANCE REPORT", { x: MARGIN, y, size: 14, font: timesBold, color: TEXT });
    y -= 18;
    page.drawText(`Year: ${data.cpd.summary.year}`, { x: MARGIN, y, size: 10, font: helvetica, color: GREY });
    y -= 30;

    // CPD Summary boxes
    const cpdStats = [
      { label: "TOTAL HOURS", value: `${data.cpd.summary.totalHours}h` },
      { label: "TARGET", value: `${data.cpd.summary.targetHours}h` },
      { label: "ACTIVITIES", value: String(data.cpd.summary.entryCount) },
      { label: "STATUS", value: data.cpd.summary.totalHours >= data.cpd.summary.targetHours ? "MET ✓" : "IN PROGRESS" },
    ];

    const cpdBoxW = CONTENT_W / cpdStats.length;
    cpdStats.forEach((stat, i) => {
      const sx = MARGIN + i * cpdBoxW;
      drawRect(page, sx + 2, y - 42, cpdBoxW - 4, 50, LIGHT_BG);

      const isTarget = stat.label === "STATUS";
      const valColor = isTarget
        ? (data.cpd!.summary.totalHours >= data.cpd!.summary.targetHours ? rgb(0.15, 0.6, 0.3) : rgb(0.7, 0.55, 0.1))
        : TEXT;

      page.drawText(stat.value, { x: sx + 12, y: y - 10, size: 16, font: timesBold, color: valColor });
      page.drawText(stat.label, { x: sx + 12, y: y - 30, size: 7, font: helveticaBold, color: GREY });
    });

    // Progress bar
    y -= 65;
    const progressPct = Math.min(1, data.cpd.summary.totalHours / data.cpd.summary.targetHours);
    drawRect(page, MARGIN, y, CONTENT_W, 8, rgb(0.9, 0.9, 0.88));
    drawRect(page, MARGIN, y, CONTENT_W * progressPct, 8, GOLD);
    y -= 25;

    // CPD Activity Log heading
    drawRect(page, MARGIN, y - 1, CONTENT_W, 1.5, GOLD);
    y -= 18;
    page.drawText("CPD ACTIVITY LOG", { x: MARGIN, y, size: 10, font: helveticaBold, color: TEXT });
    y -= 8;

    // Activity table
    const cpdColX = [MARGIN, MARGIN + 70, MARGIN + 340, MARGIN + 420];
    const cpdHeaders = ["Date", "Activity", "Type", "Hours"];

    y -= 16;
    drawRect(page, MARGIN, y - 4, CONTENT_W, 18, NAVY);
    cpdHeaders.forEach((label, i) => {
      page.drawText(label, { x: cpdColX[i] + 6, y, size: 8, font: helveticaBold, color: WHITE });
    });
    y -= 20;

    const TYPE_LABELS: Record<string, string> = {
      ai_practice: "AI Practice",
      live_moot: "Live Moot",
      research: "Research",
      manual: "Other",
    };

    for (const entry of data.cpd.entries) {
      if (y < 80) {
        page = doc.addPage([W, H]);
        y = H - 50;
        drawRect(page, MARGIN, y - 4, CONTENT_W, 18, NAVY);
        cpdHeaders.forEach((label, i) => {
          page.drawText(label, { x: cpdColX[i] + 6, y, size: 8, font: helveticaBold, color: WHITE });
        });
        y -= 20;
      }

      const rowIdx = data.cpd.entries.indexOf(entry);
      if (rowIdx % 2 === 0) {
        drawRect(page, MARGIN, y - 4, CONTENT_W, 16, LIGHT_BG);
      }

      const hours = Math.round((entry.durationMinutes / 60) * 10) / 10;
      page.drawText(entry.date, { x: cpdColX[0] + 6, y, size: 8, font: helvetica, color: TEXT });
      page.drawText(truncate(entry.title, 48), { x: cpdColX[1] + 6, y, size: 8, font: helvetica, color: TEXT });
      page.drawText(TYPE_LABELS[entry.activityType] || entry.activityType, { x: cpdColX[2] + 6, y, size: 8, font: helvetica, color: TEXT });
      page.drawText(`${hours}h`, { x: cpdColX[3] + 6, y, size: 8, font: helveticaBold, color: TEXT });

      y -= 18;
    }
  }

  // ═══════════════════════════════════════
  // FOOTER on every page
  // ═══════════════════════════════════════

  const pages = doc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];

    // Gold line above footer
    drawRect(p, MARGIN, 38, CONTENT_W, 0.5, GOLD);

    // Left: RATIO.
    p.drawText("RATIO.", { x: MARGIN, y: 24, size: 8, font: timesBold, color: GREY });

    // Center: generated date
    const dateText = `Generated ${data.generatedAt}`;
    const dateW = helvetica.widthOfTextAtSize(dateText, 7);
    p.drawText(dateText, { x: (W - dateW) / 2, y: 24, size: 7, font: helvetica, color: GREY });

    // Right: page number
    const pageText = `${i + 1} / ${totalPages}`;
    const pageW = helvetica.widthOfTextAtSize(pageText, 7);
    p.drawText(pageText, { x: W - MARGIN - pageW, y: 24, size: 7, font: helvetica, color: GREY });
  }

  return doc.save();
}

// ── Download trigger ──

export function downloadPDF(bytes: Uint8Array, filename: string) {
  // Create a fresh Uint8Array to satisfy TypeScript's BlobPart constraint
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
