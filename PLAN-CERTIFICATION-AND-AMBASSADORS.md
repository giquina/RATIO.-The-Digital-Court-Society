# RATIO — Certification Program & Ambassador Partnership Plan

> **Created:** 2026-02-25
> **Author:** Giquina (planned with Claude)
> **Status:** Planning Complete — All decisions confirmed, ready to build

---

## Overview

Two new strategic initiatives for RATIO:

1. **Certification Program** — A structured pathway where users complete activities and earn verified, professional certificates signed by the Founder
2. **Ambassador Partnership Program** — A formal page and system inviting moot/law society leaders at universities worldwide to represent RATIO and grow the platform together

Both initiatives leverage systems **already built into RATIO** (badges, skills tracking, 7-dimension scoring, AI sessions, referrals, Stripe billing, CPD tracking) — so implementation builds on existing foundations rather than starting from scratch.

---

## ⚠️ AUDIENCE NOTE: Staying UK-Focused For Now

**Confirmed decision:** RATIO remains UK-focused for this phase. The site copy stays as-is (referencing UK legal community). International expansion will come later once the certification and ambassador programmes are proven domestically.

However, there's no need to actively *block* international users. If international students sign up organically, great — the advocacy skills are universal even if the legal content is English law. The ambassador programme will initially target UK universities only, with international expansion as a future phase.

---

# PART 1: CERTIFICATION PROGRAM

## 1.1 The Concept

Think of it like a university degree pathway — but for **advocacy skills specifically**.

- Users complete structured activities on RATIO (AI sessions, moots, research, feedback)
- The platform **automatically tracks** their progress (most data already captured in schema)
- When they meet the requirements, they can **claim a verified certificate**
- Certificate is **signed by Giquina as Founder & Director**, branded with RATIO identity
- Each certificate includes a **skills breakdown** — not just "you passed" but "here's exactly what you're good at and where to improve"
- Anyone can **verify the certificate** via a unique URL/QR code

**What makes this different from Coursera/LexisNexis certificates:**
- It's **skills-based, not content-based** — you don't just watch videos, you actually perform advocacy
- The AI Judge provides **objective, measurable scoring** across 7 dimensions
- The certificate shows a **detailed skills radar** — employers can see exactly what someone is strong at
- It's the only certification specifically for **moot court advocacy skills**

## 1.2 Certification Levels

### 🥉 Foundation Certificate in Advocacy Practice

**Requirements:**
- Complete **5 AI Judge sessions** (any mode: judge, mentor, examiner, opponent)
- Achieve an average overall score of **50+** (out of 100)
- Complete at least **1 group moot session** (live or video)
- Save at least **1 case brief** to portfolio

**Skills assessed:** Basic argument structure, court manner, oral delivery

**What the certificate says:** "This advocate has demonstrated foundational competence in oral advocacy through structured AI-assessed practice sessions and peer mooting."

---

### 🥈 Intermediate Certificate in Advocacy & Legal Reasoning

**Requirements:**
- Complete **15 AI Judge sessions** across at least **3 different areas of law**
- Achieve an average overall score of **65+**
- Score **70+** in at least 3 of the 7 scoring dimensions
- Complete at least **5 group moot sessions**
- Have received **peer feedback** on at least 3 sessions
- Complete at least **1 legal research task** (saved authority)

**Skills assessed:** All 7 dimensions with demonstrated improvement over time

**What the certificate says:** "This advocate has demonstrated intermediate proficiency in advocacy, including strong legal reasoning, effective use of authorities, and developing judicial handling skills."

---

### 🥇 Advanced Certificate in Advocacy Excellence

**Requirements:**
- Complete **30+ AI Judge sessions** across at least **5 areas of law**
- Achieve an average overall score of **80+**
- Score **80+** in at least 5 of the 7 scoring dimensions
- Complete **10+ group moot sessions**
- Participate in at least **1 tournament**
- Contribute to the **Law Book** (at least 1 approved edit/article)
- Demonstrate **streak consistency** (at least a 14-day streak at some point)
- Complete at least **1 timed advocacy assessment** (SQE2-style)

