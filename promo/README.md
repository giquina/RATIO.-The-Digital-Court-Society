# RATIO. Promo Assets

All promotional video and screenshot assets for the Moot Court feature.

---

## Videos (`videos/`)

| File | Duration | Size | Use |
|------|----------|------|-----|
| `moot-court-cinematic-75s.mp4` | 75s | 10.7 MB | Website hero, LinkedIn, YouTube |
| `moot-court-short-30s.mp4` | 30s | 2.8 MB | Instagram Reels, TikTok, WhatsApp Status |
| `moot-court-promo.mp4` | 20s | 2.4 MB | Original quick version (reference) |

## Screenshots (`screenshots/`)

| File | Shows |
|------|-------|
| `moot-court-mobile.png` | Mode selection — 4 AI persona cards |
| `ai-briefing-temperament.png` | Judge temperament picker |
| `ai-briefing-case.png` | Case brief with authorities |
| `ai-session-live.png` | Live courtroom, Judge opening statement |
| `ai-session-exchange.png` | Active exchange — user + Judge chat |
| `ai-feedback-score.png` | Overall score + 7 dimension breakdown |
| `ai-feedback-judgment.png` | Written judgment + key improvement |

All screenshots are 2x Retina PNGs (786x1704 actual pixels).

---

## How to re-render

```bash
# 75-second cinematic
npx remotion render remotion/index.ts MootCourtCinematic --output promo/videos/moot-court-cinematic-75s.mp4 --codec h264

# 30-second social cut
npx remotion render remotion/index.ts MootCourtShort --output promo/videos/moot-court-short-30s.mp4 --codec h264
```

## How to re-capture screenshots

```bash
npm run dev:frontend
node scripts/capture-moot-court-screenshots.js
node scripts/capture-feedback-screenshots.js
```

## Source files

| File | Purpose |
|------|---------|
| `remotion/MootCourtCinematic.tsx` | 75s cinematic composition |
| `remotion/MootCourtShort.tsx` | 30s social cut composition |
| `remotion/MootCourtPromo.tsx` | Original 20s composition |
| `remotion/Root.tsx` | Registers all compositions |
| `scripts/capture-moot-court-screenshots.js` | Puppeteer screenshot automation |
| `scripts/capture-feedback-screenshots.js` | Puppeteer feedback screenshots |
