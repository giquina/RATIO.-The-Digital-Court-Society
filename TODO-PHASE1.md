# Phase 1 TODO — Professional User Foundation

> **Status:** In Progress
> **Started:** 2026-02-25
> **Target:** 1-2 weeks

---

## Backend (Convex)

- [ ] **Schema update** — Add optional fields to `profiles` table:
  - `userType`: `"student"` | `"professional"` (default: `"student"` for backward compat)
  - `professionalRole`: e.g. `"Barrister"`, `"Solicitor"`, `"Pupil"`, `"Paralegal"`
  - `firmOrChambers`: optional string (name of their firm or chambers)
  - `practiceAreas`: optional array of strings

- [ ] **createProfile mutation** — Accept new optional args:
  - `userType`
  - `professionalRole`
  - `firmOrChambers`
  - `practiceAreas`
  - Make `university` and `universityShort` optional (professionals won't have one)
  - Set sensible defaults: university = "Independent" for professionals

- [ ] **Profile queries** — Ensure `myProfile`, `getProfile`, etc. return new fields without breaking

---

## Constants

- [ ] **PROFESSIONAL_ROLES** — Add to `src/lib/constants/app.ts`:
  - Barrister, Solicitor, Solicitor Advocate, Pupil (Pupillage Applicant),
    Paralegal, Legal Executive, SQE Candidate, BPC Candidate, Academic, Other

- [ ] **PRACTICE_AREAS** — Add to `src/lib/constants/app.ts`:
  - Criminal, Commercial, Family, Employment, Property, Public,
    Human Rights, Immigration, Personal Injury, Tax, IP, Environmental, etc.

---

## Onboarding Redesign

- [ ] **New Step 0: "I am a..."** — Before everything else, ask:
  - 🎓 "Law Student" → existing 4-step flow
  - ⚖️ "Legal Professional" → new professional flow
  - Clean, two-card selection. Matches existing design language.

- [ ] **Professional flow (4 steps):**
  1. **Role** — Select from PROFESSIONAL_ROLES
  2. **Firm/Chambers** — Optional text input (name of firm or chambers)
  3. **Practice Areas** — Multi-select from PRACTICE_AREAS
  4. **Chamber** — Same as students (Gray's, Lincoln's, Inner, Middle)

- [ ] **Progress bar update** — Shows different labels based on path:
  - Student: University → Year → Modules → Chamber
  - Professional: Role → Firm → Practice Areas → Chamber

- [ ] **Step count stays at 4** (after the initial type selection)

---

## Profile Display Updates

- [ ] **Profile page** — If `userType === "professional"`:
  - Show role instead of university (e.g. "Barrister" not "Birkbeck")
  - Show firm/chambers if provided
  - Show practice areas as tags

- [ ] **Settings page** — Account section:
  - Show "Role" instead of "University" for professionals
  - Show firm/chambers if provided

---

## Testing Checklist

- [ ] Existing student sign-up still works identically
- [ ] New professional can complete onboarding
- [ ] Professional profile displays correctly
- [ ] Settings page shows correct info for both types
- [ ] Skip onboarding still works for both types
- [ ] LocalStorage persistence works for both flows
- [ ] No breaking changes to existing profiles (all new fields optional)

---

## Notes

- All new schema fields are `v.optional()` — zero migration needed
- Existing profiles implicitly have `userType: undefined` which we treat as `"student"`
- The onboarding branching is purely frontend — the mutation just accepts more optional fields
- No pricing changes in this phase — professionals see the same plans as students for now
