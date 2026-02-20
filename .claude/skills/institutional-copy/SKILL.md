---
name: institutional-copy
description: Rewrite and standardise all product messaging and microcopy to feel like a serious UK legal institution, not social media. Use when reviewing copy, updating CTAs, rewriting marketing text, or preparing the homepage.
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[page-route or 'homepage' or 'all']"
---

# Institutional Copy Rewriter

Rewrite all product messaging and microcopy in the Ratio app to match the tone of a UK legal institution. Ratio is "The Digital Constitutional Society for UK Law Students" — not a social app.

## Target

If `$ARGUMENTS` specifies a route, rewrite copy for that page only.
If `$ARGUMENTS` is "homepage", focus on the landing page (`src/app/page.tsx` + `src/components/landing/`).
If `$ARGUMENTS` is empty or "all", audit and rewrite copy across all pages.

## Brand Voice Rules

### ALWAYS
- Users are "Advocates" (not users, members, or students)
- The app is "Ratio" or "the Society" (never "the app" or "the platform")
- Actions are institutional: "Join as an Advocate", "Table a Motion", "File a Case"
- Tone: calm, authoritative, restrained. Like a constitutional document.
- Use UK English (colour, analyse, organise, defence, centre)
- Use legal terminology accurately (ratio decidendi, obiter dicta, IRAC)
- Keep sentences under 25 words for mobile readability

### NEVER
- Exclamation marks (zero tolerance)
- Emoji in UI copy (icons are Lucide SVGs)
- Hype language: "amazing", "awesome", "powerful", "game-changing", "revolutionary"
- Social media language: "follow back", "trending", "viral", "content"
- Gamification noise: "unlock", "level up", "streak bonus", "XP"
- Informal: "hey", "yo", "check it out", "stuff"
- Sales pressure: "limited time", "don't miss out", "sign up now"

### CTA Library
Use these standard CTAs throughout the app:

| Context | CTA Text | Style |
|---------|----------|-------|
| Primary signup | "Join as an Advocate" | Gold filled |
| Login | "Sign In" | Gold filled |
| Start practice | "Begin Session" | Gold filled |
| View more | "View All" or "View [noun]" | Text link gold |
| Create | "Propose Motion" / "File Case" / "Create Session" | Gold filled |
| Export | "Export Portfolio" | Outlined |
| Follow | "Follow" | Gold filled |
| Unfollow | "Following" (hover: "Unfollow") | Outlined |

### Microcopy Patterns

**Empty states**: "[Noun] will appear here once [condition]."
- "Sessions will appear here once you create or join one."
- "Notifications will appear here as activity occurs."

**Confirmations**: "Your [noun] has been [past participle]."
- "Your motion has been tabled."
- "Your vote has been recorded."

**Errors**: "[What happened]. [What to do]."
- "Session could not be created. Check your connection and try again."

**Disclaimers**: "AI-generated analysis. Always verify against primary sources."

## Output Format

Use the template in [templates/copy-report.md](templates/copy-report.md).

For each page:
1. List every piece of copy that violates the brand voice
2. Provide the replacement copy
3. Note the file and line number
4. Apply the changes directly if writing access is available

## Homepage Clarity Pack

When targeting the homepage, ensure:
1. **Headline**: "The Digital Constitutional Society for UK Law Students."
2. **Subtext**: "Practice advocacy. Build your record. Govern your community."
3. **Primary CTA**: "Join as an Advocate"
4. **3-Step flow**: Verify → Join Chamber → Contribute
5. **Clarity line**: "Membership is limited to verified UK law students and alumni associates."
6. **No more than 1 primary CTA visible above the fold**
7. **No exclamation marks anywhere on the page**
