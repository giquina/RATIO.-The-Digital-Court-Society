/**
 * Capture AI Practice mobile screenshots for Remotion promo video.
 *
 * Usage:  node scripts/capture-ai-practice-screenshots.js
 *
 * Prerequisites:
 *   - Dev server running at http://localhost:3000  (npm run dev:frontend)
 *   - NEXT_PUBLIC_CONVEX_URL commented out in .env.local  (demo mode)
 *
 * Saves PNGs to public/screenshots/mobile/
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.resolve(__dirname, "../public/screenshots/mobile");
const BASE = "http://localhost:3000";

// iPhone 14 Pro viewport — 2x scale for crisp Retina screenshots
const DEVICE = { width: 393, height: 852, deviceScaleFactor: 2 };

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Click a button by its visible text content */
async function clickButton(page, text) {
  await page.evaluate((t) => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find((b) => b.textContent.includes(t));
    if (btn) btn.click();
    else console.warn(`Button "${t}" not found`);
  }, text);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport(DEVICE);

  // ── Pre-set splash + cookie flags so overlays don't interfere ─────
  // Navigate to base first to set storage on the correct origin
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem("ratio_first_visit_done", "1");
    localStorage.setItem("ratio-cookie-consent", "declined");
    sessionStorage.setItem("ratio_splash_seen", "1");
  });

  // Auto-accept confirm() dialogs (for End Session)
  page.on("dialog", async (dialog) => {
    console.log("     Dialog:", dialog.message());
    await dialog.accept();
  });

  // ── 1. Mode Selection ──────────────────────────────────────────────
  console.log("1/7  Mode selection...");
  await page.goto(`${BASE}/ai-practice`, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(3000);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-practice-mobile.png"), type: "png" });
  console.log("     ✓ ai-practice-mobile.png");

  // ── 2. Briefing — click Judge card ─────────────────────────────────
  console.log("2/7  Briefing (temperament)...");
  await page.evaluate(() => {
    const el = document.querySelector('[class*="cursor-pointer"]');
    if (el) el.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-briefing-temperament.png"), type: "png" });
  console.log("     ✓ ai-briefing-temperament.png");

  // ── 3. Briefing — scroll to case brief ─────────────────────────────
  console.log("3/7  Briefing (case brief)...");
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-briefing-case.png"), type: "png" });
  console.log("     ✓ ai-briefing-case.png");

  // ── 4. Begin Session ───────────────────────────────────────────────
  console.log("4/7  Live session...");
  await page.evaluate(() => window.scrollTo(0, 9999));
  await sleep(300);
  await clickButton(page, "Begin Session");
  await sleep(6000); // wait for AI opening message
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-session-live.png"), type: "png" });
  console.log("     ✓ ai-session-live.png");

  // ── 5. Type a submission & get response ────────────────────────────
  console.log("5/7  Session with exchange...");
  const textarea = await page.$("textarea");
  if (textarea) {
    await textarea.click();
    await page.keyboard.type(
      "May it please the court. My Lord, the central issue is whether the Royal Prerogative may be exercised to trigger Article 50 TEU without Parliamentary authority. I respectfully submit it cannot.",
      { delay: 5 }
    );
    await sleep(500);
    // Click the send button (arrow-up icon next to textarea)
    await page.evaluate(() => {
      const textarea = document.querySelector("textarea");
      if (!textarea) return;
      const container = textarea.closest("div")?.parentElement;
      if (!container) return;
      const btns = [...container.querySelectorAll("button")];
      // Send button is typically the last button in the input area
      const sendBtn = btns[btns.length - 1];
      if (sendBtn) sendBtn.click();
    });
    await sleep(8000); // wait for AI response
  }
  await page.screenshot({ path: path.join(OUT_DIR, "ai-session-exchange.png"), type: "png" });
  console.log("     ✓ ai-session-exchange.png");

  // ── 6. End session → feedback ──────────────────────────────────────
  console.log("6/7  Ending session → feedback...");
  await clickButton(page, "End Session");
  await sleep(6000); // loading-feedback → feedback
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-feedback-score.png"), type: "png" });
  console.log("     ✓ ai-feedback-score.png");

  // ── 7. Feedback — scroll to judgment ───────────────────────────────
  console.log("7/7  Feedback (judgment + key improvement)...");
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-feedback-judgment.png"), type: "png" });
  console.log("     ✓ ai-feedback-judgment.png");

  await browser.close();
  console.log(`\nDone — 7 screenshots saved to public/screenshots/mobile/`);
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err.message);
  process.exit(1);
});
