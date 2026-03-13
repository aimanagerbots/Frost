---
name: site-scrape
description: Deep interactive web app scraper that uses Playwright MCP to log into authenticated SPAs, navigate every page by clicking through menus, screenshot every UI state (dropdowns, modals, tabs, sidebars), extract design tokens and data models, and generate a comprehensive rebuild plan. Use this skill whenever the user wants to scrape a website, reverse-engineer a web app, clone a site's design, research a competitor's UI, extract design tokens from a live app, or prepare rebuild documentation. Also trigger when the user mentions "scrape", "screenshot a site", "reverse engineer", "clone this app", or "rebuild plan".
---

# Site Scrape v3 — Deep Interactive Web App Scraper

Authenticated deep-crawl of any web application using Playwright MCP browser tools. Produces screenshots, design tokens, data models, navigation maps, and a task-by-task rebuild plan.

## Prerequisites

**Primary: Playwright MCP plugin** (browser_navigate, browser_click, browser_take_screenshot tools available)

**Setup instructions** (if not already configured):
Add to your MCP config (`.claude/mcp.json` or Claude Code settings):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/playwright-mcp", "--viewport-size=1440x900"]
    }
  }
}
```
Then restart Claude Code so the tools connect.

**Fallback modes** (if Playwright MCP is unavailable):
1. **Standalone script** — check if `scripts/scrape-app.mjs` exists and run it via Bash
2. **WebFetch mode** — use WebFetch tool for basic HTML analysis (no screenshots, no interaction, but still extracts links, text, and basic structure)
3. If none of the above work, tell the user what's needed and stop

## Quick Check

Before starting, verify you have access to these tools:
- `browser_navigate`
- `browser_click`
- `browser_take_screenshot`
- `browser_snapshot`
- `browser_type`

If ANY are missing, try fallback modes (see Prerequisites). Only STOP if all fallbacks fail.

## Inputs

The user provides:
1. **URL** — the target web app
2. **Credentials** (if authenticated) — email/password, or point to `.env` vars. If not provided, check `.env` for variables matching the domain name (e.g., `CULTIVERA_EMAIL`, `CULTIVERA_PASSWORD`). If no credentials found, ask the user explicitly.
3. **Scope** (optional) — specific module names to limit the crawl (e.g., `--modules "Sales,Grow"`), or "everything" (default)
4. **Module flag** (swarm mode) — `--module [Name]` scopes the entire crawl to a single named module. Used when running as a parallel agent in a swarm.

## Swarm Mode — Single-Module Parallel Agent

When invoked with `--module [Name]`, this skill runs as a focused single-module agent. Multiple instances can run simultaneously in separate terminal windows — each Claude Code session gets its own independent Playwright browser, so there is no conflict.

### When to use swarm mode
- 3+ modules remain unscraped
- You want to parallelize across terminal windows
- Each agent has a clear module assignment

### Module-scoped workflow (phases 1 → 6, single module only)

1. **Authenticate** (Phase 1 — same as full crawl)
2. **Skip full nav discovery** — go directly to the assigned module via the module switcher
3. **Run Phase 3** (deep crawl) for this module only — all sidebar pages, all drill-downs
4. **Run Phase 4** (interactive states) for this module only — all modals, tabs, dropdowns
5. **Run Phase 5** (design tokens) — run JS snippets on 2+ pages within this module
6. **Run Phase 6** (data models) — extract entities from this module's tables and forms
7. **Write module output:**
   - Screenshots to `[module]/` and `[module]/states/`
   - `[module]/page-analysis.md` — components, fields, enums found
   - Update `crawl-state.json`: set `swarmAgents.[module].status = "complete"`
8. **Do NOT generate** consolidated `INDEX.md`, `REBUILD_PLAN.md`, or `DESIGN_SYSTEM.md` — those are assembled by a merge agent after all modules complete

### Module switcher labels (Cultivera Pro)
| Module flag | Switcher label | Navigation method |
|---|---|---|
| `--module Sales` | Sales | Click module switcher |
| `--module Grow` | Grow | Click module switcher |
| `--module Analytics` | Analytics | Click module switcher |
| `--module Inventory` | Inventory Management | Click module switcher |
| `--module Fulfillment` | Fulfillment | Click module switcher |
| `--module Configuration` | — | Direct URL: `https://wa.cultiverapro.com/configuration#/[route]` |

