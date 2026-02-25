# RATIO — Professional Expansion Roadmap

> **Created:** 2026-02-25
> **Author:** Giquina
> **Status:** Phases 1-3 Complete

---

## Vision

Expand RATIO from a student-only platform to serve the entire UK legal advocacy community — from first-year law students to practising barristers — while keeping student pricing untouched and the student experience front-and-centre.

---

## Target Audiences (Beyond Students)

| Audience | Why They'd Use RATIO | Priority |
|----------|---------------------|----------|
| Pupillage applicants | Mock interview prep, advocacy practice for applications | 🔴 High |
| BPC/SQE distance learners | No university affiliation, need practice tools | 🔴 High |
| Junior barristers (0-3 yrs) | Sharpen advocacy skills early in career | 🟡 Medium |
| Solicitor advocates | Building courtroom confidence | 🟡 Medium |
| Paralegals upskilling | Career development, advocacy exposure | 🟢 Lower |
| Law firms (institutional) | Training programme tool for trainees | 🟢 Future |
| Barristers' chambers | Developing junior tenants | 🟢 Future |

---

## Pricing Structure

### Student Tiers (unchanged)

| Tier | Monthly | Annual | Key Features |
|------|---------|--------|--------------|
| Free | £0 | £0 | 3 AI sessions/mo, live mooting, research, portfolio |
| Premium | £5.99/mo | £4.79/mo | Unlimited AI, Case Brief, Argument Builder, analytics |
| Premium+ | £7.99/mo | £6.39/mo | Everything above + SQE2 prep, mock orals |

### Professional Tiers (new)

| Tier | Monthly | Annual | Key Features |
|------|---------|--------|--------------|
| Professional | £14.99/mo | £11.99/mo | Unlimited AI, all tools, professional portfolio branding |
| Professional+ | £24.99/mo | £19.99/mo | Everything above + CPD tracking, exportable compliance reports |

### Institutional (future — Phase 4)

| Tier | Pricing | Key Features |
|------|---------|--------------|
| Institutional | £99-199/mo per 10 seats | Admin dashboard, bulk user management, firm branding |

---

## Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE
Add the ability for non-students to sign up and use the platform.

- [x] Add `userType` field to profile schema ("student" | "professional")
- [x] Add professional-specific profile fields (role, firm/chambers, practiceArea)
- [x] Create branching onboarding: Step 0 asks "I am a..." → Student or Professional
- [x] Student path: existing flow (university → year → modules → chamber)
- [x] Professional path: role → firm/chambers (optional) → practice areas → chamber
- [x] Update `createProfile` mutation to handle both user types
- [x] Update profile display to show role instead of university for professionals
- [x] Update settings page to show professional info where applicable

### Phase 2: Pricing & Payments (Week 3-4) ✅ COMPLETE
Redesign pricing and add Stripe tiers for professionals.

- [x] Redesign `PricingSection.tsx` with Student/Professional tabs
- [x] Add professional and professional_plus to subscription plan types
- [x] Update `useSubscription.ts` with new plan types and feature access map
- [x] Update Stripe checkout and webhook for professional plans
- [x] Update FAQ to reflect broader audience
- [x] Update landing page hero/copy to say "UK legal community" not just "students"
- [x] Update SEO metadata, OpenGraph, Twitter cards
- [x] Update referral messaging
- [ ] Create new Stripe Price IDs in Stripe Dashboard (manual step — needs Giquina)
- [ ] Add STRIPE_PROFESSIONAL_PRICE_ID and STRIPE_PROFESSIONAL_PLUS_PRICE_ID to Vercel env

### Phase 3: Professional-Specific Value (Week 5-8) ← NEXT
Build features that justify the premium professional pricing.

- [ ] Professional portfolio branding (title shows "Barrister" not "LLB Student")
- [ ] CPD tracking dashboard
- [ ] Exportable CPD compliance reports (PDF)
- [ ] AI personas that adapt tone based on userType (judge addresses professionals differently)
- [ ] Practice area-specific AI scenarios
- [ ] Networking features (professionals can mentor students)

### Phase 4: Institutional (Future)
Multi-seat licences for firms and chambers.

- [ ] Institutional pricing tier
- [ ] Admin dashboard for firm/chambers managers
- [ ] Bulk user invite and onboarding
- [ ] Firm/chambers branding on profiles
- [ ] Usage reporting for training managers
- [ ] This is a different sales motion — requires outbound sales, not self-serve

---

## Key Design Decisions

1. **Students remain the core audience.** Professional tiers are additive, not a pivot.
2. **Same app, different onboarding.** Professionals use the same features — they just enter through a different door.
3. **Pricing gap is intentional.** Students pay £0-8/mo. Professionals pay £15-25/mo. This reflects professional purchasing power and perceived value.
4. **No feature removal from students.** Nothing that students currently get disappears. Professional tiers add *positioning* (branding, CPD tracking) not *restrictions*.
5. **Backward compatible.** Existing student profiles work without migration. New fields are optional.

---

## Files Changed (Phase 1)

| File | Change |
|------|--------|
| `convex/schema.ts` | Add `userType`, `professionalRole`, `firmOrChambers`, `practiceAreas` to profiles |
| `convex/users.ts` | Update `createProfile` mutation args and handler |
| `src/app/(auth)/onboarding/page.tsx` | Add Step 0 user type selection, branch flows |
| `src/lib/constants/app.ts` | Add `PROFESSIONAL_ROLES` and `PRACTICE_AREAS` constants |
| `src/app/(app)/profile/page.tsx` | Show role/firm for professionals |
| `src/app/(app)/settings/page.tsx` | Show professional info in account section |