**Skills assessed:** Mastery-level breakdown across all 7 dimensions + consistency + versatility across law areas

**What the certificate says:** "This advocate has demonstrated advanced mastery of oral advocacy, consistently performing at a high level across multiple areas of law, under timed conditions, and in competitive settings."

---

### 🏆 (Future) Specialist Certificates

Once the core 3 tiers work, add area-specific certificates:
- **Criminal Advocacy Specialist** — 15+ sessions in criminal law, 75+ average
- **Commercial Advocacy Specialist** — same for commercial/contract law
- **Human Rights Advocacy Specialist** — etc.

These could be premium add-ons at higher price points.

## 1.3 What Already Exists in the Schema (No New Tables Needed Yet)

| What's needed | Already built? | Where in schema |
|---------------|---------------|-----------------|
| AI session count per user | ✅ Yes | `aiSessions` table, indexed `by_profile` |
| Overall scores per session | ✅ Yes | `aiSessions.overallScore` + `aiSessions.scores` (7 dimensions) |
| Area of law per session | ✅ Yes | `aiSessions.areaOfLaw` |
| Group moot count | ✅ Yes | `sessions` + `sessionParticipants` |
| Tournament participation | ✅ Yes | `tournamentEntries` table |
| Peer feedback | ✅ Yes | `feedback` table with 7-dimension scores |
| Skills tracking | ✅ Yes | `userSkills` table (score 0-100) |
| Badges earned | ✅ Yes | `userBadges` table |
| Streak tracking | ✅ Yes | `profiles.streakDays` |
| Portfolio saved | ✅ Yes | `aiSessions.savedToPortfolio` |
| Legal research | ✅ Yes | `savedAuthorities` table |
| Law Book contributions | ✅ Yes | `lawBookContributions` table |
| Subscriptions/billing | ✅ Yes | `subscriptions` table + Stripe integration |

### New Schema Needed

```
certificates: defineTable({
  profileId: v.id("profiles"),
  level: v.string(),           // "foundation" | "intermediate" | "advanced" | "specialist_criminal" etc.
  status: v.string(),          // "in_progress" | "requirements_met" | "issued" | "revoked"
  issuedAt: v.optional(v.string()),
  certificateNumber: v.optional(v.string()),  // "RATIO-2026-00001"
  verificationCode: v.optional(v.string()),   // unique code for QR/URL verification
  // Skills snapshot at time of issue
  skillsSnapshot: v.optional(v.object({
    argumentStructure: v.number(),
    useOfAuthorities: v.number(),
    oralDelivery: v.number(),
    judicialHandling: v.number(),
    courtManner: v.number(),
    persuasiveness: v.number(),
    timeManagement: v.number(),
  })),
  overallAverage: v.optional(v.number()),
  totalSessions: v.optional(v.number()),
  areasOfLaw: v.optional(v.array(v.string())),
  // Payment
  paymentStatus: v.optional(v.string()),   // "free" | "paid" | "included_in_subscription"
  stripePaymentId: v.optional(v.string()),
})
  .index("by_profile", ["profileId"])
  .index("by_verification", ["verificationCode"])
  .index("by_status", ["status"])
```

### New Pages Needed

| Route | Purpose |
|-------|---------|
| `/certificates` | Dashboard showing progress toward all certificate levels |
| `/certificates/[level]` | Detail page for a specific level — requirements checklist, progress bars |
| `/certificates/verify/[code]` | Public page (no login required) — employers scan QR, see verified certificate |
| `/certificates/[id]/view` | The actual certificate display — printable, shareable |

## 1.4 Certificate Design & Verification

### What's on the certificate:
- RATIO logo and branding (dark, gold, courtroom aesthetic)
- "RATIO Certificate of [Level] in Advocacy"
- Student's full name
- Date of issue
- Certificate number (RATIO-2026-XXXXX)
- **Skills radar chart** — visual breakdown of the 7 scoring dimensions
- **Strengths & areas for development** — 2-3 bullet points each
- Areas of law practised
- Total sessions completed
- Digital signature: "Giquina [Surname], Founder & Director, RATIO"
- QR code linking to `/certificates/verify/[code]`

