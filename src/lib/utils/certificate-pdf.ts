/**
 * Certificate PDF Generator
 *
 * Generates a professional advocacy certificate using pdf-lib.
 * Includes: RATIO branding, recipient details, skills radar breakdown,
 * digital signature, QR code, and verification URL.
 *
 * Uses pdf-lib which is already installed in the project.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ── Colour palette (RATIO brand) ──
const NAVY = rgb(11 / 255, 17 / 255, 32 / 255); // #0B1120
const GOLD = rgb(201 / 255, 168 / 255, 76 / 255); // #C9A84C
const WHITE = rgb(1, 1, 1);
const LIGHT_GRAY = rgb(0.7, 0.7, 0.7);
const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
const DARK_GRAY = rgb(0.25, 0.25, 0.25);
const GREEN = rgb(34 / 255, 197 / 255, 94 / 255);

const DIMENSION_LABELS: Record<string, string> = {
  argumentStructure: "Argument Structure",
  useOfAuthorities: "Use of Authorities",
  oralDelivery: "Oral Delivery",
  judicialHandling: "Judicial Handling",
  courtManner: "Court Manner",
  persuasiveness: "Persuasiveness",
  timeManagement: "Time Management",
};

export interface CertificateData {
  recipientName: string;
  university?: string;
  levelName: string;
  levelShortName: string;
  certificateNumber: string;
  verificationCode: string;
  issuedAt: string;
  overallAverage: number;
  totalSessions: number;
  skillsSnapshot: Record<string, number>;
  areasOfLaw: string[];
  strengths: string[];
  improvements: string[];
}

/**
 * Generate a certificate PDF as a Uint8Array (can be downloaded or displayed).
 *
 * The certificate is A4 landscape (841.89 x 595.28 pts) with:
 * - Dark navy background
 * - Gold borders and accents
 * - RATIO branding header
 * - Recipient name and level
 * - Skills breakdown bars
 * - Digital signature
 * - Verification code and URL
 */
