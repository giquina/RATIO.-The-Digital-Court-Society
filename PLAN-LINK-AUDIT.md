# RATIO — Link & Path Audit Plan

**Date:** 25 Feb 2026  
**Triggered by:** Ambassador footer link showing error page

---

## 🔍 Audit Results

### Footer Links (from `FooterSection.tsx`)

| Link | Target | Status | Issue |
|------|--------|--------|-------|
| AI Judge | `/#ai-showcase` | ✅ Works | Anchor exists on landing page |
| Live Mooting | `/#video-mooting` | ✅ Works | Anchor exists |
| Legal Research | `/#features` | ✅ Works | Anchor exists |
| Tournaments | `/#tournaments` | ✅ Works | Anchor exists |
| AI Tools | `/#tools` | ✅ Works | Anchor exists |
| Law Book | `/#law-book` | ✅ Works | Anchor exists |
| Chambers | `/#chambers` | ✅ Works | Anchor exists |
| Rankings | `/#features` | ✅ Works | Anchor exists |
| Parliament | `/#governance` | ✅ Works | Anchor exists |
| Tribunal | `/#governance` | ✅ Works | Anchor exists |
| **Ambassadors** | `/ambassadors` | ❌ **ERROR** | Page crashes — see details below |
| Careers | `/careers` | ✅ Works | Static page, no Convex calls |
| Certificates | `/#features` | ✅ Works | Anchor exists |
| Privacy Policy | `/privacy` | ✅ Works | Static page |
| Cookie Policy | `/cookies` | ✅ Works | Static page |
| Terms of Service | `/terms` | ✅ Works | Static page |
| Code of Conduct | `/code-of-conduct` | ✅ Works | Static page |
| **FAQ** | `/#faq` | ⚠️ **BROKEN** | No `id="faq"` on FAQSection |
| Contact | `/contact` | ✅ Works | Static page |

### Social Links (external)

| Link | URL | Status |
|------|-----|--------|
| Instagram | instagram.com/ratio.law | ⚠️ Unverified (may not exist yet) |
| TikTok | tiktok.com/@ratio.law | ⚠️ Unverified |
| LinkedIn | linkedin.com/company/ratio-law | ⚠️ Unverified |
| X | x.com/ratio_law | ⚠️ Unverified |

---

## 🚨 Issue #1: Ambassador Page Error (HIGH PRIORITY)

**What's happening:**  
The `/ambassadors` page uses `anyApi` from Convex to call two functions:
- `useQuery(anyApi.certificates.getAmbassadors)` — runs immediately on page load
- `useMutation(anyApi.certificates.submitAmbassadorApplication)` — runs on form submit

**Why it crashes:**  
The Convex functions exist in the codebase (`convex/certificates.ts` lines 466 and 523), BUT Convex auto-deploy is disabled. If these functions haven't been manually deployed to the Convex backend, the `useQuery` call fails immediately when the page loads, and there's **no error boundary** wrapping this page.

Other pages that had the same problem (like the home page) were fixed by wrapping them in a `QuerySafeBoundary` component. The ambassadors page was never given this treatment.

**The fix (2 options):**

**Option A — Quick fix (wrap in error boundary):**
Add a `QuerySafeBoundary` or try/catch wrapper around the Convex calls so the page renders gracefully even if the functions aren't deployed yet. This is the same pattern used on the home page.

**Option B — Proper fix (deploy the Convex functions):**
Run `npx convex deploy` to push the ambassador-related functions to the Convex backend. Then the page will work as designed.

**Recommendation:** Do BOTH. Deploy the functions so the page works, AND add an error boundary so it degrades gracefully if there's ever a backend issue.

---

## ⚠️ Issue #2: FAQ Anchor Missing (LOW PRIORITY)

**What's happening:**  
The footer links to `/#faq`, but the `FAQSection` component doesn't have `id="faq"` on its wrapper element. Clicking "FAQ" in the footer takes you to the top of the home page instead of scrolling to the FAQ section.

**The fix:**  
1. Add an `id` prop to `FAQSection` (like the other landing sections already accept)
2. Pass `id="faq"` when calling `<FAQSection />` in `page.tsx`

This is a 2-line change.

---

## ⚠️ Issue #3: Social Media Links Unverified

**What's happening:**  
The four social media links (Instagram, TikTok, LinkedIn, X) point to profiles that may not exist yet. If a user clicks them and gets a "Page not found" on Instagram, it looks unprofessional.

**Options:**
- If accounts exist → verify URLs are correct
- If accounts don't exist yet → either create them or remove the links from the footer until they're ready

---

## ✅ What's Working Well

- All 8 anchor links on the landing page (`/#ai-showcase`, `/#video-mooting`, etc.) have matching `id` attributes
- All 6 standalone legal/info pages (`/privacy`, `/terms`, `/cookies`, `/contact`, `/careers`, `/code-of-conduct`) are pure static pages with no Convex dependencies — they won't break
- The root `error.tsx` boundary exists and shows a branded error page, so crashes are at least caught visually
- The root layout properly wraps everything in `ConvexClientProvider`

---

## 📋 Fix Order (by priority)

1. **Ambassador page** — deploy Convex functions + add error boundary (fixes the bug you hit)
2. **FAQ anchor** — add `id="faq"` to FAQSection (2-line fix)
3. **Social links** — verify or remove (manual check)
