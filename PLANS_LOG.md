# Frost Plans Archive

> Permanent record of every plan Claude presents during development sessions.
> Every plan is logged — accepted, rejected, or modified — so you can review decision history.
> Newest entries at the top (reverse-chronological), separated by `---`.
> Vault mirror: `Frost-Vault/01-Project/Plans-Log.md`

---

## 2026-03-12 — Sales Intelligence Phase 5: V2 AI Enhancements
**Task:** Execute Phase 5 from sales-intelligence-build-brief.md — inject Frost intelligence into Cultivera-familiar views
**Status:** accepted
**User Feedback:** none

### Plan
3-agent parallel swarm execution:
- Agent 5A: SalesBriefingWidget on Sales Dashboard (compact AIBriefingCard), Health Score badge column on Accounts table, Payment Compliance traffic light dot on OrderDrawer
- Agent 5B: Pipeline-aware ReorderCenter — pipelineCode on proposals, usePipelineRecommendation hook (A/I/R strategy text), Pipeline column + "Pipeline Strategy" card in drawer
- Agent 5C: "Create Cart" action on ReorderProposalDrawer → Zustand store → CartsPage banner → merged into useCarts/useCart hooks
All 3 agents independent — ran in parallel. Verified with tsc + build + lint = 0 errors.

---

## 2026-03-12 — Sales Intelligence Phase 4: Cultivera Parity — Analytics Reports
**Task:** Execute Phase 4 from sales-intelligence-build-brief.md — fill Cultivera parity gaps
**Status:** accepted
**User Feedback:** none

### Plan
Reduced from 5 agents to 2 (4A/4D/4E already built in prior sessions):
- Agent 4B (Core Reports): Monthly Sales bar chart, Sales By Person table, Client By Product matrix, Product By Client matrix — each with TanStack Query hooks + realistic mock data
- Agent 4C (Secondary Reports): Last Ordered By Account table, Monthly Sales Comparison grouped chart, Product-Line Sales grouped table, Expected Days of Inventory cards
Both agents modified AnalyticsLayout.tsx to add 8-tab navigation. Verified with tsc + build + lint = 0 errors.

---

## 2026-03-12 — Sales Intelligence Phase 3: Salesperson Intelligence
**Task:** Execute Phase 3 from sales-intelligence-build-brief.md — intelligence layer for sales reps
**Status:** accepted
**User Feedback:** none

### Plan
4-agent parallel swarm execution:
- Agent 3A (Sentiment Score): sentimentScore + sentimentTrend on Account type, SentimentChart sparkline in HealthTab, mock data on all 30 accounts
- Agent 3B (Nurture Tracker): useNurtureStatus hook (days since contact per channel, going cold detection), NurtureTracker component with MetricCards + DataTable
- Agent 3C (Order Frequency Intelligence): useOrderFrequency hook (avg days, trend, predicted next order, overdue), Declining Order Frequency callout in ReorderCenter
- Agent 3D (Proactive Alert Rules): useAlertRules hook (6 rules), wired into CRMDashboard AIBriefingCard + main Dashboard AlertsRow
All 4 agents independent — ran in parallel. Verified with tsc + build + lint = 0 errors.

---

## 2026-03-12 — Sales Intelligence Phase 2: Pipeline → Task Auto-Generation
**Task:** Execute Phase 2 from sales-intelligence-build-brief.md — pipeline events auto-create tasks
**Status:** accepted
**User Feedback:** none

### Plan
3-agent swarm execution per Phase 2 brief:
- Agent 2A (Pipeline Event Engine): Create event types + usePipelineEvents hook checking 5 threshold rules against CRM accounts
- Agent 2C (TaskBoard UI): Add PipelineBadge to TaskCard + Pipeline filter to TaskFilters (parallel with 2A)
- Agent 2B (Auto-Task Generator): Create useAutoTasks hook + 15 static pipeline mock tasks (after 2A)
Dependency: 2A+2C parallel, then 2B after 2A. Verified with tsc + build + lint = 0 errors.

---

## 2026-03-12 — Inventory Module: Exact Cultivera Parity Build (P1-P4)
**Task:** Build exact feature parity with Cultivera Pro across all 19 inventory tabs
**Status:** All 4 phases complete — all 19 tabs done
**User Feedback:** none

### Plan
4-phase build to achieve exact Cultivera Pro parity across 19 inventory tabs:
- **P1 (complete):** Enhance 6 already-built tabs (Manage Menu, Batches, Products, Strains, QA Result, Discounts) with missing columns, filters, toolbars, forms, pagination
- **P2:** Core Ops Tabs — Rooms, Backorders, Non-Cannabis, Conversions
- **P3:** Reference Tables — Product Lines, Categories, Catalog Groups, Product Tags, Production
- **P4:** WA Compliance Tabs — QA Lot, QA Sample, Employee Sample, Disposal

Full plan at: `.claude/plans/mellow-cooking-shore.md`

---

