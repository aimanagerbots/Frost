# Test & Learn: site-scrape Skill
> Target: https://wa.cultiverapro.com | Date: 2026-03-11

## What We Tested

The `site-scrape` skill — a Playwright MCP-based deep scraper that should authenticate into an SPA, click through every page, screenshot every UI state, extract design tokens, and generate a rebuild plan.

**Two attempts were made:**
1. **Attempt 1** — Used a standalone Playwright script (`scripts/scrape-app.mjs`) as a fallback since MCP wasn't connected
2. **Attempt 2** (this session) — Tried to invoke the skill properly via `/site-scrape`, but Playwright MCP tools still not available

---

## Results from Attempt 1 (standalone script)

| Metric | Value | Assessment |
|--------|-------|------------|
| Pages discovered | 26 | OK — found all 6 modules |
| Screenshots taken | 219 | High volume, low signal |
| Navigation edges | 191 | Extremely noisy |
| Sub-pages with content | 8 (31%) | POOR |
| Sub-pages BLANK | 18 (69%) | FAILURE |
| Interactive states captured | 30/page avg | Noisy — mostly duplicates |
| Design tokens extracted | Colors only | INCOMPLETE — no typography |
| Data models inferred | None | MISSING |
| Output matches template | Partially | INDEX.md missing sections, REBUILD_PLAN hollow |

### What Worked
- Login/authentication flow worked correctly
- Module landing pages (6 of them) captured with full content
- Color extraction produced usable palette (40 colors with counts)
- Component census gave rough inventory (cards: 1771, modals: 366, badges: 312)
- Output folder structure was clean and organized

### What Failed

#### 1. SPA Sub-Page Navigation (Critical)
- **Problem:** 18 of 26 pages came back completely blank
- **Root cause:** Script navigated by constructing URLs directly (e.g., `/#/accounts`, `/#/orders`). Cultivera uses Angular hash routing where each module is a separate sub-app (`/sales#/`, `/inventory/#/`, `/fulfillment#/`). Navigating to `/#/accounts` loads the root app shell, not the Sales module's Accounts page.
- **Fix needed:** Must click sidebar items from within each loaded module, never construct URLs

#### 2. Chrome Element Duplication (Major)
- **Problem:** Top bar, notification dropdown, user menu, and module switcher captured on EVERY page as separate interactive states
- **Impact:** 60-70% of the 219 screenshots are duplicates of the same navigation chrome
- **Fix needed:** Identify "chrome" elements once, exclude from per-page state capture. Deduplicate by element selector.

#### 3. Noisy Filenames (Major)
- **Problem:** Files named by truncated accessible text: `states/000-dropdown-Sales-Grow-Analytics-Sales-Inventory-Management-Fulfillment-Configurati.png`
- **Impact:** Unreadable, impossible to find specific states
- **Fix needed:** Use semantic names based on element role + context: `states/module-switcher-open.png`, `states/user-menu-open.png`

#### 4. Navigation Graph is Unusable (Major)
- **Problem:** 191 edges, most are `/ | toggle: "" | / [toggle open]` — meaningless noise
- **Impact:** The nav graph should be the most valuable output (shows app structure) but it's worthless
- **Fix needed:** Only record edges that change the URL or load new content. Filter out same-page toggles/dropdowns.

#### 5. Design System Extraction Incomplete (Moderate)
- **Problem:** Colors extracted but "Likely Role" column is empty. No typography data at all.
- **Impact:** Can't auto-generate CSS variables without role mapping
- **Fix needed:** Auto-assign roles by usage count + context (highest-count dark color = bg, teal = primary, etc.). Run typography extraction JS on every page.

#### 6. REBUILD_PLAN is Hollow (Moderate)
- **Problem:** Phase B lists 18 "simple pages" that are all blank screenshots with `Components: form, Interactive states: 0`
- **Impact:** Useless as a rebuild guide — gives no information about what those pages actually contain
- **Fix needed:** Only include pages with actual content. Flag blank pages as "needs re-scrape" rather than pretending they're simple.

