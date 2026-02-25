# PLAN: Landing Page Improvements & New Sections

> **Status:** Planning — Ready to build
> **Project:** RATIO — The Digital Court Society
> **Date:** 25 Feb 2026

---

## PROBLEM 1: Signed-In User Experience on Landing Page

### What happens now:
- User signs in → goes to `/(app)/home` (dashboard)
- If they visit `/` (landing page), they see "Sign In" button — even though they're already signed in
- There's no redirect, no "Go to Dashboard" — it's just slightly awkward
- Once inside the app, there's no easy link back to the landing page

### Recommended fix:
- **On the landing page nav:** Detect auth state. If signed in, show "Go to Dashboard" button instead of "Sign In"
- **In the app sidebar/footer:** Optionally add a "Visit Homepage" or "Share RATIO" link (useful for ambassadors sharing the site)

### Files to change:
- `src/app/page.tsx` — Add Convex auth check, conditionally show nav button
- `src/components/landing/FooterSection.tsx` — Minor (already has good structure)

---

## PROBLEM 2: Landing Page Is Missing New Features

### Current sections (18 total):
1. HeroSection — Main headline + CTA
2. TrustBar — University logos
3. DisclaimerBanner — Educational tool note
4. FeaturesGrid — Overview grid of core features
5. StudyUseCases — "Whether you're studying for…"
6. HowItWorks — 3-step process
7. AIShowcase — AI Judge demo
8. VideoMootingShowcase — Group moot sessions
9. TournamentShowcase — Competitions
10. ToolsShowcase — AI legal tools
11. LawBookPreview — Collaborative encyclopedia
12. GovernanceShowcase — Parliament + Tribunal system
13. ChambersPreview — Inns of Court grouping
14. TestimonialSection — Student quotes
15. PricingSection — Tiers (Free → Professional+)
16. FAQSection — Common questions
17. CTASection — Final call to action
18. FooterSection — Links + socials

### Features with NO landing page showcase:

| Feature | Impact | Visual Opportunity |
|---------|--------|-------------------|
| **Certificates** | HIGH — premium value prop, revenue driver | Skills radar chart mockup, certificate preview, verification QR demo |
| **Ambassador Programme** | HIGH — social proof, growth driver | Ambassador grid with photos, university map, "Join" CTA |
| **Social Feed** | MEDIUM — shows community is active | Mockup of post feed, commend buttons, activity cards |
| **Portfolio & PDF** | MEDIUM — career value for students | PDF preview mockup, "share with employers" angle |
| **Referral Programme** | LOW — more of an in-app feature | Could be a small callout, not a full section |
| **SQE2/Examiner Mode** | MEDIUM — targets specific audience | Timed assessment UI mockup, SRA competency badge |
| **Badges & Achievements** | LOW-MEDIUM — gamification appeal | Badge collection preview, unlocked badge animation |
| **CPD Tracking** | LOW — professional users only | Dashboard mockup showing hours logged |

---

## PROPOSED NEW SECTIONS

### Priority order (sections to add):

#### 1. 📜 CertificateShowcase (HIGH PRIORITY)
**Position:** After ToolsShowcase, before LawBookPreview
**Content:**
- Headline: "Earn Verified Advocacy Credentials"
- Subtext: "Complete structured requirements. Get assessed across 7 dimensions. Earn a certificate signed by the Founder with a unique QR code that anyone can scan to verify."
- **Visual: Interactive certificate mockup** — a styled card that looks like the real certificate, with:
  - Student name, certificate level, date
  - Skills radar chart showing 7 dimensions (animated on scroll)
  - QR code that says "Scan to verify"
  - 3 level badges (Bronze/Silver/Gold) with brief requirements
- **Visual: Skills radar chart** — animated SVG/canvas showing 7 advocacy dimensions
- **NOT just text** — this section should feel like you're looking at a real credential

#### 2. 🤝 AmbassadorShowcase (HIGH PRIORITY)
**Position:** After TestimonialSection, before PricingSection
**Content:**
- Headline: "Join the Ambassador Programme"
- Subtext: "Represent RATIO at your university. Get free Premium+ access, all certificates included, and a letter of recommendation from the Founder."
- **Visual: Ambassador grid** — show real ambassador photos/avatars + university names (once we have them; use placeholder avatars for now with universities)
- **Visual: Benefits icons strip** — the 6 benefits as icon cards (same as /ambassadors page)
- CTA button: "Apply to Be an Ambassador →" linking to `/ambassadors`
- Small text: "Currently accepting ambassadors from UK universities"

#### 3. 📊 PortfolioShowcase (MEDIUM PRIORITY)
**Position:** After CertificateShowcase
**Content:**
- Headline: "Build Your Advocacy Portfolio"
- Subtext: "Every session, every score, every certificate — compiled into a professional PDF you can share with chambers, law firms, and recruiters."
- **Visual: PDF preview mockup** — a tilted/angled card showing what the exported portfolio PDF looks like:
  - Name, university, chamber
  - Session history table
  - Skills radar chart
  - Certificates earned
  - Endorsements
- **NOT just text** — show the actual portfolio output so students think "I want that"

