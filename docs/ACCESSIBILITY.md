# Accessibility Statement

> **Project:** Ratio -- The Digital Court Society
> **Audience:** Contributors, users, auditors
> **Last updated:** 2026-02-23

---

## Target Standard

Ratio aims to conform to **WCAG 2.1 Level AA**. Accessibility is treated as a core requirement, not an afterthought.

## Current Status

Work in progress. The application is under active development and accessibility improvements are ongoing. The commitments below reflect both what is in place today and what is planned.

## What We Do Today

- Semantic HTML structure throughout the application (headings, landmarks, lists, buttons)
- Keyboard-navigable interface elements across all primary user flows
- `prefers-reduced-motion` respected for splash screens, page transitions, and animations
- Minimum 44px touch targets on all mobile interactive elements
- High contrast text -- light text (`#F2EDE6`) on dark navy backgrounds (`#0C1220`)
- Readable font sizes using a consistent scale (10px to 18px)
- System font stack with `font-sans` (DM Sans) for body text and `font-serif` (Cormorant Garamond) for headings
- Focus-visible indicators on interactive elements (buttons, links, inputs)
- Responsive layout that adapts from mobile to desktop without loss of content or functionality

## Known Gaps

The following areas have been identified as needing further work:

- Full screen reader testing has not yet been completed across major assistive technologies (NVDA, JAWS, VoiceOver)
- Some complex interactive components (moot room, AI practice interface) may have limited ARIA support
- Colour contrast ratios have not been formally audited across all component states (hover, focus, disabled)
- No skip-to-content link is implemented yet
- Dynamic content updates (real-time chat, live session events) may not consistently announce changes to screen readers

## Planned Improvements

- Comprehensive screen reader audit with NVDA, JAWS, and VoiceOver
- ARIA landmark regions (`banner`, `navigation`, `main`, `complementary`) for all page sections
- Skip-to-content navigation link on every page
- Alternative text for all informational images and icons
- Keyboard shortcuts for common actions (navigation, session controls, search)
- Live region announcements for dynamic content updates
- Formal colour contrast audit against WCAG AA thresholds (4.5:1 for normal text, 3:1 for large text)

## Reporting

If you encounter an accessibility barrier when using Ratio, please contact [mgiqui01@student.bbk.ac.uk](mailto:mgiqui01@student.bbk.ac.uk). Include a description of the issue, the page or feature involved, and the assistive technology you are using. All reports will be reviewed and addressed.
