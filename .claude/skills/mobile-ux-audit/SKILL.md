---
name: mobile-ux-audit
description: Audit all pages for mobile usability, touch targets, alignment, breakpoints, and broken interactions. Use when reviewing mobile UX quality, checking responsive design, or preparing for a release.
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob, Bash(npx next build *)
argument-hint: "[route-or-all]"
---

# Mobile UX Audit

Audit the Ratio app for mobile usability issues. This is a UK law student platform with a navy/gold/burgundy design system and institutional tone.

## Target

If `$ARGUMENTS` specifies a route (e.g., `/home`, `/sessions`), audit only that page.
If `$ARGUMENTS` is empty or "all", audit every page in `src/app/(app)/`.

## Audit Checklist

For each page, check the following and report pass/fail with specific findings:

### 1. Touch Targets (Minimum 44px)
- All buttons, links, and interactive elements must be at least 44x44px
- Check `py-*` and `px-*` values on buttons and links
- Flag any `text-xs` or `text-court-xs` elements that are also clickable
- Check `gap-*` between adjacent tap targets (minimum 8px)

### 2. Spacing & Breathing Room
- Page padding: `px-4` minimum on mobile
- Section gaps: `gap-3` or `mb-3` minimum between sections
- No content touching screen edges (must have padding)
- Headers: consistent `pt-3 pb-4` pattern
- Cards: minimum `p-3` padding

### 3. Responsive Breakpoints
- Verify `md:` and `lg:` breakpoints are present for grid layouts
- Check that `hidden md:flex` / `md:hidden` are used correctly for nav
- Ensure no `max-w-lg` constraints remain (should use `max-w-content-*`)
- Verify content widths: narrow (672px), medium (1024px), wide (1280px)

### 4. Interactive Elements
- All buttons must have an `onClick` handler or be wrapped in `<Link>`
- No dead `<span>` or `<div>` elements with click-like styling
- Search bars must be real `<input>` elements, not decorative divs
- Form inputs must have visible focus states (`focus:border-gold/40`)

### 5. Typography
- No arbitrary `text-[Xpx]` values — must use `text-court-*` tokens
- Headings use `font-serif font-bold`
- Body text uses `text-court-base` or `text-court-sm`
- Labels use `text-court-xs` with `tracking-wider`

### 6. Icons
- No emoji characters in rendered UI (check for unicode emoji in JSX)
- All icons should be Lucide React components
- Icon sizes appropriate: 14-16px inline, 18-24px standalone

### 7. Loading & Empty States
- Pages using data should have loading/skeleton states
- Pages with filterable content should have empty states
- Error boundaries should exist for data-fetching pages

### 8. Navigation
- BottomNav visible below `md:` breakpoint with `md:hidden`
- Sidebar visible at `md:` and above with `hidden md:flex`
- Active states visible (gold text/border) on current route
- All nav links functional

## Output Format

Use the template in [templates/audit-report.md](templates/audit-report.md) for the output.

For each page produce:
1. Overall score (0-10)
2. Pass/fail per checklist item
3. Specific issues with file:line references
4. Prioritized fix queue (Critical → High → Medium → Low)

End with an aggregate scorecard across all pages.