### Merge step (run after ALL module agents complete)
After all swarm agents finish, run one final Claude Code session with the prompt:
> "Read all `[module]/page-analysis.md` files under `research/wa.cultiverapro.com/[date]/`, then generate the consolidated `DATA_MODELS.md`, `DESIGN_SYSTEM.md`, `INDEX.md`, and `REBUILD_PLAN.md` following the output templates."

## Output Structure

All output goes to `research/[domain]/[YYYY-MM-DD]/`:

```
research/[domain]/[YYYY-MM-DD]/
  INDEX.md              — complete site tree with navigation map (MUST match index-template.md)
  DESIGN_SYSTEM.md      — colors WITH roles, typography, spacing, component inventory
  DATA_MODELS.md        — inferred entities from table headers and form fields
  REBUILD_PLAN.md       — task-by-task rebuild guide (MUST match rebuild-plan-template.md)
  navigation-graph.json — machine-readable nav edges (content-changing only, no noise)
  crawl-state.json      — progress tracker for resume capability
  [module-name]/
    overview.png             — main page screenshot
    [sub-page-name].png      — each sub-page (semantic name, not URL fragment)
    states/
      [semantic-name].png    — e.g., module-switcher-open.png, add-order-modal.png
    page-analysis.md         — per-page brief with components, colors, data
```

## Progress Reporting

Report progress to the user at these milestones:
- After login: "Authenticated successfully. Discovering navigation..."
- After nav discovery: "Found N modules with M total sub-pages. Starting crawl..."
- Per module: "Module X of Y: [name] — N sub-pages to capture"
- After all modules: "Crawl complete. Extracting design tokens..."
- After output generation: "Done. N pages captured, M screenshots, L data models inferred."

Save progress to `crawl-state.json` after each module completes so the crawl can be resumed if interrupted.

## Workflow

### Phase 1: Authentication

1. Read credentials from `.env` file first. Look for `[DOMAIN]_EMAIL` / `[DOMAIN]_PASSWORD` patterns.
2. If no `.env` credentials found, ask the user before proceeding.
3. Use `browser_navigate` to go to the login URL.
4. Use `browser_snapshot` to find the login form fields.
5. Use `browser_type` to enter credentials.
6. Use `browser_click` to submit the form.
7. Use `browser_wait_for` to confirm the app loaded (look for dashboard content, not just any DOM change).
8. Take a post-login screenshot with `browser_take_screenshot`.

### Phase 2: Navigation Discovery

1. Use `browser_snapshot` to get the full accessibility tree of the app shell.
2. Identify and record the navigation structure:
   - **Top bar / module switcher** — the main module navigation
   - **Sidebar** — sub-pages within each module
   - **User menu** — profile, settings, notifications
3. **Capture chrome elements ONCE** — screenshot the top bar, user menu, and notification panel. Tag these as `chrome/` screenshots. Do NOT re-capture these on every page.
4. Write the discovered navigation to `navigation-graph.json`.
5. Report to user: "Found N modules: [list]. Each has M avg sub-pages."

**CRITICAL — SPA Navigation Rules:**
- NEVER construct URLs and navigate directly. Many SPAs (Angular, React) use hash routing or separate sub-apps where direct URL navigation breaks the app.
- ALWAYS click the top-bar module switcher to change modules.
- ALWAYS click sidebar items to navigate within a module.
- Wait for content to load after each click (use `browser_wait_for` with 3-5s timeout).
- Use `browser_snapshot` after navigation to confirm new content loaded.
- If a page loads blank (no meaningful content beyond the chrome), flag it and try clicking from the parent module again.

### Phase 3: Module-by-Module Deep Crawl

For each module discovered in Phase 2:

1. **Report progress:** "Crawling module X of Y: [name]"
2. **Switch to the module** by clicking its top-bar link.
3. **Wait for load** — use `browser_snapshot` to confirm module-specific content appeared (not just chrome).
4. **Screenshot the landing page** — save as `[module]/overview.png`.
5. **Analyze the page** via `browser_snapshot`:
   - What components are present? (tables, charts, cards, forms, lists)
   - What are the table column headers? (record these — they become data model fields)
   - What form fields exist? (record these too)
6. **Click each sidebar sub-page:**
   - Use `browser_snapshot` to find sidebar links within this module.
   - Click each one, wait for load.
   - **Blank page check:** If `browser_snapshot` shows only chrome elements (nav, header) and no content area, flag as "blank — needs click-based navigation" and skip.
   - Screenshot as `[module]/[semantic-sub-page-name].png` (e.g., `sales/accounts.png` not `sales/2.png`).
   - Analyze with `browser_snapshot`.
   - **Snapshot size guard:** If `browser_snapshot` returns >50K chars, the result is saved to an external file — do NOT try to parse it inline. Proceed directly with `browser_evaluate` calls on the loaded page.