#### 4. 🏅 BadgesShowcase (MEDIUM PRIORITY)
**Position:** Could be folded into an existing section (FeaturesGrid or a new "Gamification" section)
**Content:**
- Headline: "Unlock Distinctions as You Progress"
- Subtext: "Earn badges for milestones like your first moot, 7-day streaks, tournament wins, and more."
- **Visual: Badge collection grid** — show 8-12 badges in a grid, some "unlocked" (gold/coloured) and some "locked" (greyed out with a lock icon). Each badge has a name and icon.
- This creates FOMO — "I want to unlock those"

#### 5. 📱 SocialShowcase (LOW-MEDIUM PRIORITY)
**Position:** Could be merged into existing FeaturesGrid or added after ChambersPreview
**Content:**
- Headline: "A Legal Community, Not Just a Tool"
- Subtext: "Share insights, follow advocates, commend achievements, and stay connected with your legal network."
- **Visual: Feed mockup** — a styled card showing 2-3 example social posts:
  - "Amara K. completed a moot on Constitutional Law — scored 78/100"
  - "Marcus T. earned the 'First Distinction' badge"
  - Shows commend button, comment icon
- Keeps it feeling like a living community, not a dead tool

#### 6. ⏱️ SQE2Showcase (LOW PRIORITY — can wait)
**Position:** Near PricingSection or as part of StudyUseCases
**Content:**
- Quick mention that RATIO includes timed SQE2-style advocacy assessments
- **Visual:** Timer UI mockup showing countdown + SRA competency score
- This targets a specific niche — can be a smaller callout rather than full section

---

## VISUAL APPROACH (What "Not Just Text" Means)

The user wants each new section to be VISUAL. Here are the approaches for each:

### Option A: Animated SVG/React Components (Best for RATIO)
- **Skills radar chart** — animated SVG with 7 axes, fills in on scroll
- **Certificate mockup** — styled React component that looks like a real certificate
- **Badge grid** — real badge components from the app, some unlocked, some locked
- **Feed mockup** — styled cards matching the actual app design
- **Pros:** Matches the app's dark/gold aesthetic, interactive, no external images needed
- **Cons:** More code to write

### Option B: Static Illustrations
- Custom illustrations in the RATIO style (dark navy + gold)
- Could use SVG illustrations or simple diagrams
- **Pros:** Fast to implement, lightweight
- **Cons:** Less impressive than interactive components

### Option C: App Screenshots
- Take actual screenshots from the app and embed them
- **Pros:** Shows the real product
- **Cons:** Screenshots go stale when UI changes, harder to style consistently

### RECOMMENDATION: Option A for the key sections (Certificates, Portfolio, Badges), Option B for supplementary sections (Ambassador, Social). This keeps the landing page feeling premium and interactive while being maintainable.

---

## IMPLEMENTATION PLAN

### New files to create:
- `src/components/landing/CertificateShowcase.tsx` — Certificate preview + radar chart
- `src/components/landing/AmbassadorShowcase.tsx` — Ambassador programme CTA
- `src/components/landing/PortfolioShowcase.tsx` — PDF portfolio preview
- `src/components/landing/BadgesShowcase.tsx` — Badge collection grid
- `src/components/landing/SocialShowcase.tsx` — Social feed mockup

### Files to modify:
- `src/app/page.tsx` — Add new sections in order + smart nav for signed-in users
- `src/components/landing/FAQSection.tsx` — Already updated with cert + ambassador FAQs ✅
- `src/components/landing/FooterSection.tsx` — Already updated with cert + ambassador links ✅
- `src/components/landing/PricingSection.tsx` — Already updated with "certificates included" ✅

### Suggested section order (updated landing page):

```
1.  HeroSection
2.  TrustBar
3.  DisclaimerBanner
4.  FeaturesGrid
5.  StudyUseCases
6.  HowItWorks
7.  AIShowcase
8.  VideoMootingShowcase
9.  TournamentShowcase
10. ToolsShowcase
11. CertificateShowcase ← NEW
12. PortfolioShowcase ← NEW
13. LawBookPreview
14. GovernanceShowcase
15. ChambersPreview
16. BadgesShowcase ← NEW
17. SocialShowcase ← NEW
18. AmbassadorShowcase ← NEW
19. TestimonialSection
20. PricingSection
21. FAQSection
22. CTASection
23. FooterSection
```

That takes the page from 18 to 23 sections. The new sections slot in naturally — Certificates and Portfolio after Tools (they're outcomes of using the tools), Badges and Social after Chambers (community/gamification), and Ambassadors before Testimonials (social proof leading into pricing).

### Estimated effort per section:

| Section | Effort | Visual complexity |
|---------|--------|------------------|
| CertificateShowcase | Medium-High | Radar chart + cert mockup |
| AmbassadorShowcase | Small | Icons + grid + CTA button |
| PortfolioShowcase | Medium | PDF mockup card |
| BadgesShowcase | Medium | Badge grid with unlock states |
| SocialShowcase | Medium | Feed mockup cards |
| Landing nav auth fix | Small | Conditional button render |

---

## SUMMARY

**Two problems, one plan:**

1. **Signed-in nav fix** — Quick win. Detect auth, show "Dashboard" instead of "Sign In"
2. **5 new landing page sections** — Certificates, Portfolio, Badges, Social, Ambassadors. All visual-first with interactive mockups, not just text walls. Takes the page from 18 → 23 sections.

**Ready to build when you are.**