## 2026-03-12 — Header & Sidebar Sizing: Match Cultivera Pro Layout
**Task:** Resize header and sidebar to match the compact proportions shown in a Cultivera Pro screenshot — slim 48px header split into a logo zone (aligned with sidebar) and a content zone (aligned with page), narrower sidebar
**Status:** accepted
**User Feedback:** none

### Plan
1. `globals.css`: `--header-height: 96px` → `48px`
2. `AppHeader.tsx`: Desktop layout split into two horizontal zones within `h-12` bar:
   - Logo zone: `w-40`, `px-4`, logo shrunk to `h-7 w-7`, separated by `border-r`
   - Content zone: `flex-1`, contains CategoryDropdown (left) + actions (right)
3. `Sidebar.tsx`: Expanded width `w-64` → `w-40`; nav text `text-sm` → `text-xs`; icon `h-[18px]` → `h-4`
4. No architecture changes — dropdown + sidebar structure unchanged

---

## 2026-03-11 — Multi-Tier RAG Memory Architecture
**Task:** Research all Claude Code skills/tools, design a CLAUDE.md + MEMORY.md + Obsidian + Supabase pgvector memory system, document best practices for each layer
**Status:** pending — user needs to set up Obsidian Sync + get OpenAI API key before execution
**User Feedback:** Wants Obsidian Sync ($4/mo) instead of local-only. Has Obsidian on another machine to sync. Wants to think about it before starting execution.

### Plan
**Four-tier memory architecture:**
- **Tier 0 (HOT):** CLAUDE.md (~80 lines, trimmed from 140) + `.claude/rules/*.md` — auto-loaded every session
- **Tier 1 (WARM):** DEVELOPMENT_LOG.md, PLANS_LOG.md, Vault-Index, per-module CLAUDE.md — read on demand
- **Tier 2 (COLD):** Obsidian Vault (`Frost-Vault/`) with Obsidian Sync — grep/read on demand, synced across machines
- **Tier 3 (DEEP):** Supabase pgvector — semantic RAG search via FastAPI `/api/memory/search` endpoint

**4 execution phases:**
1. Foundation — restructure CLAUDE.md, create memory-retrieval rule, populate empty vault notes
2. Supabase pgvector — migration 005, FastAPI memory endpoints, OpenAI embeddings
3. Sync tooling — `/sync-memory` command, bulk sync script
4. Integration — per-module CLAUDE.md files, GSD agent updates, archival logic

**Skills inventory:** 26+ plugins documented (GSD, frontend-design, superpowers, Trail of Bits, Vercel Suite, Deep Trilogy, ECC, etc.)

**Cost:** ~$4/mo (Obsidian Sync) + $0.01 one-time (embeddings)

**Full plan file:** `~/.claude/plans/lucky-exploring-dewdrop.md`

---

## 2026-03-11 — Kultivera Deep Interactive Scraper & Rebuild Plan
**Task:** Build an enhanced authenticated scraper that logs into Cultivera Pro (wa.cultiverapro.com), deep-crawls every page, clicks every interactive element (dropdowns, modals, tabs, sidebar items), screenshots every UI state, extracts all design tokens, maps the full site tree, and produces a comprehensive task-by-task rebuild plan for another Claude Code session.
**Status:** accepted
**User Feedback:** User confirmed this was done before in a prior session but didn't persist. Wants it rebuilt and re-run.

### Plan
**Script:** `scripts/scrape-app.mjs` — new Playwright-based authenticated deep scraper

**Phase 1 — Auth & Discovery**
1. Launch Playwright headed browser
2. Navigate to `https://wa.cultiverapro.com/#/sign-in`
3. Enter credentials from `.env` (CULTIVERA_EMAIL, CULTIVERA_PASSWORD)
4. Wait for auth redirect, detect main app shell
5. Map all top-level navigation (sidebar items, topbar menus, sub-menus)

**Phase 2 — Deep Interactive Crawl**
For every discovered page/route:
1. Navigate to it, wait for load
2. Full-page desktop screenshot
3. Find all interactive elements: dropdowns, tabs, modals, buttons, expandable sections
4. Click each one, screenshot the resulting state, record the trigger path
5. Extract: colors, typography, spacing, CSS vars, meta, HTML snapshot
6. Build a navigation graph (page → click → resulting state)

**Phase 3 — Site Tree & Design System Extraction**
1. Generate complete site tree with all routes and sub-states
2. Aggregate all colors, fonts, spacing into unified design system doc
3. Catalog all UI patterns (tables, forms, cards, modals, drawers, charts)

**Phase 4 — Rebuild Plan**
1. Write comprehensive `research/wa.cultiverapro.com/REBUILD_PLAN.md` with:
   - Full site architecture
   - Page-by-page rebuild tasks with screenshot references
   - Component inventory
   - Design token mapping
   - Navigation structure
   - Task sequencing (build order, dependencies)

**Output:** `research/wa.cultiverapro.com/[timestamp]/`

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