7. **Drill-down sweep** — for every list/table page that has at least one data row:
   - Click the FIRST visible row link or row itself.
   - Wait for the detail page to load.
   - Screenshot as `[module]/states/[entity]-detail.png`.
   - Record all visible field labels and values.
   - Navigate back with `browser_navigate_back`.
   - Document the trail in `navigation-graph.json`: `{ from, to, trigger: "row click", screenshot }`.
8. **Save crawl state** after each module completes — write `crawl-state.json` immediately, not at the end of the full crawl.

### Phase 4: Interactive State Capture

For each page with actual content, capture unique interactive states. **IMPORTANT: Skip chrome elements** (top bar, user menu, notifications) — they were captured once in Phase 2.

**Cap at 10 unique states per page.** Prioritize in this order:
1. **Modals** — click "Add", "New", "Create", "Edit" buttons → screenshot → record ALL visible form field labels (these are write-side entity fields) → close with Escape
2. **Tabs** — click each tab → screenshot the content area only
3. **Filters/dropdowns and select elements** — click each to open → record ALL visible option values (these become enum values in data models) → close
4. **Expandable sections** unique to this page → expand → screenshot

**Skip these (they're chrome, not content):**
- Module switcher dropdown
- Notification bell dropdown
- User profile menu
- Company switcher

**Semantic filenames:** Name files by what they show, not by element text:
- `states/add-order-modal.png` (not `states/000-button-Add-New-Order.png`)
- `states/status-filter-open.png` (not `states/003-dropdown-3.png`)
- `states/batch-details-tab.png` (not `states/toggle-22.png`)

**Recovery:** After each interaction, `browser_snapshot` to verify you're still on the same page. If navigated away, click back to the original page.

### Phase 5: Design Token Extraction

Run these JavaScript snippets via `browser_evaluate` on **3+ different pages** (not just one), then aggregate results.

```javascript
// Colors — run on each page, aggregate
(() => {
  const colors = {};
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    for (const prop of ['backgroundColor', 'color', 'borderTopColor', 'borderBottomColor']) {
      const match = s[prop].match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const hex = '#' + [match[1],match[2],match[3]].map(c => (+c).toString(16).padStart(2,'0')).join('').toUpperCase();
        if (hex !== '#000000' && hex !== '#FFFFFF') colors[hex] = (colors[hex]||0) + 1;
      }
    }
  }
  return Object.entries(colors).sort((a,b) => b[1]-a[1]).slice(0, 30);
})()
```

```javascript
// Typography — MUST run this, it was skipped in v1
(() => {
  const map = new Map();
  for (const el of document.querySelectorAll('*')) {
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const s = getComputedStyle(el);
    const key = `${s.fontFamily.split(',')[0].trim()}|${s.fontSize}|${s.fontWeight}|${s.lineHeight}|${s.letterSpacing}`;
    map.set(key, (map.get(key)||0) + 1);
  }
  return [...map.entries()].sort((a,b) => b[1]-a[1]).slice(0, 20)
    .map(([k,c]) => { const [f,sz,w,lh,ls] = k.split('|'); return {font:f,size:sz,weight:w,lineHeight:lh,letterSpacing:ls,count:c}; });
})()
```

```javascript
// Spacing patterns
(() => {
  const spacings = {};
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    for (const prop of ['padding', 'margin', 'gap']) {
      const v = s[prop];
      if (v && v !== '0px') spacings[v] = (spacings[v]||0) + 1;
    }
  }
  return Object.entries(spacings).sort((a,b) => b[1]-a[1]).slice(0, 20);
})()
```

**Auto-assign color roles** based on usage patterns:
- Highest-count dark color (< #333) → `background`
- Highest-count mid-dark (#333-#666) → `surface` / `card`
- Highest-count light color (> #CCC) → `text-primary` (for dark themes) or `background` (for light themes)
- Highest-count saturated color → `primary`
- Green-ish saturated → `success`
- Red-ish saturated → `error`/`danger`
- Amber/yellow-ish → `warning`

### Phase 6: Data Model Inference

**This phase is MANDATORY — do not skip it.**

From the snapshots collected during Phase 3:

1. **Table headers** → entity fields with inferred types:
   - "ORDER #" → `orderNumber: string`
   - "MANIFEST DATE" → `manifestDate: Date`
   - "STATUS" → `status: enum` (collect all observed values)
   - "TOTAL" or "$" amounts → `total: number`
2. **Form fields** → entity attributes (input type → field type)
3. **Dropdown options** → enum values (list all options seen)
4. **Filter bar options** → queryable dimensions
5. **Card content** → entity summary shape
6. **Relationships** — infer from navigation patterns (clicking an Account shows its Orders → Account hasMany Orders)

Write to `DATA_MODELS.md` with:
- Entity name
- Fields with types
- Enum values where observed
- Relationships between entities
- Source (which page/screenshot the field was found on)

### Phase 7: Generate Output Documents

Read reference docs for output format:
- `references/index-template.md` — INDEX.md format
- `references/rebuild-plan-template.md` — REBUILD_PLAN.md format

**VALIDATION GATE:** Before declaring done, verify:
- [ ] INDEX.md has App Architecture section filled in
- [ ] INDEX.md has Component Census table
- [ ] INDEX.md has Navigation Graph (content-changing edges ONLY, no same-page toggles)
- [ ] DESIGN_SYSTEM.md has colors WITH "Likely Role" filled in
- [ ] DESIGN_SYSTEM.md has typography section (not empty)
- [ ] DATA_MODELS.md exists and has at least 1 entity
- [ ] REBUILD_PLAN.md does NOT list blank pages as buildable tasks
- [ ] REBUILD_PLAN.md has Data Models section filled in
- [ ] No page folder contains only blank screenshots

**INDEX.md** — Complete site tree:
- App Architecture section (framework, routing, UI library, auth)
- Every module, every sub-page, every interactive state
- Screenshot file paths for each
- Component Census table (component type | count | found on)

**DESIGN_SYSTEM.md** — Aggregated tokens:
- Color palette with hex codes, usage counts, AND assigned roles
- Typography scale (font families, sizes, weights, line heights)
- Spacing scale
- Component patterns catalog

**DATA_MODELS.md** — Inferred entities:
- Every entity found in tables/forms
- Field names, types, enum values
- Relationships

**REBUILD_PLAN.md** — Task-by-task guide:
- Architecture overview
- Build order (shared components first, then app shell, then pages)
- Per-page tasks WITH content descriptions (not just "Components: form")
- Data model definitions
- Asset checklist
- Confidence scores per page: full (has screenshot + content) | partial (screenshot but limited content) | blank (needs re-scrape)

## Navigation Graph: Signal Not Noise

Only record edges that meet ONE of these criteria:
1. **URL changed** — the click navigated to a different page
2. **Content area changed** — the main content (not chrome) swapped to different content
3. **Modal opened** — a dialog/modal appeared with new content

Do NOT record:
- Same-page dropdown opens/closes
- Toggle state changes that don't load new content
- Chrome element interactions (user menu, notifications)
- Hover effects

## Key Principles

- **Click, don't URL-navigate** — SPAs break when you change URLs directly
- **Snapshot before and after** — use `browser_snapshot` to verify state changes
- **Chrome once, content always** — capture shared navigation elements once, focus per-page effort on unique content
- **Semantic names** — `fulfillment/orders-table.png` not `page-7.png`, `states/add-order-modal.png` not `states/003-dropdown-3.png`
- **Signal over volume** — 10 meaningful screenshots beat 30 noisy ones
- **Validate before done** — check output against templates before declaring complete
- **Report progress** — tell the user what you're doing at each major milestone
- **Save state for resume** — write `crawl-state.json` after each module

## Handling Common Issues

| Problem | Solution |
|---------|----------|
| Playwright MCP not connected | Try standalone script fallback, then WebFetch fallback |
| Login fails | Take debug screenshot, check credentials in .env, try alternate field selectors |
| Page loads blank after URL nav | Navigate via clicks from a working page instead — NEVER construct URLs |
| Page loads blank after click | Wait longer (5s), re-click, check if module requires separate auth |
| Modal won't close | Press Escape, then click a neutral area, then re-snapshot |
| Sidebar items don't load content | The app may need a longer wait — use `browser_wait_for` with 5s timeout |
| Too many interactive elements | Cap at 10 per page, skip chrome, prioritize modals > tabs > filters |
| Page is a grid of report/action cards | Loop: click each card → screenshot detail → back → next card. Do NOT stop at 1. |
| Session expires mid-crawl | Re-authenticate, resume from last saved crawl-state.json |
| Crawl interrupted | Load crawl-state.json, skip completed modules, continue from where stopped |