#### 7. DATA_MODELS.md Missing Entirely (Moderate)
- **Problem:** Skill describes Phase 6 (Data Model Inference) but it was never executed
- **Impact:** Missing the most valuable analytical output
- **Fix needed:** Parse table headers from snapshots. The script saw table columns like "PARTNER NAME | ORDER # | MANIFEST DATE | STATUS" but never extracted them into entities.

#### 8. No Fallback When Playwright MCP Unavailable (Blocker for Attempt 2)
- **Problem:** Skill says "STOP and tell the user to restart" — full stop, zero value delivered
- **Impact:** Complete blocker. User has to restart Claude Code, re-enter context, re-invoke
- **Fix needed:** Add degraded modes — WebFetch for basic HTML, or auto-launch standalone script as fallback

---

## Skill Design Issues

### Structural Problems
1. **No setup guide** — skill says "Playwright MCP must be connected" but never explains how to install/configure it. Should include exact MCP config JSON.
2. **No progress reporting** — for a crawl that takes 10+ minutes, user has no idea how far along it is
3. **No resume capability** — if it fails halfway, must start over from scratch
4. **Credential handling is vague** — "look for variables matching the domain name" is fragile. Should explicitly ask or accept `--email` / `--password` args.
5. **No scope control** — skill says "Scope (optional)" but there's no mechanism to limit to specific modules

### Output Quality Problems
1. **INDEX.md doesn't follow its own template** — missing App Architecture section, no Component Census table
2. **DESIGN_SYSTEM.md** — no typography, no spacing, no component pattern details
3. **REBUILD_PLAN.md** — lists blank pages as buildable tasks, no data models section filled in
4. **Navigation graph** — JSON exists but is noise, not signal
5. **No quality gate** — skill should validate its own output before declaring done

---

## Recommendations for Skill v2

### Priority 1: Fix the Core Crawl
- [ ] Navigate by clicking, not by URL construction
- [ ] Detect "blank page" (no meaningful content after load) and flag it
- [ ] Deduplicate chrome elements — capture once, skip on subsequent pages
- [ ] Cap interactive states at 10 per page, prioritize unique element types
- [ ] Use semantic filenames

### Priority 2: Add Fallback Modes
- [ ] If Playwright MCP unavailable, offer to run standalone script
- [ ] If standalone script unavailable, use WebFetch for basic HTML analysis
- [ ] Always produce SOMETHING, even if degraded

### Priority 3: Improve Output Quality
- [ ] Auto-assign color roles by usage patterns
- [ ] Actually run typography extraction JS
- [ ] Parse table headers into DATA_MODELS.md
- [ ] Validate output against templates before finishing
- [ ] Add "confidence" scores to each page (full content vs partial vs blank)

### Priority 4: UX Improvements
- [ ] Add progress reporting (module X of Y, page N of M)
- [ ] Support `--modules "Sales,Grow"` scope limiting
- [ ] Support resume from partial crawl
- [ ] Include Playwright MCP setup instructions in prerequisites
- [ ] Save crawl state so it can be resumed after session restart

---

## Score Card

| Dimension | Score | Notes |
|-----------|-------|-------|
| Authentication | 9/10 | Login worked perfectly |
| Page Discovery | 4/10 | Found modules but missed sub-pages |
| Screenshot Quality | 3/10 | 70% duplicates or blanks |
| Design Token Extraction | 4/10 | Colors yes, typography no, roles no |
| Data Model Inference | 0/10 | Never executed |
| Output Document Quality | 3/10 | Doesn't match own templates |
| Navigation Mapping | 2/10 | Noise overwhelms signal |
| Error Handling | 1/10 | No fallback, no resume, no degraded mode |
| Overall | 3/10 | Needs significant rework before production use |

---

## Next Steps
1. Ensure Playwright MCP is configured and connected
2. Rewrite skill with the fixes above (v2)
3. Re-scrape wa.cultiverapro.com with v2
4. Compare outputs to validate improvements