### Verification:
- **Option A (free, DIY):** Build a simple `/certificates/verify/[code]` public page that queries the database and shows certificate details. Anyone can visit the URL or scan the QR.
- **Option B (professional, Phase 2):** Integrate with **Sertifier** (free tier: 250 certs/year) or **VerifyEd** (UK-based, blockchain-backed). Students can add to LinkedIn with one click.

**Recommendation:** Start with Option A (costs nothing, fully in your control). Upgrade to Option B when you hit 250+ certificates/year.

### PDF Generation:
- Already have PDF export capability in the codebase (`src/lib/utils/pdf-export.ts`)
- Generate a beautifully branded PDF certificate that can be downloaded and printed
- Include the QR code in the PDF

## 1.5 Pricing & Revenue Model

### How certificates fit into existing pricing tiers:

| Tier | Monthly Price | Certificate Access |
|------|--------------|-------------------|
| **Free** | £0 | Can **track progress** toward Foundation. Must pay **£29.99 one-time** to issue/download it |
| **Premium** | £5.99/mo | All standard certificates **included** (Foundation, Intermediate, Advanced) |
| **Premium+** | £7.99/mo | All standard certificates **included** + specialist certificates |
| **Professional** | £14.99/mo | All certificates **included** |
| **Professional+** | £24.99/mo | All certificates **included** |

> **Confirmed decision:** Certificates are included for all paying subscribers. This adds significant perceived value to subscriptions and reduces churn. Free users can still earn and track progress — the certificate issuance is the conversion trigger.

### Standalone purchases (no subscription):

| Certificate | One-time Price |
|-------------|---------------|
| Foundation | £29.99 |
| Intermediate | £49.99 |
| Advanced | £79.99 |
| Bundle (all 3) | £129.99 (save £29.97) |
| Specialist (each) | £39.99 |

### Why this pricing works:
- **Free users get value** — they can track progress and earn badges for free. The certificate is the "unlock" moment
- **Subscription users get certificates included** — this adds perceived value to the subscription, reducing churn
- **One-time purchases work for casual users** — someone who does 5 AI sessions and wants a Foundation cert doesn't need a subscription
- **Professionals expect to pay** — £49.99 for an Advanced advocacy certificate is very reasonable compared to CPD courses (£100-500+)

### Revenue projections:

| Scenario | Users | Certificate purchases (free users) | Subscription revenue | Total |
|----------|-------|-----------------------------------|---------------------|-------|
| Year 1 (early) | 500 active | 60 certs × £40 avg | 80 subs × £72/yr avg | ~£8,160 |
| Year 2 (growth) | 2,000 active | 200 certs × £50 avg | 400 subs × £72/yr avg | ~£38,800 |
| Year 3 (established) | 5,000+ active | 500 certs × £55 avg | 1,000 subs × £72/yr avg | ~£99,500 |

> Note: Certificate revenue comes from **free users converting** via one-time purchases. Subscribers already have certs included — their value is in recurring subscription revenue. The certificates act as both a standalone product AND a subscription conversion tool.

### Payment implementation:
- Already have Stripe integrated
- Add new Stripe Price IDs for certificate one-time purchases
- Add a "Buy Certificate" button on the certificate progress page
- When requirements are met → show "Claim Certificate" → Stripe checkout → issue certificate

## 1.6 Legal Disclaimer (Important)

**What the certificate IS:**
- A professional development certificate issued by RATIO (a private platform)
- Evidence of structured advocacy practice and measurable skill development
- A complement to academic qualifications, not a replacement

**What the certificate IS NOT:**
- An academic qualification (not accredited by a university)
- A professional licence (not issued by SRA, BSB, or any regulatory body)
- A guarantee of competence in a real courtroom

**Required disclaimer on every certificate:**
> "This certificate is issued by RATIO — The Digital Court Society and recognises structured advocacy practice assessed through AI and peer evaluation. It is not an academic qualification and does not constitute professional accreditation by the Solicitors Regulation Authority, Bar Standards Board, or any regulatory body."

