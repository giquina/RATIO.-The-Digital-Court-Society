---
name: law-book-editorial
description: Define, review, or extend the Official Law Book feature — including content model, editorial workflow, versioning, citation policy (OSCOLA), and legal risk controls. Use when working on the Law Book feature, editorial governance, or content quality.
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[spec or review or roadmap or citations]"
---

# Law Book Editorial System

The Official Law Book is a student-built, peer-reviewed, version-controlled legal knowledge base. It is the intellectual backbone of Ratio — not a textbook replacement, but a constitutional companion.

## Mode

- `$ARGUMENTS` = "spec": Produce the full feature specification
- `$ARGUMENTS` = "review": Audit existing Law Book code for completeness
- `$ARGUMENTS` = "roadmap": Generate a 30-day implementation roadmap
- `$ARGUMENTS` = "citations": Review and validate OSCOLA citation format compliance

## Content Model (7 Convex Tables)

Already defined in `convex/schema.ts`:

1. **lawBookModules** — Top-level subjects (Contract, Tort, Criminal, etc.)
2. **lawBookTopics** — Individual knowledge entries within modules
3. **lawBookVersions** — Version history per topic (every edit = new version)
4. **lawBookContributions** — Track who contributed what (create/edit/review/cite)
5. **lawBookReviews** — Peer review workflow with feedback
6. **lawBookCitations** — OSCOLA-formatted citations per entry
7. **editorialBoard** — Governance for who can approve content

## IRAC Content Structure

Every Law Book entry MUST follow:

1. **Issue** — What legal question does this address?
2. **Rule** — What is the governing law? (statute + case law with citations)
3. **Application** — How has this been applied? (key cases with ratio decidendi)
4. **Conclusion** — What is the current state of the law?
5. **Citations** — Mandatory OSCOLA-formatted references (minimum 2 primary sources)

## OSCOLA Citation Format

All citations must comply with the Oxford Standard for the Citation of Legal Authorities (OSCOLA 4th edition):

### Cases
- UK neutral citation: `R v Brown [2024] UKSC 12`
- Law reports: `Donoghue v Stevenson [1932] AC 562 (HL)`
- Format: *Parties* [Year] Report Volume Page (Court)

### Legislation
- Primary: `Human Rights Act 1998, s 3(1)`
- Secondary: `Civil Procedure Rules 1998, SI 1998/3132, r 1.1`

### Secondary Sources
- Books: `A Smith, *The Law of Contract* (5th edn, OUP 2023) 142`
- Journal articles: `J Bloggs, 'Title' (2024) 140 LQR 234, 240`

### Validation Rules
- Case names must be italicised in markdown (*Party v Party*)
- Year must be in square brackets [YYYY] or round brackets (YYYY)
- Page/paragraph pinpoints required where citing specific text
- Minimum 2 primary sources (cases or statutes) per entry

## Editorial Governance

### Publication Flow
1. **Draft** — Author creates or edits a topic
2. **Peer Review** — 2 independent reviewers assess quality
3. **Editor Approval** — Module editor or senior editor approves
4. **Published** — Live on the Law Book

### Quality Gates
- IRAC structure complete (all 4 sections)
- Minimum 2 primary source citations
- OSCOLA format validation (automated where possible)
- No reproduction of copyrighted textbook content
- Original student analysis only
- Disclaimer present: "Student-generated analysis. Not legal advice."

### Contribution Points
| Action | Points |
|--------|--------|
| Create new topic | 10 |
| Edit existing topic | 5 |
| Peer review | 3 |
| Add citation | 1 |

### Editorial Board Roles
- **Chief Editor**: Overall quality oversight, final disputes
- **Senior Editor**: Module-level oversight, reviewer assignment
- **Editor**: Topic-level review and approval
- **Contributor**: Any verified Advocate

## Legal Risk Controls

1. **Crown Copyright**: Case judgments usable under Open Government Licence (OGL)
2. **No Reproduction**: Original student analysis only, no textbook copying
3. **Database Rights**: Structured data compilations may have database rights
4. **DMCA/Takedown**: Process for flagged content
5. **Disclaimer**: Every page shows "Student-generated analysis. Not legal advice."
6. **Moderation**: AI-assisted citation checking + human editorial review

## Pages (Already Created)

| Route | File | Purpose |
|-------|------|---------|
| `/law-book` | `src/app/(app)/law-book/page.tsx` | Module index |
| `/law-book/[module]` | `src/app/(app)/law-book/[module]/page.tsx` | Topic list |
| `/law-book/[module]/[topic]` | `src/app/(app)/law-book/[module]/[topic]/page.tsx` | Reading view |
| `/law-book/contribute` | `src/app/(app)/law-book/contribute/page.tsx` | Create/edit topic |
| `/law-book/review-queue` | `src/app/(app)/law-book/review-queue/page.tsx` | Pending reviews |
| `/law-book/changelog` | `src/app/(app)/law-book/changelog/page.tsx` | Recent changes |
| `/law-book/editorial-policy` | `src/app/(app)/law-book/editorial-policy/page.tsx` | Guidelines |

## Output

Produce output following the template in [templates/law-book-spec.md](templates/law-book-spec.md).

For "review" mode, check every page and Convex function against the specification above and report gaps.

For "roadmap" mode, produce a 30-day plan with weekly milestones.

For "citations" mode, validate all citation strings in the codebase against OSCOLA rules.
