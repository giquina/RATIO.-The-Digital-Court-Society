/**
 * POST /api/portfolio/export — Generate a branded PDF of the user's advocacy portfolio.
 *
 * Accepts portfolio data as JSON and returns a downloadable PDF.
 * Uses pdf-lib (pure JS, no native deps) so it works in Node.js runtime.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime (pdf-lib needs it)
export const runtime = "nodejs";

// ── Types ──

interface PortfolioSession {
  date: string;
  title: string;
  role: string;
  score: number;
  module: string;
  mode: string;
}

interface PortfolioData {
  fullName: string;
  userType: "student" | "professional";
  university?: string;
  yearOfStudy?: string;
  professionalRole?: string;
  firmOrChambers?: string;
  practiceAreas?: string[];
  totalSessions: number;
  averageScore: number;
  bestModule: string;
  streakDays: number;
  sessions: PortfolioSession[];
  cpdHours?: number;
  cpdTarget?: number;
  generatedAt: string;
}

// ── Colours (RATIO brand) ──

const NAVY = rgb(0.07, 0.07, 0.13); // #121122
const GOLD = rgb(0.788, 0.659, 0.298); // #C9A84C
const WHITE = rgb(1, 1, 1);
const LIGHT_GREY = rgb(0.65, 0.65, 0.7);
const DARK_BG = rgb(0.09, 0.09, 0.15);
const GREEN = rgb(0.35, 0.78, 0.45);
const RED = rgb(0.85, 0.3, 0.3);

function scoreColor(score: number) {
  if (score >= 70) return GREEN;
  if (score >= 50) return GOLD;
  return RED;
}

// ── PDF Builder ──

async function buildPortfolioPDF(data: PortfolioData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  const PAGE_WIDTH = 595.28; // A4
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  // ── Helper: add a new page with navy background ──
  function addPage() {
    const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    // Navy background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      color: NAVY,
    });
    return page;
  }

  // ── Helper: draw horizontal line ──
  function drawLine(page: ReturnType<typeof addPage>, y: number, width?: number) {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + (width ?? CONTENT_WIDTH), y },
      color: rgb(0.25, 0.25, 0.35),
      thickness: 0.5,
    });
  }

  // ── PAGE 1: Header + Summary ──

  let page = addPage();
  let y = PAGE_HEIGHT - MARGIN;

  // ── Gold accent bar at top ──
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 4,
    width: PAGE_WIDTH,
    height: 4,
    color: GOLD,
  });

  // ── RATIO. branding ──
  y -= 10;
  page.drawText("RATIO.", {
    x: MARGIN,
    y,
    size: 28,
    font: timesRomanBold,
    color: GOLD,
  });

  // Tagline
  y -= 18;
  page.drawText("The Digital Court Society", {
    x: MARGIN,
    y,
    size: 10,
    font: helvetica,
    color: LIGHT_GREY,
  });

  // ── Title ──
  y -= 40;
  const titleText = data.userType === "professional"
    ? "Professional Advocacy Portfolio"
    : "Advocacy Portfolio";
  page.drawText(titleText, {
    x: MARGIN,
    y,
    size: 22,
    font: timesRomanBold,
    color: WHITE,
  });

  // ── User Info ──
  y -= 30;
  page.drawText(data.fullName, {
    x: MARGIN,
    y,
    size: 16,
    font: helveticaBold,
    color: WHITE,
  });

  y -= 18;
  if (data.userType === "professional") {
    const roleText = [
      data.professionalRole,
      data.firmOrChambers,
    ].filter(Boolean).join(" · ");
    page.drawText(roleText || "Legal Professional", {
      x: MARGIN,
      y,
      size: 11,
      font: helvetica,
      color: LIGHT_GREY,
    });

    if (data.practiceAreas?.length) {
      y -= 16;
      page.drawText(`Practice Areas: ${data.practiceAreas.join(", ")}`, {
        x: MARGIN,
        y,
        size: 9,
        font: helvetica,
        color: GOLD,
      });
    }
  } else {
    const uniText = [data.university, data.yearOfStudy].filter(Boolean).join(" · ");
    page.drawText(uniText || "Law Student", {
      x: MARGIN,
      y,
      size: 11,
      font: helvetica,
      color: LIGHT_GREY,
    });
  }

  // ── Divider ──
  y -= 20;
  drawLine(page, y);

  // ── Summary Stats (4-column grid) ──
  y -= 35;
  page.drawText("SUMMARY", {
    x: MARGIN,
    y: y + 5,
    size: 9,
    font: helveticaBold,
    color: GOLD,
  });

  y -= 10;
  const stats = [
    { label: "Total Sessions", value: String(data.totalSessions) },
    { label: "Average Score", value: `${data.averageScore}%` },
    { label: "Best Module", value: data.bestModule || "—" },
    { label: "Current Streak", value: `${data.streakDays} days` },
  ];

  if (data.userType === "professional" && data.cpdHours !== undefined) {
    stats.push({
      label: "CPD Hours",
      value: `${data.cpdHours} / ${data.cpdTarget ?? 12}h`,
    });
  }

  const colWidth = CONTENT_WIDTH / stats.length;
  stats.forEach((stat, i) => {
    const x = MARGIN + i * colWidth;

    // Value
    page.drawText(stat.value, {
      x,
      y,
      size: 18,
      font: timesRomanBold,
      color: WHITE,
    });

    // Label
    page.drawText(stat.label.toUpperCase(), {
      x,
      y: y - 16,
      size: 7,
      font: helveticaBold,
      color: LIGHT_GREY,
    });
  });

  // ── Divider ──
  y -= 45;
  drawLine(page, y);

  // ── Session History Header ──
  y -= 30;
  page.drawText("SESSION HISTORY", {
    x: MARGIN,
    y,
    size: 9,
    font: helveticaBold,
    color: GOLD,
  });

  // ── Table Header ──
  y -= 22;
  const COL = {
    date: MARGIN,
    title: MARGIN + 70,
    module: MARGIN + 310,
    mode: MARGIN + 400,
    score: MARGIN + 465,
  };

  // Header row background
  page.drawRectangle({
    x: MARGIN - 5,
    y: y - 4,
    width: CONTENT_WIDTH + 10,
    height: 18,
    color: DARK_BG,
  });

  const headerFont = { size: 7, font: helveticaBold, color: LIGHT_GREY };
  page.drawText("DATE", { x: COL.date, y, ...headerFont });
  page.drawText("CASE / TITLE", { x: COL.title, y, ...headerFont });
  page.drawText("MODULE", { x: COL.module, y, ...headerFont });
  page.drawText("MODE", { x: COL.mode, y, ...headerFont });
  page.drawText("SCORE", { x: COL.score, y, ...headerFont });

  // ── Session Rows ──
  y -= 22;
  const ROW_HEIGHT = 22;

  for (const session of data.sessions) {
    // New page if we run out of room
    if (y < MARGIN + 60) {
      page = addPage();
      y = PAGE_HEIGHT - MARGIN - 20;

      // Repeat header
      page.drawRectangle({
        x: MARGIN - 5,
        y: y - 4,
        width: CONTENT_WIDTH + 10,
        height: 18,
        color: DARK_BG,
      });
      page.drawText("DATE", { x: COL.date, y, ...headerFont });
      page.drawText("CASE / TITLE", { x: COL.title, y, ...headerFont });
      page.drawText("MODULE", { x: COL.module, y, ...headerFont });
      page.drawText("MODE", { x: COL.mode, y, ...headerFont });
      page.drawText("SCORE", { x: COL.score, y, ...headerFont });
      y -= ROW_HEIGHT;
    }

    // Truncate long titles
    const maxTitleLen = 42;
    const titleDisplay = session.title.length > maxTitleLen
      ? session.title.substring(0, maxTitleLen - 1) + "…"
      : session.title;

    page.drawText(session.date, { x: COL.date, y, size: 8, font: helvetica, color: LIGHT_GREY });
    page.drawText(titleDisplay, { x: COL.title, y, size: 8, font: helvetica, color: WHITE });
    page.drawText(session.module, { x: COL.module, y, size: 8, font: helvetica, color: LIGHT_GREY });
    page.drawText(session.mode, { x: COL.mode, y, size: 8, font: helvetica, color: LIGHT_GREY });

    // Score with colour coding
    page.drawText(`${session.score}%`, {
      x: COL.score,
      y,
      size: 9,
      font: helveticaBold,
      color: scoreColor(session.score),
    });

    // Subtle row separator
    drawLine(page, y - 6);
    y -= ROW_HEIGHT;
  }

  // ── Footer ──
  y -= 30;
  if (y < MARGIN + 40) {
    page = addPage();
    y = PAGE_HEIGHT - MARGIN - 20;
  }

  drawLine(page, y);
  y -= 18;

  page.drawText(`Generated by RATIO. on ${data.generatedAt}`, {
    x: MARGIN,
    y,
    size: 7,
    font: helvetica,
    color: LIGHT_GREY,
  });

  page.drawText("ratio.law", {
    x: PAGE_WIDTH - MARGIN - 40,
    y,
    size: 7,
    font: helveticaBold,
    color: GOLD,
  });

  // ── Metadata ──
  doc.setTitle(`${data.fullName} — Advocacy Portfolio`);
  doc.setAuthor("RATIO. — The Digital Court Society");
  doc.setSubject("Advocacy Portfolio Export");
  doc.setCreator("RATIO.");

  return doc.save();
}

// ── POST handler ──

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data: PortfolioData = await request.json();

    if (!data.fullName || !data.sessions) {
      return NextResponse.json(
        { error: "Missing required portfolio data" },
        { status: 400 },
      );
    }

    const pdfBytes = await buildPortfolioPDF(data);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.fullName.replace(/[^a-zA-Z0-9 ]/g, "")}_Portfolio_RATIO.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error("[PORTFOLIO_PDF] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
