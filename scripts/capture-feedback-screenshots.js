/**
 * Capture the 2 missing feedback screenshots.
 * Handles the confirm() dialog when ending the session.
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.resolve(__dirname, "../public/screenshots/mobile");
const BASE = "http://localhost:3000";
const DEVICE = { width: 393, height: 852, deviceScaleFactor: 2 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
    protocolTimeout: 60000,
  });

  const page = await browser.newPage();
  await page.setViewport(DEVICE);

  // Auto-accept confirm() dialogs
  page.on("dialog", async (dialog) => {
    console.log("     Dialog:", dialog.message());
    await dialog.accept();
  });

  // Pre-set splash + cookie flags so overlays don't interfere
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem("ratio_first_visit_done", "1");
    localStorage.setItem("ratio-cookie-consent", "declined");
    sessionStorage.setItem("ratio_splash_seen", "1");
  });

  // Navigate & click through to session
  console.log("1/5  Loading AI practice...");
  await page.goto(`${BASE}/ai-practice`, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(3000);

  console.log("2/5  Selecting Judge...");
  await page.evaluate(() => {
    const el = document.querySelector('[class*="cursor-pointer"]');
    if (el) el.click();
  });
  await sleep(1500);

  console.log("3/5  Beginning session...");
  await page.evaluate(() => window.scrollTo(0, 9999));
  await sleep(300);
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find((b) => b.textContent.includes("Begin Session"));
    if (btn) btn.click();
  });
  await sleep(6000);

  console.log("4/5  Ending session (confirm dialog)...");
  // Click End Session — the dialog handler above auto-accepts
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find((b) => b.textContent.includes("End Session"));
    if (btn) btn.click();
  });
  await sleep(8000); // loading-feedback → feedback

  // Capture feedback score (scrolled to top)
  console.log("5/5  Capturing feedback screenshots...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-feedback-score.png"), type: "png" });
  console.log("     ✓ ai-feedback-score.png");

  // Scroll to judgment section
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT_DIR, "ai-feedback-judgment.png"), type: "png" });
  console.log("     ✓ ai-feedback-judgment.png");

  await browser.close();
  console.log("\nDone — feedback screenshots captured.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
