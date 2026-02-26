# RATIO Promo Video Production Guide

**Last updated:** 2026-02-26
**Engine:** Remotion 4 (React-based video rendering)
**Format:** 9:16 vertical (393x852) at 30fps
**Output:** `promo/videos/*.mp4` (H.264)

---

## Video Catalog

| # | Composition ID | Duration | Frames | File | Description |
|---|----------------|----------|--------|------|-------------|
| 1 | `AIPracticePromo` | 20s | 600 | `ai-practice-promo.mp4` | Original AI practice promo (screenshot-based, no VO) |
| 2 | `AIPracticeCinematic` | 73s | 2190 | `ai-practice-cinematic.mp4` | Cinematic AI practice walkthrough — Charlie VO, captions, SFX, courtroom ambiance |
| 3 | `AIPracticeShort` | ~32s | 950 | `ai-practice-short.mp4` | High-impact social cut — Charlie VO (hook + intro + CTA) |
| 4 | `FeatureShowcase` | 70s | 2100 | `feature-showcase.mp4` | Rapid-fire tour of RATIO ecosystem — Charlie VO, 9 scenes |
| 5 | `LiveSessionSnippet` | 55s | 1650 | `live-session-snippet.mp4` | Simulated courtroom exchange — Charlie narrator + George judge |
| 6 | `ConstitutionalLaw` | 55s | 1650 | `constitutional-law.mp4` | Constitutional law showcase — topics, key cases, practice demo |
| 7 | `RecruitmentPromo` | 48s | 1440 | `recruitment-promo.mp4` | Summer hiring/work experience roles — Birkbeck highlighted, 6 role cards |

---

## Quick Reference

### Preview in Studio
```bash
npx remotion studio
# Select composition from dropdown, scrub timeline
```

### Render a Video
```bash
npx remotion render <CompositionId> promo/videos/<filename>.mp4 --codec h264
```

### Render All Videos
```bash
npx remotion render AIPracticeCinematic promo/videos/ai-practice-cinematic.mp4 --codec h264
npx remotion render AIPracticeShort promo/videos/ai-practice-short.mp4 --codec h264
npx remotion render FeatureShowcase promo/videos/feature-showcase.mp4 --codec h264
npx remotion render LiveSessionSnippet promo/videos/live-session-snippet.mp4 --codec h264
npx remotion render ConstitutionalLaw promo/videos/constitutional-law.mp4 --codec h264
npx remotion render RecruitmentPromo promo/videos/recruitment-promo.mp4 --codec h264
```

---

## ElevenLabs Voice Settings

Two voices are used. Both use the `eleven_multilingual_v2` model.

| Voice | Role | Voice ID | Stability | Similarity | Style |
|-------|------|----------|-----------|------------|-------|
| **Charlie** | Narrator / Advocate | `IKne3meq5aSn9XLyUdCD` | 0.62 | 0.72 | 0.35 |
| **George** | AI Judge (authoritative) | `JBFqnCBsd6RMkjVDRZzb` | 0.72 | 0.75 | 0.30 |

> **Note:** Originally used **Daniel** (`onwK4e9ZLuTAKqWW03F9`, stability 0.60, style 0.40).
> Switched to Charlie on 2026-02-26 — Daniel sounded too much like a nature documentary
> narrator. Charlie is more articulate and barrister-like. Daniel backups are in
> `public/audio/voiceover/backup-daniel/`.

**API Key:** stored in env / hardcoded in generation scripts.

**Batch generation script:** `scripts/generate-charlie-clips.sh`
- Reads all clip texts from inline arrays
- Generates via ElevenLabs API with retry logic (3 attempts)
- Applies 150ms fade-out via ffmpeg
- Validates file size (rejects < 1KB responses)

**Manual generation command (curl):**
```bash
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/<VOICE_ID>" \
  -H "xi-api-key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"text":"<SCRIPT>","model_id":"eleven_multilingual_v2","voice_settings":{"stability":0.62,"similarity_boost":0.72,"style":0.35}}' \
  --output public/audio/voiceover/<filename>.mp3
```

**Post-processing:** All ElevenLabs clips get a 150ms fade-out to eliminate tail artifacts:
```bash
ffmpeg -i input.mp3 -af "afade=t=out:st=<duration-0.15>:d=0.15" -y output.mp3
```

**Important:** Avoid em-dashes (`\u2014`) in curl JSON payloads on Windows/Git Bash. They cause
"invalid UTF-8 encoding" errors from the API. Use ASCII hyphens (`-`) instead.

---

## Audio Assets

### Voiceover Clips (`public/audio/voiceover/`)

**AIPracticeCinematic (9 clips — Charlie voice):**
- `cinematic-01-cold-open.mp3` — "Every advocate starts somewhere."
- `cinematic-02-preparation.mp3` — "Long before the courtroom..."
- `cinematic-03-choose-judge.mp3` — "RATIO pairs you with an AI Judge..."
- `cinematic-04-case-brief.mp3` — "You get a genuine constitutional law brief..."
- `cinematic-05-court-opens.mp3` — "Then the session starts..."
- `cinematic-06-exchange.mp3` — "You distinguish the authorities..."
- `cinematic-07-feedback.mp3` — "When it's over, you get a proper judgment..."
- `cinematic-08-improvement.mp3` — "Detailed written feedback..."
- `cinematic-09-cta.mp3` — "RATIO. The Digital Court Society..."

