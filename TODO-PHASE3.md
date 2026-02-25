# Phase 3 TODO — Professional-Specific Value

> **Status:** Complete
> **Started:** 2026-02-25
> **Completed:** 2026-02-25

---

## 1. AI Persona Adaptation ✅

- [x] Add `userContext` (userType, role, practiceAreas) to chat/feedback request schemas
- [x] Pass user context from frontend to AI routes via `useAIUserContext` hook
- [x] Create professional prompt modifiers that adjust judge behaviour
- [x] Inject user context into system prompts dynamically via `buildFullSystemPrompt()`
- [x] Feedback route: adjusts assessment framing based on userType

## 2. CPD Tracking ✅

- [x] Add `cpdEntries` table to Convex schema
- [x] Create CPD tracking mutations (logEntry, deleteEntry, getMyEntries, getMySummary)
- [x] Auto-log AI sessions as CPD entries (triggered on session completion for professionals)
- [x] Create `/cpd` dashboard page with annual progress, monthly breakdown, activity log
- [x] Gate CPD page behind professional user type check

## 3. Professional Portfolio Branding ✅

- [x] Portfolio header shows professional title + firm/chambers for professionals
- [x] Practice areas displayed as gold tags on portfolio header

## 4. Practice Area-Specific AI Scenarios ✅

- [x] Created scenario bank with practice-area-categorised case briefs
- [x] `selectScenario()` picks relevant scenarios based on user's practice areas
- [x] Professionals get "Different scenario" button on briefing screen
- [x] Students always see default scenarios (backward compatible)

## 5. Navigation Updates ✅

- [x] CPD Tracker link in sidebar for professional users only
- [x] CPD quick-link on profile page for mobile access
- [x] Dynamic nav sections built with useMemo