export async function generateCertificatePDF(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // A4 landscape
  const W = 841.89;
  const H = 595.28;
  const page = doc.addPage([W, H]);

  const fontRegular = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const fontMono = await doc.embedFont(StandardFonts.Courier);

  // ── Background ──
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: NAVY });

  // ── Double border ──
  const borderOuter = 25;
  const borderInner = 35;
  // Outer gold border
  page.drawRectangle({
    x: borderOuter, y: borderOuter,
    width: W - borderOuter * 2, height: H - borderOuter * 2,
    borderColor: GOLD, borderWidth: 1.5,
  });
  // Inner gold border
  page.drawRectangle({
    x: borderInner, y: borderInner,
    width: W - borderInner * 2, height: H - borderInner * 2,
    borderColor: rgb(201 / 255, 168 / 255, 76 / 255), borderWidth: 0.5,
  });

  // ── Corner accents (small L-shaped decorations) ──
  const cornerLen = 30;
  const cornerInset = 42;
  const corners = [
    { x: cornerInset, y: H - cornerInset }, // top-left
    { x: W - cornerInset, y: H - cornerInset }, // top-right
    { x: cornerInset, y: cornerInset }, // bottom-left
    { x: W - cornerInset, y: cornerInset }, // bottom-right
  ];
  for (const c of corners) {
    const dx = c.x < W / 2 ? 1 : -1;
    const dy = c.y < H / 2 ? 1 : -1;
    page.drawLine({
      start: { x: c.x, y: c.y },
      end: { x: c.x + dx * cornerLen, y: c.y },
      color: GOLD, thickness: 1.5,
    });
    page.drawLine({
      start: { x: c.x, y: c.y },
      end: { x: c.x, y: c.y + dy * cornerLen },
      color: GOLD, thickness: 1.5,
    });
  }

  let y = H - 70;

  // ── RATIO logo text ──
  const logoText = "RATIO.";
  const logoSize = 22;
  const logoWidth = fontBold.widthOfTextAtSize("RATIO", logoSize) + fontBold.widthOfTextAtSize(".", logoSize);
  const logoX = (W - logoWidth) / 2;
  page.drawText("RATIO", { x: logoX, y, font: fontBold, size: logoSize, color: WHITE });
  page.drawText(".", { x: logoX + fontBold.widthOfTextAtSize("RATIO", logoSize), y, font: fontBold, size: logoSize, color: GOLD });

  y -= 16;
  const subtext = "THE DIGITAL COURT SOCIETY";
  const subWidth = fontRegular.widthOfTextAtSize(subtext, 7);
  page.drawText(subtext, { x: (W - subWidth) / 2, y, font: fontRegular, size: 7, color: GOLD });

  // ── Gold divider ──
  y -= 18;
  page.drawLine({
    start: { x: W / 2 - 120, y },
    end: { x: W / 2 + 120, y },
    color: GOLD, thickness: 0.75,
  });

  // ── Certificate title ──
  y -= 28;
  const certTitle = data.levelName.toUpperCase();
  const titleSize = 14;
  const titleWidth = fontBold.widthOfTextAtSize(certTitle, titleSize);
  page.drawText(certTitle, { x: (W - titleWidth) / 2, y, font: fontBold, size: titleSize, color: GOLD });

  // ── "This is to certify that" ──
  y -= 30;
  const certifyText = "This is to certify that";
  const certifyWidth = fontItalic.widthOfTextAtSize(certifyText, 11);
  page.drawText(certifyText, { x: (W - certifyWidth) / 2, y, font: fontItalic, size: 11, color: LIGHT_GRAY });

  // ── Recipient name ──
  y -= 35;
  const nameSize = 28;
  const nameWidth = fontBold.widthOfTextAtSize(data.recipientName, nameSize);
  page.drawText(data.recipientName, { x: (W - nameWidth) / 2, y, font: fontBold, size: nameSize, color: WHITE });

  // ── University ──
  if (data.university) {
    y -= 22;
    const uniWidth = fontRegular.widthOfTextAtSize(data.university, 10);
    page.drawText(data.university, { x: (W - uniWidth) / 2, y, font: fontRegular, size: 10, color: LIGHT_GRAY });
  }

  // ── Achievement text ──
  y -= 28;
  const achieveText = `has demonstrated ${data.levelShortName.toLowerCase()}-level competence in oral advocacy`;
  const achieveWidth = fontRegular.widthOfTextAtSize(achieveText, 10);
  page.drawText(achieveText, { x: (W - achieveWidth) / 2, y, font: fontRegular, size: 10, color: LIGHT_GRAY });

  y -= 16;
  const achieve2 = `assessed across ${data.totalSessions} AI-evaluated sessions with an overall average of ${data.overallAverage}/100`;
  const achieve2Width = fontRegular.widthOfTextAtSize(achieve2, 9);
  page.drawText(achieve2, { x: (W - achieve2Width) / 2, y, font: fontRegular, size: 9, color: MEDIUM_GRAY });

  // ── Two-column layout: Skills (left) + Details (right) ──
  y -= 35;
  const colLeft = 100;
  const colRight = W / 2 + 40;

  // Left column: Skills bars
  page.drawText("SKILLS ASSESSMENT", { x: colLeft, y, font: fontBold, size: 8, color: GOLD });
  let barY = y - 18;
  const barWidth = 200;
  const barHeight = 7;

  for (const [key, score] of Object.entries(data.skillsSnapshot)) {
    const label = DIMENSION_LABELS[key] ?? key;
    page.drawText(label, { x: colLeft, y: barY + 1, font: fontRegular, size: 7, color: LIGHT_GRAY });

    // Background bar
    page.drawRectangle({
      x: colLeft + 110, y: barY - 1,
      width: barWidth, height: barHeight,
      color: rgb(0.94, 0.94, 0.94),
    });
    // Score bar
    page.drawRectangle({
      x: colLeft + 110, y: barY - 1,
      width: (score / 100) * barWidth, height: barHeight,
      color: GOLD,
    });
    // Score text
    page.drawText(String(score), {
      x: colLeft + 110 + barWidth + 8, y: barY,
      font: fontBold, size: 7, color: WHITE,
    });

    barY -= 16;
  }

  // Right column: Details
  page.drawText("DETAILS", { x: colRight, y, font: fontBold, size: 8, color: GOLD });
  let detailY = y - 18;

  const details = [
    { label: "Certificate №", value: data.certificateNumber },
    { label: "Issued", value: new Date(data.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
    { label: "Sessions completed", value: String(data.totalSessions) },
    { label: "Overall average", value: `${data.overallAverage}/100` },
  ];

  for (const d of details) {
    page.drawText(d.label, { x: colRight, y: detailY, font: fontRegular, size: 7, color: MEDIUM_GRAY });
    page.drawText(d.value, { x: colRight + 110, y: detailY, font: fontBold, size: 7, color: WHITE });
    detailY -= 14;
  }

  // Strengths
  if (data.strengths.length > 0) {
    detailY -= 6;
    page.drawText("STRENGTHS", { x: colRight, y: detailY, font: fontBold, size: 7, color: GREEN });
    for (const s of data.strengths) {
      detailY -= 13;
      page.drawText(`✓  ${s}`, { x: colRight, y: detailY, font: fontRegular, size: 7, color: LIGHT_GRAY });
    }
  }

  // Areas for development
  if (data.improvements.length > 0) {
    detailY -= 14;
    page.drawText("AREAS FOR DEVELOPMENT", { x: colRight, y: detailY, font: fontBold, size: 7, color: GOLD });
    for (const s of data.improvements) {
      detailY -= 13;
      page.drawText(`→  ${s}`, { x: colRight, y: detailY, font: fontRegular, size: 7, color: LIGHT_GRAY });
    }
  }

  // Areas of law
  if (data.areasOfLaw.length > 0) {
    detailY -= 14;
    page.drawText("AREAS PRACTISED", { x: colRight, y: detailY, font: fontBold, size: 7, color: GOLD });
    detailY -= 13;
    const areasStr = data.areasOfLaw.join("  ·  ");
    page.drawText(areasStr, { x: colRight, y: detailY, font: fontRegular, size: 7, color: LIGHT_GRAY });
  }

  // ── Signature line ──
  const sigY = 95;
  // Gold line
  page.drawLine({
    start: { x: W / 2 - 100, y: sigY },
    end: { x: W / 2 + 100, y: sigY },
    color: GOLD, thickness: 0.5,
  });
  // Signature text (italic to simulate handwriting)
  const sigName = "Giquina";
  const sigNameWidth = fontItalic.widthOfTextAtSize(sigName, 18);
  page.drawText(sigName, { x: (W - sigNameWidth) / 2, y: sigY + 8, font: fontItalic, size: 18, color: GOLD });
  // Title under line
  const sigTitle = "Founder & Director, RATIO";
  const sigTitleWidth = fontRegular.widthOfTextAtSize(sigTitle, 8);
  page.drawText(sigTitle, { x: (W - sigTitleWidth) / 2, y: sigY - 14, font: fontRegular, size: 8, color: MEDIUM_GRAY });

  // ── Verification footer ──
  const footerY = 50;
  const verifyUrl = `ratio-law.vercel.app/certificates/verify/${data.verificationCode}`;
  const verifyText = `Verify: ${verifyUrl}`;
  const verifyWidth = fontMono.widthOfTextAtSize(verifyText, 6);
  page.drawText(verifyText, { x: (W - verifyWidth) / 2, y: footerY, font: fontMono, size: 6, color: MEDIUM_GRAY });

  // Disclaimer
  const disclaimer = "This certificate recognises structured advocacy practice. It is not an academic qualification or professional accreditation.";
  const discWidth = fontRegular.widthOfTextAtSize(disclaimer, 5.5);
  page.drawText(disclaimer, { x: (W - discWidth) / 2, y: footerY - 12, font: fontRegular, size: 5.5, color: DARK_GRAY });

  return await doc.save();
}

/**
 * Trigger a browser download of the certificate PDF.
 */
export function downloadCertificatePDF(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