---

# PART 2: AMBASSADOR & PARTNERSHIP PROGRAM

## 2.1 The Concept

Turn the current loose mention of university representation into a **formal, structured program** with its own page, application process, clear benefits, and tracking.

**Key difference from generic ambassador programs:** This isn't just "promote our app." Ambassadors are **moot society leaders and law community organisers** who already run advocacy activities. RATIO gives them better tools to do what they're already doing, and they bring their communities onto the platform.

## 2.2 Program Structure

### Tiers of Partnership

| Tier | Who | What they do | What they get |
|------|-----|-------------|---------------|
| **Ambassador** | Any law student at any university worldwide | Share referral link, promote RATIO on social media, give feedback | Free Premium access, ambassador badge, featured on website |
| **Society Partner** | Official moot/law society representative | Organise sessions/tournaments on RATIO for their society, run events | Free Premium+ for the rep + 3 months free Premium for their first 20 sign-ups, RATIO co-branded event support |
| **University Champion** | Multiple society partners at one university, or faculty-endorsed | Integrate RATIO into their university's moot programme | Institutional pricing discussion, custom university branding, direct line to Giquina for feature requests |

### Ambassador Benefits (detailed):

**For the individual:**
- Free **Premium+ access** (worth £95.88/year)
- "RATIO Ambassador" badge on their profile (visible in rankings, society page)
- **All certificates included free** (worth £79.99+)
- Featured on the RATIO Ambassadors page (name, university, photo, quote)
- **Personal referral dashboard** — track how many people they've brought in
- **Letter of recommendation** from Giquina as Founder — for pupillage/training contract/job applications
- Early access to new features
- Invitation to annual **RATIO Inter-University Moot** (virtual event)

**For their society/community:**
- First 20 members who sign up through ambassador link get **3 months free Premium**
- Co-branded event support — RATIO provides templates, graphics, tournament setup
- Featured as a "Partner Society" on the RATIO website
- Access to RATIO's tournament system for running their internal competitions
- Analytics dashboard showing their members' engagement and progress

### What RATIO gets:
- **Organic growth** at each university through peer-to-peer word of mouth
- **Real user feedback** from diverse campuses and countries
- **Content for social media** — testimonials, event photos, partnership announcements
- **Network effect** — as more universities join, the platform becomes "the one everyone uses"
- **Credibility** — "used by moot societies at 50+ universities" is powerful marketing

## 2.3 Referral Tracking (Already Built!)

The existing `referrals` system in the schema is perfect for this:

| Feature | Already exists? | Where |
|---------|---------------|-------|
| Unique referral links per user | ✅ | `profiles.handle` → `/join/[handle]` |
| Referral tracking | ✅ | `referrals` table with status tracking |
| Fraud detection | ✅ | `referrals.fraudFlags` (same_ip, velocity_cap, self_referral) |
| Reward issuance | ✅ | `referralRewards` table |
| Analytics | ✅ | `referralAnalytics` table with period-based stats |

