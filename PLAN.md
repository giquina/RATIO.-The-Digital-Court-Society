# RATIO — High-Level Plan
Last updated: 2026-02-23

## Status: Days 1-6 complete. Production live. Auth + Demo login working.

### Phase Summary
| Day | Focus | Status |
|-----|-------|--------|
| 1 | Critical Fixes (max-w-lg, SSR, dead buttons, search inputs) | DONE |
| 2 | Typography + Fonts + Spacing | DONE |
| 3 | Emoji → Lucide Icons (50 instances across 5 files) | DONE |
| 4 | Empty states + Skeletons + Mobile breathing room | DONE |
| — | Production Infrastructure (domain, GA4, Sentry, SEO, deploy) | DONE |
| 5 | Convex Auth + Route protection (layout-client pattern) | DONE |
| 6 | Home + Profile + Community → Convex backend | DONE |
| 7 | Sessions + AI Judge Enhancement (caching + streaming) | Pending |
| 8 | Follow System + Community growth signals | PARTIAL (toggleFollow, FollowButton exist) |
| 9 | Law Book Schema + MVP Pages (7 new tables) | Pending |
| 10 | Desktop Sidebar + Responsive Layout | DONE |
| 11 | New Pages: Settings, Rankings, Chambers, Tools, About | Pending |
| 12 | AI Tools: Case Brief + Argument Builder | Pending |
| 13 | Homepage Institutional Rebuild (section components) | PARTIAL (PricingSection exists) |
| 14 | Governance MVP + Verification + CI/CD + QA | Pending |

### Production Details
- Domain: ratiothedigitalcourtsociety.com (GoDaddy → Vercel)
- Analytics: Google Analytics 4 (G-D2EJDX48MD) with GDPR consent gating
- Error tracking: Sentry (org: armora, project: ratio)
- Deployment: Vercel, auto-deploy from main branch
- SEO: Full OG/Twitter metadata, dynamic sitemap (14 routes), robots.txt
- Security: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### Core Identity
Ratio is ONE thing: A constitutional training ground for UK law students.

### Key Principles
1. One primary action per screen
2. Premium = restraint (no social media noise)
3. Institutional tone (serious, calm, authoritative)
4. Mobile-first ruthlessness (44px tap targets, breathing room)
5. Ship focused, add later (Phase 1 Core → Phase 2 Institutional → Phase 3 Governance → Phase 4 Ecosystem)

### Documentation
See [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) for the full documentation map.
