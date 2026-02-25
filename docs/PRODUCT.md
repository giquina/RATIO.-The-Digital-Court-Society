# Product Overview

> **Project:** Ratio -- The Digital Court Society
> **Audience:** Contributors, stakeholders, students
> **Last updated:** 2026-02-23

---

## What Ratio Is

Ratio is a constitutional training ground for UK law students. It combines AI-powered advocacy training, live video mooting, legal research tools, competitive tournaments, and democratic governance simulation into a single platform.

The focus is on the jurisdiction of England and Wales. Ratio provides structured, repeatable practice for the skills that matter most in legal education: oral advocacy, legal reasoning, case analysis, and professional conduct.

## Who It Is For

Ratio serves the UK legal community at every stage of qualification and career:

**Students:**
- LLB (undergraduate law)
- GDL (Graduate Diploma in Law)
- LPC (Legal Practice Course)
- BPC (Bar Practice Course)
- SQE preparation (Solicitors Qualifying Examination)

**Professionals:**
- Barristers and solicitor advocates
- Pupillage applicants
- Solicitors
- Paralegals and legal executives
- SQE and BPC candidates (distance/private)

142 UK universities are supported for students. Verification via `.ac.uk` email addresses is planned. Professionals register through a separate onboarding path that does not require university affiliation.

## Core Features

- **AI Judge** -- Four distinct practice modes for structured advocacy training
- **Live Video Mooting** -- Real-time video sessions with peers via Daily.co integration
- **Moot Organisation** -- Create, schedule, and manage mooting sessions with role assignments
- **Legal Research Engine** -- Search UK statutes and case law with OSCOLA-formatted citations
- **Tournaments** -- Competitive mooting events with structured brackets and rankings
- **Advocacy Portfolio** -- Track progress, scores, and skill development over time
- **National League** -- Cross-university rankings and chamber-based competition
- **Parliament and Tribunal** -- Democratic governance simulation within the platform
- **SQE2 Preparation** -- Timed assessment mode aligned with SQE2 oral advocacy requirements

## Key User Flows

1. **Registration**: Create account with email and password
2. **Verification**: Confirm email address (`.ac.uk` verification planned)
3. **Onboarding**: Select university, choose a chamber, pick study modules
4. **Dashboard**: Access all platform features from a unified home screen
5. **From the dashboard**: Create or join mooting sessions, practice with the AI Judge, conduct legal research, enter tournaments, and build an advocacy portfolio

## Pricing

### Student Plans

| Tier | Cost | Includes |
|------|------|----------|
| Free | Free | 3 AI sessions per month, unlimited live moots, legal research, advocacy portfolio |
| Premium | £5.99/month | Unlimited AI sessions, advanced analytics, priority features |
| Premium+ | £7.99/month | Everything in Premium, plus extended research tools and tournament priority |

### Professional Plans

| Tier | Cost | Includes |
|------|------|----------|
| Professional | £14.99/month | Unlimited AI sessions, all tools, professional portfolio branding |
| Professional+ | £24.99/month | Everything in Professional, plus CPD tracking and compliance reports |

Payment processing via Stripe is planned.

## Technology

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand, Framer Motion
- **Backend**: Convex (real-time database and serverless functions)
- **Deployment**: Vercel at ratiothedigitalcourtsociety.com
- **AI**: Claude Sonnet (primary), GPT-4o-mini (fallback)
- **Video**: Daily.co for live mooting sessions
- **Payments**: Stripe (planned)

For full technical details, see ARCHITECTURE.md.

## Limitations

- AI-generated content is educational in nature. It is not legal advice.
- The AI Judge may produce inaccurate citations or flawed legal reasoning.
- Always verify AI output against primary sources: [legislation.gov.uk](https://www.legislation.gov.uk) and official law reports.
- Ratio is not a substitute for qualified legal counsel.
- The platform is under active development. Features and availability are subject to change.