### What's new for ambassadors:
- Add `isAmbassador: v.optional(v.boolean())` to `profiles` schema
- Add `ambassadorTier: v.optional(v.string())` — "ambassador" | "society_partner" | "university_champion"
- Add `ambassadorSince: v.optional(v.string())`
- Create ambassador-specific analytics view (their referral stats, their members' activity)

## 2.4 The Ambassador Page

### New route: `/ambassadors`

**Section 1 — Hero**
- Headline: "Represent RATIO at Your University"
- Subheadline: "Join moot society leaders, law society presidents, and advocacy champions at universities worldwide who are shaping the future of legal education."
- CTA button: "Apply to Become an Ambassador"

**Section 2 — What Ambassadors Do**
- Promote RATIO within your moot society and law community
- Organise moot sessions and tournaments using the platform
- Provide feedback to help shape new features
- Share your RATIO experience on social media
- Welcome new members and help them get started

**Section 3 — What You Get**
- Visual cards showing each benefit (free Premium+, certificates, letter of recommendation, etc.)

**Section 4 — Current Ambassadors**
- Grid of ambassador cards: photo, name, university, society role, short quote
- Map or visual showing which universities are represented
- Counter: "Ambassadors at X universities across Y countries"

**Section 5 — How to Apply**
- Simple form: Name, Email, University, Society/Role, Country, "Why do you want to be a RATIO Ambassador?" (short paragraph), Social media links (optional)
- Application reviewed by Giquina personally
- Response within 7 days

**Section 6 — FAQ**
- "Do I need to be part of a moot society?" — No, any law student who's passionate about advocacy can apply
- "Is this a paid role?" — Not paid in cash, but you get free Premium+ access, certificates, and career benefits
- "How much time does it take?" — As much or as little as you want. Some ambassadors share one post a month; others organise weekly sessions
- "Can international students apply?" — Absolutely. RATIO is for law students and legal professionals worldwide

## 2.5 Outreach Strategy

### Phase 1: Warm network (Week 1-2)
- Giquina's own contacts at Birkbeck
- Fellow students in the LLB programme
- Moot society contacts from past competitions
- Target: **5-10 founding ambassadors**

### Phase 2: Direct outreach (Week 3-6)
- Find moot society / law society social media accounts at target universities
- Send personalised DM or email to presidents/committee members
- Start with Russell Group + London universities, then expand across UK
- Target: **20-30 ambassadors across 15+ UK universities**

### Phase 3: Wider UK expansion (Month 2-3)
- Reach out to every UK university with a law school
- Target regional universities, post-92 institutions, and distance learning providers
- Partner with BPC/GDL/SQE provider student groups
- Target: **50+ ambassadors across 30+ UK universities**

### Phase 4: International (Future — not this phase)
- Once UK ambassador programme is proven and generating results
- Expand to Ireland, Australia, Canada, then broader Commonwealth
- Adapt messaging for different jurisdictions
- This is a separate strategic decision for later

## 2.6 Messaging Templates

### For Instagram/LinkedIn DM to a moot society:

> Hi [Name/Society]! 👋
>
> I'm Giquina, the founder of RATIO — a digital court society platform where law students can practise advocacy with an AI Judge, organise moots, and track their skills development.
>
> We're launching an Ambassador Programme and I think [Society Name] would be an amazing partner. Your ambassadors would get free Premium+ access, all certificates included, and we'd feature your society on our platform.
>
> Would you be open to a quick chat about how we could work together? No pressure at all — happy to send more info first if that's easier!

### For email to a law society president:

> Subject: Partnership opportunity — RATIO x [University] Law/Moot Society
>
> Dear [Name],
>
> I'm writing to introduce RATIO — The Digital Court Society — a platform I've built to help law students practise advocacy through AI-powered moot sessions, live video mooting, and competitive tournaments.
>
> We're currently inviting moot and law society leaders to join our Ambassador Programme. As an ambassador, you'd receive free Premium+ access (worth £95/year), all advocacy certificates included, and a personalised letter of recommendation. Your society would be featured on our platform, and your members would receive 3 months free Premium access.
>
> I'd love to discuss how RATIO could complement [Society Name]'s existing activities. Would you be available for a 15-minute call this week?
>
> Best regards,
> Giquina
> Founder & Director, RATIO — The Digital Court Society

---

# CONFIRMED DECISIONS

| Decision | Answer |
|----------|--------|
| Certificate pricing | **Higher tier:** £29.99 / £49.99 / £79.99 / Bundle £129.99 |
| Subscription inclusion | **Included for all paying subscribers.** Free users pay one-time. |
| Ambassador selection | **Curate carefully at first** — hand-pick first 20, open up later |
| Global vs UK | **Stay UK-focused for now.** Don't block international users, but don't actively market internationally yet |
| Certificate signing | **Digital signature** — Giquina's name in a signature font, scales cleanly |
| Timeline | **All three workstreams in parallel** |

---

# PARALLEL IMPLEMENTATION PLAN

All three workstreams run simultaneously. Here's how they break down:

## Workstream A: Certification System

| Step | Task | Effort |
|------|------|--------|
| A1 | Add `certificates` table to `convex/schema.ts` | Small |
| A2 | Create `convex/certificates.ts` — mutations & queries (check progress, issue cert, verify) | Medium |
| A3 | Build `/certificates` dashboard page — shows all 3 levels with progress bars | Medium |
| A4 | Build `/certificates/[level]` detail page — full requirements checklist | Medium |
| A5 | Build certificate PDF generation (`src/lib/utils/certificate-pdf.ts`) | Medium |
| A6 | Build `/certificates/verify/[code]` public verification page (no auth) | Small |
| A7 | Add Stripe one-time Price IDs for certificate purchases | Small |
| A8 | Add "Buy Certificate" / "Claim Certificate" checkout flow | Medium |
| A9 | Add certificates to subscription feature access (Premium+ gets all certs) | Small |

## Workstream B: Ambassador Programme

| Step | Task | Effort |
|------|------|--------|
| B1 | Add ambassador fields to `profiles` in schema (`isAmbassador`, `ambassadorTier`, `ambassadorSince`) | Small |
| B2 | Build `/ambassadors` page — hero, benefits, current ambassadors, how to apply | Medium |
| B3 | Build ambassador application form (stores in new `ambassadorApplications` table or simple email) | Small |
| B4 | Add "RATIO Ambassador" badge to badge system | Small |
| B5 | Show ambassador badge on profile page and society/rankings page | Small |
| B6 | Create ambassador referral dashboard (enhanced view of existing referral stats) | Medium |
| B7 | Write outreach message templates (DM + email) | Small (planning) |
| B8 | Begin outreach to first 10-20 moot societies at UK universities | Ongoing |

## Workstream C: Copy & Quick Wins

| Step | Task | Effort |
|------|------|--------|
| C1 | Add "Certificates" to navigation sidebar | Small |
| C2 | Add "Ambassadors" link to footer and/or landing page | Small |
| C3 | Add certificate progress cards to home page dashboard | Small |
| C4 | Update the About page "Our Principles" to mention certification | Small |
| C5 | Update PricingSection to mention "All certificates included" for paid tiers | Small |
| C6 | Add FAQ entries for certificates and ambassador programme | Small |

## Suggested Build Order (parallel but sequenced within each stream):

**Week 1:** A1 + A2 + B1 + B2 + C1 + C2 (schema + pages)
**Week 2:** A3 + A4 + B3 + B4 + C3 + C5 (dashboard + forms + navigation)
**Week 3:** A5 + A6 + B5 + B6 + C4 + C6 (PDF + verification + polish)
**Week 4:** A7 + A8 + A9 + B7 + B8 (payments + outreach launch)

---

# FILES THAT WILL CHANGE (Preview)

### New files:
- `src/app/(app)/certificates/page.tsx` — Certificate progress dashboard
- `src/app/(app)/certificates/[level]/page.tsx` — Individual cert progress
- `src/app/certificates/verify/[code]/page.tsx` — Public verification (no auth)
- `src/app/ambassadors/page.tsx` — Ambassador programme page (public)
- `convex/certificates.ts` — Certificate queries and mutations
- `src/lib/utils/certificate-pdf.ts` — PDF generation for certificates

### Modified files:
- `convex/schema.ts` — Add `certificates` table, ambassador fields on profiles
- `convex/seed.ts` — Add "RATIO Ambassador" badge
- `src/components/landing/PricingSection.tsx` — Add "All certificates included" to paid tiers
- `src/components/landing/FAQSection.tsx` — Add certificate and ambassador FAQs
- `src/app/(app)/about/page.tsx` — Mention certification programme
- `src/app/(app)/profile/page.tsx` — Show ambassador badge
- `src/app/(app)/society/page.tsx` — Show ambassador badge in rankings
- `src/app/(app)/home/page.tsx` — Add certificate progress cards
- `src/app/api/stripe/` — New price IDs for certificate one-time purchases
- `src/app/page.tsx` — Add Ambassadors section or link to landing page
