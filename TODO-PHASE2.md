# Phase 2 TODO — Pricing & Payments Redesign

> **Status:** In Progress
> **Started:** 2026-02-25
> **Target:** 2-3 weeks

---

## Subscription Logic

- [ ] **useSubscription.ts** — Add `professional` and `professional_plus` plan types
- [ ] **Feature access map** — Map professional plans to feature access:
  - `professional` = same features as `premium`
  - `professional_plus` = same features as `premium_plus`
- [ ] **Plan hierarchy** — free < premium < premium_plus < professional < professional_plus

## Pricing Page Redesign

- [ ] **PricingSection.tsx** — Add Student/Professional toggle tabs
- [ ] Student tab shows existing 3 tiers (Free, Premium £5.99, Premium+ £7.99)
- [ ] Professional tab shows 2 tiers (Professional £14.99, Professional+ £24.99)
- [ ] Monthly/Annual toggle works for both tabs
- [ ] Annual pricing = 20% discount (Professional £11.99/mo, Professional+ £19.99/mo)

## Stripe Integration

- [ ] **Checkout route** — Add `STRIPE_PROFESSIONAL_PRICE_ID` and `STRIPE_PROFESSIONAL_PLUS_PRICE_ID`
- [ ] **Webhook route** — Detect professional plans from price IDs
- [ ] **Environment variables** — Add new Stripe price IDs to Vercel env config
- [ ] Note: Actual Stripe Price IDs created in Stripe Dashboard (manual step)

## Landing Page Messaging

- [ ] **HeroSection.tsx** — Broaden from "UK Law Students" to "UK Legal Community"
- [ ] **CTASection.tsx** — Update copy to include professionals
- [ ] **FAQSection.tsx** — Update "Who can join?" and pricing FAQ answers

## Testing Checklist

- [ ] Student pricing page still displays correctly
- [ ] Professional pricing tab shows correct prices
- [ ] Monthly/Annual toggle works for both tabs
- [ ] Checkout route accepts professional plan types
- [ ] Webhook correctly identifies professional subscriptions
- [ ] Feature access unchanged for existing student subscribers
- [ ] Landing page messaging reads naturally for both audiences