**AIPracticeShort (3 clips — Charlie voice):**
- `short-01-hook.mp3`, `short-02-intro.mp3`, `short-03-cta.mp3`

**FeatureShowcase (9 clips — Charlie voice):**
- `showcase-01-open.mp3` through `showcase-09-cta.mp3`

**LiveSessionSnippet (3 narrator + 3 judge clips):**
- Narrator (Charlie): `session-01-title.mp3`, `session-02-score.mp3`, `session-03-cta.mp3`
- Judge (George): `session-judge-01.mp3`, `session-judge-02.mp3`, `session-judge-03.mp3`

**ConstitutionalLaw (6 clips — Charlie voice):**
- `conlaw-01-title.mp3` through `conlaw-06-cta.mp3`

**RecruitmentPromo (6 clips — Charlie voice):**
- `recruit-01-hook.mp3` — "We're building something for law students."
- `recruit-02-what.mp3` — "RATIO is a constitutional training ground..."
- `recruit-03-hiring.mp3` — "And now we're looking for the people..."
- `recruit-04-roles.mp3` — "Growth and partnerships. Content and legal writing..."
- `recruit-05-unis.mp3` — "We want students from across the UK. Birkbeck..."
- `recruit-06-cta.mp3` — "If you're studying law and you want real work experience..."

**Backups (Daniel voice originals):**
- `public/audio/voiceover/backup-daniel/` — All 30 original Daniel narrator clips

### Background Music (`public/audio/music/`)
Synthesized ambient pads (ffmpeg sine wave + tremolo + lowpass):
- `ambient-pad-30s.mp3` — for AIPracticeShort
- `ambient-pad-45s.mp3` — for ConstitutionalLaw, RecruitmentPromo
- `ambient-pad-55s.mp3` — for LiveSessionSnippet, ConstitutionalLaw
- `ambient-pad-60s.mp3` — for FeatureShowcase
- `ambient-pad-75s.mp3` — for AIPracticeCinematic

### Sound Effects (`public/audio/sfx/`)
- `whoosh.mp3` — scene transitions (volume: 0.04)
- `ui-click.mp3` — UI interaction moments
- `gavel-wood.mp3` — court/gavel impacts
- `gavel-tap.mp3` — lighter gavel tap
- `door-close.mp3` — courtroom door
- `paper-shuffle.mp3` — document handling
- `chime.mp3` — achievement/score reveals
- `courtroom-tone.mp3` — ambient courtroom tone (continuous, low volume)
- `courtroom-murmur.mp3` — ambient murmur (continuous, low volume)

---

## Shared Visual Components

These components are defined locally in each composition file and can be extracted to a shared module if needed:

| Component | Used In | Purpose |
|-----------|---------|---------|
| `TextReveal` | All cinematic videos | Character-by-character text animation |
| `GoldLine` | All cinematic videos | Decorative animated gold line |
| `GoldParticles` | Cinematic, Showcase | Floating gold particle effect |
| `Vignette` | All videos | Edge darkening overlay |
| `FilmGrain` | All videos | Subtle noise texture overlay |
| `CaptionOverlay` | All videos with VO | Timed subtitle captions |
| `PhoneMockup` | Cinematic, Short | iPhone frame with screen content |
| `ScoreCircle` | Cinematic, Session, ConLaw | Animated score donut chart |
| `SpeakingIndicator` | LiveSessionSnippet | Animated sound wave bars for judge voice |
| `RoleCard` | RecruitmentPromo | Job role card with type badge and pay |
| `UniversityPill` | RecruitmentPromo | University name pill with Birkbeck highlight |
| `FeatureBadge` | RecruitmentPromo | Platform feature badge (icon + label) |
| `AnimatedCounter` | RecruitmentPromo | Number counter animation (e.g. 142) |

---

## Design System (Video)

Matches the RATIO app design system:

- **Background:** `#0C1220` (navy) — main bg
- **Card bg:** `#182640` (navy-card)
- **Gold accent:** `#C9A84C` — headings, highlights, particles
- **Gold dim:** `rgba(201, 168, 76, 0.12)` — badge backgrounds
- **Burgundy:** `#6B2D3E` — secondary accent
- **Body text:** `#F2EDE6` (court-text)
- **Secondary text:** `rgba(242, 237, 230, 0.6)`
- **Borders:** `rgba(255, 255, 255, 0.06)`
- **Fonts:** Cormorant Garamond (serif headings), DM Sans (body)
- **Corner radius:** 14px for cards

---

## Known Issues & Fixes

