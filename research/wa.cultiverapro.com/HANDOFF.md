# Context Window Transfer — Cultivera Pro Rescrape Brief
**For:** Fresh Claude Code instance
**From:** Session ending 2026-03-12
**Task:** Re-run site-scrape v3 on wa.cultiverapro.com with full drill-down coverage

---

## What This Is

We are building **Frost** — an AI-powered cannabis operations platform for a single-tenant (Frost Cannabis, doing business as G&S Greenery). To build it, we scraped the competitor platform **Cultivera Pro** (wa.cultiverapro.com) to understand its UI, data models, and workflows.

We completed a first-pass scrape (v2) that produced a solid but incomplete research package. Your job is to run the scrape again using the updated v3 skill — this time capturing everything we missed, especially detail pages, create/edit forms, enum values, and all analytics reports.

---

## Credentials

- **URL:** https://wa.cultiverapro.com
- **Email:** seattlepg@hotmail.com
- **Password:** cultivera1
- **Tenant:** G&S GREENERY (License #415986, Arlington WA)

---

## What v2 Already Captured (DO NOT re-do from scratch)

The v2 run is at: `research/wa.cultiverapro.com/2026-03-12/`

### Already complete — confirmed good:
- `INDEX.md` — full site tree, 61 pages across 6 modules, component census
- `DESIGN_SYSTEM.md` — 26 colors with roles, Open Sans typography scale, spacing tokens
- `DATA_MODELS.md` — 20 entity definitions (read-side fields from table columns)
- `REBUILD_PLAN.md` — 8-phase build plan with confidence scores
- `navigation-graph.json` — all 6 sub-apps mapped, 4 drill-down trails
- `crawl-state.json` — completion marker

### Screenshot coverage (v2):
All 61 list/overview pages were captured. The following folders exist and are complete for list-view screenshots:
- `grow/` — 10 pages ✅
- `analytics/` — 1 page ✅
- `sales/` — 9 pages ✅
- `inventory/` — 19 pages ✅
- `fulfillment/` — 8 pages ✅
- `configuration/` — 14 pages ✅
- `chrome/` — post-login + module-switcher-open ✅

---

## What v3 Needs to Capture (Your Actual Mission)

Save all new output to: `research/wa.cultiverapro.com/2026-03-12-v3/`

Use the same subfolder structure as v2.

### Priority 1: Drill-Down Detail Pages (~14 pages)

For every list page that has data rows, click row 1 → screenshot detail → back → document trail.

| List Page | Expected Detail Page | Save As |
|-----------|---------------------|---------|
| Sales → Accounts | Account detail with notes, order history, contact info | `sales/states/account-detail.png` |
| Sales → Orders | Order detail with line items | `sales/states/order-detail.png` |
| Sales → Carts | Cart detail ← **already captured in v2** as `sales/states/cart-detail-prc-conway.png` |
| Grow → Grow Cycles | Cycle detail — plants, timeline, room assignment | `grow/states/grow-cycle-detail.png` |
| Grow → Plants | Plant detail — TSID, history, stage changes | `grow/states/plant-detail.png` |
| Grow → Harvest | Harvest detail — weights, qa lot, room | `grow/states/harvest-detail.png` |
| Grow → QA Lot | QA lot detail — lab results, cannabinoids | `grow/states/qa-lot-detail.png` |
| Inventory → Batches | Batch detail — quantity, lot, qa | `inventory/states/batch-detail.png` |
| Inventory → Products | Product detail — full spec, pricing, availability | `inventory/states/product-detail.png` |
| Inventory → QA Result (COA) | COA detail — full lab report | `inventory/states/coa-detail.png` |
| Fulfillment → Transfer Inbound | Transfer detail ← **already captured** as `fulfillment/states/transfer-inbound-detail.png` |
| Fulfillment → Delivery Schedule | Delivery detail — manifest, driver, route | `fulfillment/states/delivery-detail.png` |
| Configuration → Account Management | Sales person detail — assigned client list | `configuration/states/sales-person-detail.png` |
| Configuration → Audit | Audit entry detail (click a row if clickable) | `configuration/states/audit-detail.png` |

### Priority 2: Create/Edit Form Modals (~12 forms)

For each list page, find and click "Add", "New", "Create", "+" buttons → screenshot the modal/form → **write down every visible field label** → close with Escape.

This is the most important thing we're missing. We have the read-side schema (table columns). We need the write-side schema (form fields).

| Page | Button to Click | Save As | Fields to Record |
|------|----------------|---------|-----------------|
| Sales → Accounts | Add/New Account | `sales/states/add-account-modal.png` | All form fields |
| Sales → Account Groups | Add Group | `sales/states/add-account-group-modal.png` ← **already captured** |
| Sales → Orders | New Order (if button exists) | `sales/states/new-order-modal.png` | All form fields |
| Grow → Grow Cycles | New Cycle | `grow/states/new-grow-cycle-modal.png` | All form fields |
| Grow → Plants | Add Plant | `grow/states/add-plant-modal.png` | All form fields |
| Grow → Rooms | Add Room | `grow/states/add-room-modal.png` | All form fields |
| Inventory → Products | Add Product | `inventory/states/add-product-modal.png` | All form fields |
| Inventory → Strains | Add Strain | `inventory/states/add-strain-modal.png` | All form fields |
| Fulfillment → Vehicles | Add Vehicle | `fulfillment/states/add-vehicle-modal.png` | All form fields |
| Fulfillment → Drivers | Add Driver | `fulfillment/states/add-driver-modal.png` | All form fields |
| Fulfillment → Transfer Inbound | New Inbound Transfer | `fulfillment/states/new-inbound-transfer-modal.png` | All form fields |
| Configuration → Users | Add User | `configuration/states/add-user-modal.png` | All form fields |

### Priority 3: Enum Value Harvesting

For every status dropdown, filter chip bar, and select input — click to open and record ALL visible options.

Key enums we need completed:

| Enum | Found In | Status |
|------|----------|--------|
| Order status | Sales/Fulfillment filter tabs | ✅ Known: Submitted, Partially Sublotted, Sublotted, Ready For Manifest, Manifested, Quarantined, Invoiced |
| Account status | Sales → Accounts filter | ✅ Known: Prospect, Partner, Pending, First Contact, Sent Samples, Don't do business with, New Retailers |
| Cart status | Sales → Carts | ✅ Known: Open, Accepted, Cancelled |
| Grow stage | Grow → Plants / Cycles | ✅ Known: Clones/Propagation, Vegetative, Flower, Harvest, Drying/Curing |
| Transfer status | Fulfillment → Transfer Inbound | ✅ Known: In Transit, Accepted, Rejected |
| QA Lot status | Inventory → QA Result | ✅ Known: Quarantined, Released, Approved |
| Disposal reason | Grow → Disposal | ❌ **Unknown — open the filter/form** |
| Plant source type | Grow → Grow Sources | ❌ **Unknown — open the form** |
| Inventory type | Inventory → QA Result column | ❌ **Unknown — open the filter** |
| Discount type | Inventory → Discount & Promotion | ❌ **Unknown — open the form** |
| User role options | Configuration → Users | ❌ **Unknown — open add user form or role dropdown** |
| Delivery route options | Fulfillment → Delivery Schedule Route column | ❌ **Unknown — open the filter** |

### Priority 4: All 12 Analytics Reports

The analytics module has 12 report cards. v2 only captured 1 (Client By Product). Capture all 12:

Navigate to `/app-analytics` → Overview → click each card → screenshot → back → next card.

| # | Report Name | Save As |
|---|-------------|---------|
| 1 | Customer Sales Client By Product | `analytics/states/report-client-by-product.png` ← **already captured** |
| 2 | Product By Client | `analytics/states/report-product-by-client.png` |
| 3 | Expected Days of Inventory | `analytics/states/report-expected-days-inventory.png` |
| 4 | Harvest Yield | `analytics/states/report-harvest-yield.png` |
| 5 | Last Ordered By Account | `analytics/states/report-last-ordered-by-account.png` |
| 6 | Monthly Sales 12mo | `analytics/states/report-monthly-sales-12mo.png` |
| 7 | Monthly Sales Comparison | `analytics/states/report-monthly-sales-comparison.png` |
| 8 | Monthly Sales by Sales Person | `analytics/states/report-monthly-sales-by-rep.png` |
| 9 | Production Run Input/Output | `analytics/states/report-production-run-io.png` |
| 10 | Product-Line Sales by Account | `analytics/states/report-product-line-by-account.png` |
| 11 | Sales Recommendations | `analytics/states/report-sales-recommendations.png` |
| 12 | (any 12th card if present) | `analytics/states/report-12.png` |

For each: record the column headers, filter tabs, and any chart type visible.

---

## App Architecture (Critical for Navigation)

This is an **AngularJS 1.x SPA** with **6 separate sub-applications** using hash routing.

```
https://wa.cultiverapro.com/
├── /app-grow       → Grow module      (#/ = kanban, sidebar for sub-pages)
├── /app-analytics  → Analytics        (#/ = 12 report cards)
├── /crm            → Sales            (#/dashboard = landing)
├── /inventory/     → Inventory        (#/product-menu = landing)
├── /fulfillment    → Fulfillment      (#/orders = landing)
└── /configuration  → Configuration   (#/account-management = landing)
```

### CRITICAL Navigation Rules:
1. **NEVER construct URLs** — navigating to `https://wa.cultiverapro.com/crm#/accounts` directly will break the app (AngularJS bootstrap fails). Always navigate by CLICKING.
2. **To switch modules:** Click the module name in the top bar dropdown.
3. **To navigate within a module:** Click sidebar links.
4. **Exception:** `/configuration` sub-app DOES support direct URL navigation to hash routes. You can use `browser_navigate` for Config pages if needed.
5. **After every click:** Use `browser_wait_for` (3-5s) then `browser_snapshot` to confirm content loaded.

### Top Bar Layout:
- Background: `#003940` (very dark teal), height ~48px
- Left: Cultivera Pro logo
- Center: Module switcher dropdown — click the current module name to open, then click target module
- Right: "Find Order..." search, notification bell, user avatar

### Sidebar Layout:
- Background: `#515967` (dark blue-gray), width ~130px
- Company name at top (G&S GREENERY)
- Nav items with icons — click to navigate within module
- Active: left border `#00B9B4` teal

---

## Design System (Already Extracted — Reference Only)

You don't need to re-extract tokens. This is for reference when writing data model updates.

```css
--color-primary:      #00B9B4;  /* Brand teal */
--color-primary-dark: #003940;  /* Header/topbar */
--color-background:   #16191C;  /* Base dark bg */
--color-surface:      #212121;  /* Card surface */
--color-sidebar:      #515967;  /* Sidebar bg */
--color-success:      #3C763D;  /* Green status */
--color-danger:       #A94442;  /* Red status */
--color-border:       #CECED2;  /* Table borders */
--color-row-bg:       #FDFDFF;  /* Table row bg */
font-family: "Open Sans", sans-serif;
```

---

## Data Models (v2 — Read-Side Only)

These are KNOWN from v2. Your job is to ADD the write-side fields from create/edit forms.

When you capture a create modal, update `DATA_MODELS.md` by adding a `### Create Form Fields` section to each entity. Example format:

```markdown
## Entity: Account (Sales/CRM)

### Table Columns (read-side — known from v2)
| accountId | name | licenseNumber | city | county | salesPerson | status | accountGroup |

### Create Form Fields (write-side — NEW from v3)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | Account/store name |
| licenseNumber | string | yes | State license # |
| ... | ... | ... | From add-account-modal.png |
```

---

## Key Domain Glossary

Understand these terms — they appear everywhere in the UI:

| Term | Meaning |
|------|---------|
| **TSID** | State Tracking System ID — every cannabis item has one from WA's Leaf Data system |
| **Manifest** | Legal transport document required before any cannabis delivery |
| **Quarantine** | Mandatory hold period after harvest before product can be sold |
| **RTM** | Ready To Manufacture — bulk inputs (flower, extract) before processing |
| **RTP** | Ready To Package — processed material before final packaging |
| **Cart** | B2B portal order from a retailer (NOT a shopping cart) |
| **COA** | Certificate of Analysis — lab test showing cannabinoid percentages |
| **WCIA** | Washington Cannabis Information Architecture — state traceability system |
| **Leaf Data** | State API for TSID sync |
| **G&S GREENERY** | The tenant — cannabis producer/processor selling wholesale to dispensaries |
| **FROST** | The brand name (snowflake logo visible in Marketplace Settings) |

---

## Output Deliverables

Save everything to: `research/wa.cultiverapro.com/2026-03-12-v3/`

### New files to create:
1. **`DATA_MODELS_V3.md`** — Copy v2 DATA_MODELS.md, then ADD `### Create Form Fields` sections for every entity where you captured the add/edit modal. Mark `### Table Columns (from v2)` vs `### Create Form Fields (from v3)` clearly.
2. **`DRILL_DOWN_TRAILS.md`** — Document every detail page captured: entity name, trail path (List → click → Detail), screenshot path, all visible fields on the detail page.
3. **`ENUM_REGISTRY.md`** — Every enum collected, organized by entity. Format:
   ```
   ## Account.status
   Source: Sales → Accounts filter tabs
   Values: Prospect | Partner | Pending | First Contact | Sent Samples | Don't do business with | New Retailers
   ```
4. **`ANALYTICS_REPORTS.md`** — For each of 12 reports: report name, filter tab options, column headers, chart type (if any), screenshot path.
5. **`crawl-state-v3.json`** — Track your v3 progress. Write after each section completes (not at the end).

### Update existing files (copy from v2, then augment):
- `REBUILD_PLAN.md` — Update confidence scores from "Partial" to "Full" for modules where you capture drill-downs. Add form schemas to Phase 1 shared components.

---

## Skill Reference

The `site-scrape` skill is installed at `.claude/skills/site-scrape/skill.md`. It is now v3. Key additions since v2:

- **Step 7 in Phase 3:** Drill-down sweep — for every list page with data rows, click row 1 → screenshot → back → document trail
- **Step 8 in Phase 3:** Save `crawl-state.json` after EACH module, not at the end
- **Phase 4, Priority 1:** When clicking Add/New/Create modals → record ALL visible form field labels
- **Phase 4, Priority 3:** Open every filter dropdown/select → record ALL option values
- **Common Issues table:** Added "Page is a grid of report/action cards → Loop through all cards"

---

## Session Summary (What Happened in v2 Run)

The v2 scrape ran in a single session on 2026-03-12. Key events:

1. **Auth:** Logged in successfully. Post-login screenshot captured.
2. **Navigation:** Discovered 6 modules via module switcher. Sidebar-click navigation worked throughout.
3. **Grow (10 pages):** All captured. Disposal → Destroyed tab state captured (261 records).
4. **Analytics (1 page):** Overview + 1 report detail. 11 reports NOT drilled into.
5. **Sales (9 pages):** All captured. Cart detail drill-down (PRC Conway, 16 items, $621.60) captured. Add Account Group modal captured.
6. **Inventory (19 pages):** All captured. QA Result has rich cannabinoid data.
7. **Fulfillment (8 pages):** All captured. Most tables empty in demo tenant. Transfer Inbound detail captured (Richards Packaging, NON-CANNABIS).
8. **Configuration (14 pages):** All captured. Audit has 2073 real entries. FROST brand logo visible in Marketplace Settings.
9. **Design tokens:** Extracted colors (26 with roles), typography (Open Sans, 8 sizes), spacing — from 3 different pages.
10. **Data models:** 20 entities documented (read-side only from table columns).
11. **Docs written:** INDEX.md, DESIGN_SYSTEM.md, DATA_MODELS.md, REBUILD_PLAN.md, navigation-graph.json, crawl-state.json.
12. **Skill updated:** site-scrape v2 → v3 with drill-down sweep, progressive saves, enum harvesting, modal field recording.

### Technical Issues Encountered:
- **Snapshot size overflow:** Inventory product-menu returned 134K+ chars. When this happens, ignore the snapshot file and proceed with `browser_evaluate` calls directly.
- **Ref expiration:** `browser_snapshot` refs expire after a few minutes. If a click fails with "ref not found", take a fresh `browser_snapshot` before retrying.
- **Configuration direct-URL exception:** Unlike other sub-apps, `/configuration` supports direct hash URL navigation. If you need to navigate to a specific config page, `browser_navigate` to `https://wa.cultiverapro.com/configuration#/[route]` works.

---

## What a "Full" Run Looks Like

After your v3 run completes, these confidence levels should be achievable:

| Module | v2 Confidence | v3 Target |
|--------|--------------|-----------|
| Grow | Full (list pages) | Full (+ detail pages + create forms) |
| Analytics | Partial (1/12 reports) | Full (all 12 reports) |
| Sales | Full (list pages) | Full (+ account detail + order detail) |
| Inventory | Full (list pages) | Full (+ product detail + batch detail + COA detail) |
| Fulfillment | Partial (empty tables) | Full (+ delivery detail + create forms even if no data) |
| Configuration | Full (list pages) | Full (+ sales person detail + add user form) |

Overall: v2 = 72% coverage → v3 target = 93%+ coverage

---

## File Locations

```
Frost/
├── research/
│   └── wa.cultiverapro.com/
│       ├── 2026-03-12/           ← v2 output (reference, do not overwrite)
│       │   ├── INDEX.md
│       │   ├── DESIGN_SYSTEM.md
│       │   ├── DATA_MODELS.md
│       │   ├── REBUILD_PLAN.md
│       │   ├── navigation-graph.json
│       │   ├── crawl-state.json
│       │   ├── TEST_AND_LEARN_V2.md
│       │   ├── grow/
│       │   ├── analytics/
│       │   ├── sales/
│       │   ├── inventory/
│       │   ├── fulfillment/
│       │   ├── configuration/
│       │   └── chrome/
│       └── 2026-03-12-v3/        ← YOUR output goes here (create this)
├── .claude/
│   └── skills/
│       └── site-scrape/
│           └── skill.md          ← v3 skill (already updated)
└── CLAUDE.md                     ← Project instructions (read before starting)
```

---

## How to Start

1. Read `CLAUDE.md` at the project root (project instructions).
2. Invoke the `site-scrape` skill via the Skill tool.
3. Tell it: URL = https://wa.cultiverapro.com, credentials as above, scope = v3 additions only (drill-downs + create modals + enum harvesting + all analytics reports), output to `research/wa.cultiverapro.com/2026-03-12-v3/`.
4. Work through Priority 1 → 2 → 3 → 4 in order.
5. After completing each section (drill-downs done, modals done, enums done, analytics done), write the corresponding output file.
6. Final deliverable: `DATA_MODELS_V3.md` with both read-side (from v2) and write-side (from v3 form captures) fully documented.

---

## Success Criteria

You are done when:
- [ ] Every list page that had data has a corresponding detail page screenshot
- [ ] Every "Add/New/Create" button has been clicked and its form fields recorded
- [ ] All 12 analytics reports have detail screenshots
- [ ] `ENUM_REGISTRY.md` has values for every status/type dropdown in the app
- [ ] `DATA_MODELS_V3.md` shows both table columns AND form fields for each entity
- [ ] `DRILL_DOWN_TRAILS.md` documents every row-click → detail navigation path
- [ ] `crawl-state-v3.json` shows all sections complete
