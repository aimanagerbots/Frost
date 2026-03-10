# Frost Plans Archive

> Permanent record of every plan Claude presents during development sessions.
> Every plan is logged — accepted, rejected, or modified — so you can review decision history.
> Newest entries at the top (reverse-chronological), separated by `---`.
> Vault mirror: `Frost-Vault/01-Project/Plans-Log.md`

---

## 2026-03-10 — Frost SEO Research Execution Plan
**Task:** Research a robust SEO plan for Frost — how a Claude Code bot would use maximum skill orchestration to generate a comprehensive SEO research document
**Status:** accepted
**User Feedback:** none

### Plan
Full plan written to `SEO_RESEARCH_EXECUTION_PLAN.md` (516 lines). Summary:

1. **Business Context**: Frost is a WA producer/processor selling into ~471 capped retail stores. Can't sell direct — SEO drives consumers to store locator → dispensary online ordering → retail sell-through → reorders from Frost.
2. **Regulatory Framework**: WAC 314-55-155 allows product pages, store locators, educational content, effect descriptors. Prohibits health claims, out-of-state targeting, giveaways.
3. **5-Tier Keyword Strategy**: Branded (low KD) → Product+Local → Strain Names (90+ pages) → Educational → Competitor/Dispensary Names
4. **17-Agent Execution Architecture across 5 phases**:
   - Phase 1: 8 parallel research agents (regs, keywords, dispensaries, competitors, SERPs, content strategy, technical SEO, local SEO)
   - Phase 2: 3 parallel codebase analysis agents
   - Phase 3: 2 synthesis agents (keyword strategy, content calendar)
   - Phase 4: 1 assembly agent (final document)
   - Phase 5: 3 parallel review agents (compliance, feasibility, viability)
5. **Appendix A**: Raw research data from 4 completed agents — market numbers, competitor analysis, prioritized keyword list with volume/KD scores, blue ocean opportunities, platform landscape, regulatory summary
6. **Key findings**: Cannabis drinks (KD 8) = blue ocean; Leafly/Weedmaps losing -46% traffic; 7 strain keywords with KD <17 and 12K-40K monthly volume; programmatic strain×city pages = 720 indexable pages

---

## 2026-03-10 — Blog Page Redesign to Match Category Pages
**Task:** Make blog page look like the category browse pages — same header, search bar, button sizes, 5-up grid
**Status:** accepted
**User Feedback:** none

### Plan
1. Add `SearchInput` next to `FilterBar` in same flex row (matches category page layout)
2. Add story count ("X stories") like category pages show product count
3. Remove oversized featured post hero — all posts equal
4. Grid: 5-up on xl, 4 on lg, 3 on sm, 2 on mobile
5. Scale down `BlogPostCard` text sizes and change aspect ratio from 16:9 to 4:3 for narrower cards
6. Add search filtering on title, excerpt, author, and category

---

## 2026-03-10 — Password & Age Gate Persistence Changes
**Task:** Make password page and age gate show on every reload (no cookie/localStorage persistence)
**Status:** accepted (user later reverted cookie to 24hr maxAge)
**User Feedback:** User manually changed cookie back to `maxAge: 60 * 60 * 24` (24 hours)

### Plan
1. Age gate: Remove `localStorage` persistence, use in-memory `useState` only — shows fresh every page load
2. Password page: Remove `maxAge` from `site-auth` cookie (session cookie)
3. Splash layout: Clear `site-auth` cookie on every visit to `/`

---

## 2026-03-10 — Snowflake Logo Glow on Password & Age Gate Pages
**Task:** Make snowflake logo glow like the header on password and 21+ age gate pages
**Status:** accepted
**User Feedback:** none

### Plan
Add `logo-glow-img` CSS class (already defined in globals.css) to the `<Image>` elements in:
1. `apps/website/src/app/(splash)/page.tsx` — password page snowflake
2. `apps/website/src/components/layout/AgeGateModal.tsx` — age gate snowflake

---

<!-- Plans will be appended below this line, newest first -->