### "Tssk" / Click Sound After Voiceover Lines
**Cause:** Two factors — (1) ElevenLabs clips have residual tail noise at -70 to -75 dB (not true silence), and (2) whoosh SFX at high volume at every scene transition.
**Fix applied:** 150ms fade-out on all VO clips via ffmpeg, 50ms fade-out on all SFX clips, whoosh volume reduced from 0.18 to 0.04 across all compositions.

### ElevenLabs API Permissions
The API key has TTS permission but NOT `voices_read`. Use known voice IDs directly instead of listing voices via the API.

### Video Timing
Always calculate scene timings AFTER generating voiceover clips — ElevenLabs duration varies from script estimates. Use `ffprobe` to get exact durations:
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/audio/voiceover/<clip>.mp3
```

---

## Creating a New Video

### Step-by-step workflow:

1. **Write the voiceover script** — Add to `promo/scripts.md`
2. **Generate ElevenLabs clips** — One per scene, Charlie voice for narration, George for judge
3. **Measure clip durations** — `ffprobe` each clip, calculate frame counts (duration * 30)
4. **Apply fade-out** — 150ms fade-out to every clip
5. **Generate ambient pad** — Match the total video duration
6. **Build the composition** — Create `remotion/<Name>.tsx` with scenes, audio sequences, captions
7. **Register in Root.tsx** — Import + `<Composition>` with correct `durationInFrames`
8. **Preview** — `npx remotion studio`, select composition, scrub timeline
9. **Render** — `npx remotion render <Id> promo/videos/<name>.mp4 --codec h264`
10. **Verify** — Check duration, resolution, audio sync with ffprobe

### Ambient pad generation (ffmpeg):
```bash
ffmpeg -f lavfi -i "sine=frequency=85:duration=<DURATION>" \
  -af "tremolo=f=0.08:d=0.6,lowpass=f=200,volume=0.25,afade=t=in:st=0:d=3,afade=t=out:st=<DURATION-3>:d=3" \
  -codec:a libmp3lame -b:a 128k -y public/audio/music/ambient-pad-<DURATION>s.mp3
```

---

## File Structure

```
remotion/
  Root.tsx                 # Registers all compositions
  index.ts                 # Remotion entry point
  AIPracticePromo.tsx      # Original 20s promo (screenshots)
  AIPracticeCinematic.tsx  # 73s cinematic walkthrough
  AIPracticeShort.tsx      # ~32s social cut
  FeatureShowcase.tsx      # 70s ecosystem tour
  LiveSessionSnippet.tsx   # 55s voice-acted courtroom session
  ConstitutionalLaw.tsx    # 55s constitutional law showcase
  RecruitmentPromo.tsx     # 48s summer hiring/work experience

public/audio/
  voiceover/               # ElevenLabs VO clips (Charlie + George voices)
  voiceover/backup-daniel/ # Original Daniel voice clips (archived)
  music/                   # Synthesized ambient pads
  sfx/                     # Sound effects (whoosh, gavel, chime, etc.)

public/screenshots/mobile/ # Puppeteer-captured app screenshots (for Promo/Cinematic)

promo/
  videos/                  # Rendered MP4 outputs
  scripts.md               # Voiceover scripts for all videos
  README.md                # Promo directory readme

PROMO-VIDEO-PLAN.md        # This file — master production guide
```

---

## Distribution Targets

- **WhatsApp group chats** — Primary. 9:16 vertical, share directly as video.
- **Instagram Reels / TikTok** — 9:16 vertical, first 3s hook optimised.
- **WhatsApp Status** — 9:16 compressed.
- **University law society Discords** — Direct upload.
- **Landing page embed** — Hero section or dedicated promo page.
- **LinkedIn / Twitter** — Consider 16:9 landscape variants (not yet created).

---

## Workflow Improvements (Planned)

These are nice-to-haves that would streamline production:

1. **Extract shared Remotion components to `remotion/shared/`** — TextReveal, GoldLine, Vignette, FilmGrain, CaptionOverlay, GoldParticle are copy-pasted across 7+ files. Extract to shared modules.
2. **Batch VO generation script** — `scripts/generate-charlie-clips.sh` exists but reads from inline arrays. Create a `scripts/generate-voiceover.js` that reads from a JSON manifest.
3. **Auto-timing utility** — `scripts/compute-timings.js` to auto-calculate scene timelines from clip durations. Currently manual math per scene.
4. **Render-all npm script** — Add `npm run remotion:render-all` to package.json.
5. **LUFS loudness normalization** — Add `ffmpeg -af "loudnorm=I=-16:TP=-1.5:LRA=11"` step to ensure consistent volume across all clips.

---

## Future Ideas

- **Human voiceover** — Marvinho offered to record narration. Would replace Charlie voice clips.
- **Subject-specific videos** — ConstitutionalLaw is the template. Extend to Criminal Law, Human Rights, Commercial Law, etc.
- **16:9 landscape variants** — For LinkedIn, YouTube, Twitter.
- **1:1 square variants** — For Instagram feed posts.
- **Courtroom ambiance in the actual app** — The ambient tone/murmur should also play in the real AI practice interface.
- **Recruitment video variants** — Seasonal updates for different hiring rounds (Michaelmas, Easter, Summer).
