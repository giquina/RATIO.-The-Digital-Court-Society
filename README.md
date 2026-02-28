# ⚖️ Ratio.

**The digital court society for UK law students. The reason you're ready.**

Organise moots. Claim courtroom roles. Practice with an AI Judge. Track your advocacy. Build your portfolio.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up Convex
npx convex dev          # creates project + deploys schema

# 3. Copy env file
cp .env.example .env.local
# Add your NEXT_PUBLIC_CONVEX_URL from the Convex dashboard

# 4. Seed the database
npx convex run seed:run

# 5. Run both frontend + backend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Free |
| Backend | Convex (real-time database + serverless) | Free tier |
| Auth | Convex Auth (Password only) | Free |
| AI Judge | Claude / GPT-4o-mini via API | ~£0.05/session |
| Voice | Web Speech API (browser-native) | Free |
| Hosting | Vercel | Free tier |
| Total MVP | | **~£8/month** |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, onboarding
│   ├── (app)/           # Authenticated app with bottom nav
│   │   ├── home/        # Dashboard, streak, activity feed
│   │   ├── sessions/    # Browse, create, detail with role claiming
│   │   ├── society/     # Discover, rankings, chambers
│   │   ├── moot-court/  # AI Judge, Mentor, SQE2 Examiner
│   │   ├── library/     # Templates, guides, case bank
│   │   └── profile/     # Stats, skills, portfolio
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
├── lib/                 # Constants, AI prompts, utilities
├── hooks/               # Custom React hooks
└── stores/              # Zustand state management
convex/
├── schema.ts            # Database schema (~40 tables)
├── profiles.ts          # User profile queries/mutations
├── sessions.ts          # Session CRUD + role claiming
├── social.ts            # Follows, activities, commendations
├── aiSessions.ts        # AI practice sessions + feedback
├── ai.ts                # External LLM API actions
├── notifications.ts     # Notifications + resources
└── seed.ts              # Seed badges + starter resources
```

## AI Judge

The AI Judge works in 4 modes:
1. **The Judge** — High Court judge who interrupts with questions
2. **The Mentor** — Senior counsel coaching
3. **SQE2 Examiner** — Timed assessment against SRA standards
4. **Opposing Counsel** — AI argues against you (coming soon)

Works with or without API keys — falls back to hardcoded responses for demos.

## Free Tier Limits

- **Convex**: 50K MAU, unlimited real-time sync
- **Vercel**: 100GB bandwidth, serverless functions
- **AI sessions**: ~100 sessions/month for £8 in API costs
- **Voice**: Unlimited (browser Web Speech API)

## Documentation

- [Documentation Index](docs/DOCS_INDEX.md) — Map of all project documentation
- [Architecture](ARCHITECTURE.md) — System overview and design decisions
- [Security](SECURITY.md) — Security architecture and vulnerability reporting
- [Product Overview](docs/PRODUCT.md) — What Ratio is and who it's for
- [FAQ](docs/FAQ.md) — Student-focused frequently asked questions

## Deploy

```bash
# Deploy to Vercel
vercel

# Deploy Convex to production
npx convex deploy
```

---

> **Disclaimer**: Ratio is an educational training tool for UK law students. It does not provide legal advice. AI-generated content should always be verified against primary sources.
