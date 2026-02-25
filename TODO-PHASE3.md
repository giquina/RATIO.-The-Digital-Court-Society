# Phase 3 TODO — Professional-Specific Value

> **Status:** In Progress
> **Started:** 2026-02-25
> **Target:** 4-6 weeks

---

## 1. AI Persona Adaptation

- [ ] Add `userContext` (userType, role, practiceAreas) to chat/feedback request schemas
- [ ] Pass user context from frontend to AI routes
- [ ] Create professional prompt modifiers that adjust judge behaviour:
  - Professionals: addressed by role ("Counsel" for barristers, more formal, CPD-oriented feedback)
  - Students: gentler pedagogical tone (current behaviour, unchanged)
- [ ] Inject user context into system prompts dynamically
- [ ] Feedback route: adjust assessment framing based on userType

## 2. CPD Tracking

- [ ] Add `cpdEntries` table to Convex schema
- [ ] Create CPD tracking mutations (logEntry, getEntries, getSummary)
- [ ] Auto-log AI sessions as CPD entries (triggered after feedback)
- [ ] Create `/cpd` page with dashboard showing:
  - Total CPD hours this year
  - Breakdown by activity type (AI practice, live moots, research)
  - Progress bar toward annual target (12 hours BSB / varies SRA)
- [ ] Gate CPD page behind professional_plus plan

## 3. Professional Portfolio Branding

- [ ] Update portfolio header to show professional title and firm instead of university/year
- [ ] Update portfolio export metadata (when PDF export is built)
- [ ] Show practice areas as tags on portfolio

## 4. Practice Area-Specific AI Scenarios

- [ ] Enhance topic engine with practice-area-aware case suggestions
- [ ] When a professional selects their practice area, suggest relevant scenarios
- [ ] Add professional-specific case scenarios (e.g., "Pupillage Interview Mock" mode)

## 5. Navigation Update

- [ ] Add CPD link to sidebar for professional users
- [ ] Conditionally show/hide based on userType

---

## Testing Checklist

- [ ] Student AI experience unchanged
- [ ] Professional AI sessions use adapted prompts
- [ ] CPD entries auto-created from AI sessions
- [ ] CPD dashboard displays correct totals
- [ ] CPD page gated behind professional_plus
- [ ] Portfolio shows professional branding
- [ ] Sidebar shows CPD link for professionals only
