# UI Issues Log — Screenshot Capture Session
**Date**: 2026-02-23
**Source**: Production site (ratiothedigitalcourtsociety.com)
**Commit**: 5eab169 (main, post-merge of PRs #7, #8, #9)

## Issues Observed

### 1. TheClerk Overlay on Law Book Cards
- **Page**: /law-book (mobile)
- **Severity**: Minor
- **Description**: The floating "Clerk" help button overlaps the bottom-right of the Criminal Law card description text on the initial viewport. Not blocking but slightly distracting in screenshots.
- **Suggestion**: Consider z-index layering or auto-hide Clerk button when scrolling module grids.

### 2. Category Tabs Horizontal Scroll Not Obvious
- **Page**: /law-book (375px)
- **Severity**: Minor
- **Description**: The "Academic" category tab is cut off at 375px width. No scroll indicator (fade or arrow) hints at horizontally scrollable tabs.
- **Suggestion**: Add a subtle right-fade gradient or scroll-snap indicator for the category filter row.

### 3. Empty States Show Correctly
- **Pages**: All authenticated pages with no data (sessions, community, library, etc.)
- **Severity**: None (positive)
- **Description**: Premium empty states from PR #8 render correctly across both mobile viewports. Illustrations, CTAs, and copy all display as expected.

### 4. Bottom Nav Active State
- **Page**: All authenticated pages
- **Severity**: None (positive)
- **Description**: Bottom navigation correctly highlights the active tab with gold underline. Works at both 393px and 375px.

## Summary
- **Critical issues**: 0
- **Minor issues**: 2 (cosmetic only)
- **All pages render correctly at both mobile viewports**
