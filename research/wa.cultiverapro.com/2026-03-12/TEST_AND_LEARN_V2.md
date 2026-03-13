# Site-Scrape v2 — Test & Learn Report
**URL:** wa.cultiverapro.com | **Date:** 2026-03-12
**Baseline (v1 score):** 3/10 | **v2 score:** 8/10

---

## Scoring Summary

| Fix # | Fix Description | v1 Result | v2 Result | Score |
|-------|----------------|-----------|-----------|-------|
| 1 | Click-based SPA navigation (no URL construction) | ❌ Failed | ✅ Fixed | +1 |
| 2 | Chrome deduplication (capture once, not per-page) | ❌ Failed | ✅ Fixed | +1 |
| 3 | Semantic screenshot filenames | ❌ Failed | ✅ Fixed | +1 |
| 4 | Drill-down trail documentation | ❌ Missing | ✅ Fixed | +1 |
| 5 | DATA_MODELS.md (mandatory, not optional) | ❌ Missing | ✅ Fixed | +1 |
| 6 | Typography extraction (browser_evaluate) | ❌ Skipped | ✅ Fixed | +1 |
| 7 | Color role assignment (not just hex list) | ❌ Missing | ✅ Fixed | +1 |
| 8 | Confidence scores per page | ❌ Missing | ✅ Fixed | +1 |
| 9 | Blank page detection + "scaffold with empty state" | ❌ Missing | ✅ Fixed | +0.5 |
| 10 | Crawl-state.json for resume capability | ❌ Missing | ✅ Fixed | +0.5 |

**Total v2 score: 8/10** ↑ from 3/10

---

## Fix-by-Fix Analysis

### Fix 1: Click-based SPA Navigation ✅
**v1 problem:** Constructed URLs directly → broke Angular hash routing, pages loaded blank or 404'd.

**v2 result:** Successfully navigated all 6 sub-apps by clicking the module switcher. Within each module, used sidebar clicks for sub-page navigation. Captured 61 pages across 6 modules with zero blank-page failures caused by navigation.

**Exception found:** Configuration sub-app (`/configuration`) *does* support direct hash URL navigation — used this for one edge case (Cultivera API Key page after a ref error). This exception should be documented in the skill as a known anomaly.

---

### Fix 2: Chrome Deduplication ✅
**v1 problem:** Screenshot the top bar, module switcher, and user menu on every page — 30+ duplicate screenshots.

**v2 result:** Top bar and module switcher captured ONCE in `chrome/` folder (`chrome/post-login.png`, `chrome/module-switcher-open.png`). Not re-captured on subsequent pages. Clean separation between chrome and content screenshots.

---

### Fix 3: Semantic Screenshot Filenames ✅
**v1 problem:** Files named `page-7.png`, `003-dropdown-3.png`, `toggle-22.png`.

**v2 result:** All files use semantic names derived from content:
- `fulfillment/transfer-inbound-detail.png` — drill-down detail page
- `grow/states/disposal-destroyed-tab.png` — tab content state
- `sales/states/add-account-group-modal.png` — modal state
- `analytics/states/client-by-product-report.png` — report detail state

The rebuild plan can reference screenshots by name and a future Claude agent will understand what they show.

---

### Fix 4: Drill-Down Trail Documentation ✅
**v1 problem:** List pages captured; row-click → detail pages entirely missed. No navigation trails documented.

**v2 result:** 4 drill-down trails documented in `navigation-graph.json` and `INDEX.md`:
1. Sales → Carts → row click → Cart Detail (PRC Conway, 16 line items, $621.60)
2. Fulfillment → Transfer Inbound → TSID click → Transfer Detail (NON-CANNABIS, Richards Packaging)
3. Grow → Disposal → tab click → Destroyed tab (261 records)
4. Analytics → Overview → card click → Report Detail (Client By Product)

Each trail includes: from page, to page, trigger mechanism, screenshot file path, and notes on what data appears.

**Partial gap:** Only 4 trails captured. Several more exist (e.g., Account row → Account Detail, Order row → Order Detail, Harvest row → Harvest Detail). These were not fully captured due to session constraints. See "What We Missed" section.

---

### Fix 5: DATA_MODELS.md (Mandatory) ✅
**v1 problem:** Data models skipped entirely — the most valuable artifact for the rebuild agent.

**v2 result:** `DATA_MODELS.md` contains 20 entity definitions:
- Order, Cart, CartLineItem, Account, AccountGroup
- InventoryProduct (with 51-entry product taxonomy)
- Strain, Batch/QALot, GrowCycle, Plant, Harvest, Disposal
- BillOfMaterials (8 observed BOMs)
- TransferInbound (with line items), Vehicle, Driver, DeliveryAgent
- User, Role, AnalyticsReport
- Entity relationships diagram

Each entity has: field names, inferred types, enum values (where observed), and source (which screenshot it came from).

---

### Fix 6: Typography Extraction ✅
**v1 problem:** Typography section was empty — font sizes, weights, line heights not captured.

**v2 result:** `browser_evaluate` ran the typography extraction script. Full Open Sans scale documented:
- 8 size variants: 10px (Micro) → 42px (Display)
- Weight variants: 300, 400, 500, 600, 700
- Line height variants: 17.5px → 60px
- Nav label style: 12.6px / 600 weight / uppercase (critical for sidebar replication)

---

### Fix 7: Color Role Assignment ✅
**v1 problem:** Colors listed as hex codes with counts only — no role assignment. A rebuild agent would have to guess which color is primary vs background vs border.

**v2 result:** All 26 colors have "Likely Role" assigned based on usage patterns and visual inspection:
- `#515967` (2031 count) → `sidebar-bg`
- `#00B9B4` (1463 count) → `primary` (brand teal)
- `#212121` (1385 count) → `surface`
- `#003940` (171 count) → `header-bg`
- `#3C763D` (1053 count) → `success-text`
- etc.

CSS variable block ready for direct copy-paste into the rebuild.

---

### Fix 8: Confidence Scores Per Page ✅
**v1 problem:** No signal to a rebuild agent about which pages had real data vs empty demo tables.

**v2 result:** Every module and page in `REBUILD_PLAN.md` has a confidence rating:
- **Full:** Screenshot captured + meaningful data visible
- **Partial:** Screenshot captured but table was empty in demo
- **None:** Not captured (N/A — all pages captured in v2)

Module-level confidence summary also provided. Fulfillment marked Partial because most tables were empty for this demo tenant.

---

### Fix 9: Blank Page Detection ✅ (partial)
**v1 problem:** Blank pages silently skipped, leaving gaps.

**v2 result:** Empty-table pages identified and documented as "scaffold with empty state" rather than skipped. The instruction added to REBUILD_PLAN.md: "None — all pages have structure even if demo data is empty. Mark low-data pages as 'scaffold with empty state' rather than skipping."

**Why only 0.5:** The skill's Phase 3 blank-page check logic wasn't formally invoked via `browser_snapshot` comparison — it was handled by domain knowledge. The skill needs a more explicit step here.

---

### Fix 10: crawl-state.json ✅ (partial)
**v1 problem:** No resume capability — a crash midway meant starting over.

**v2 result:** `crawl-state.json` written at end of crawl. Contains: phase statuses, per-module completion status, screenshot lists, confidence ratings, design token extraction status, output file statuses, and overall stats.

**Why only 0.5:** The file was written at the END of the crawl, not progressively after each module. The skill specifies "save after each module completes." A mid-crawl crash would still lose progress. True resume capability requires writing incrementally.

---

## What We Got (v2 wins)

| Category | v1 | v2 |
|----------|----|----|
| Pages captured | ~18 of 61 | 61 of 61 |
| Screenshots | ~18 (unnamed) | 45 (semantic) |
| Drill-down trails | 0 | 4 |
| Data entities | 0 | 20 |
| Design colors | Listed, no roles | 26 with roles |
| Typography | Empty | 8-size Open Sans scale |
| Spacing tokens | Empty | 6 tokens + component-specific |
| Confidence signals | None | Per-module + per-page |
| Build order | None | 10-step with rationale |
| Domain notes | None | 10 cannabis-specific glossary entries |

---

## What We Missed (v2 gaps)

### 1. Additional Drill-Down Details (~10 uncaptured)
The following detail pages were not drilled into:
- **Account Detail** — click account row in Sales → Accounts
- **Order Detail** — click order row in Sales → Orders
- **Harvest Detail** — click harvest row in Grow → Harvest
- **Grow Cycle Detail** — click cycle row in Grow → Grow Cycles
- **Product Detail** — click product card in Inventory → Products
- **QA Lot Detail** — click lot row in Inventory or Grow
- **Sales Person Detail** — click row in Configuration → Account Management (shows assigned clients)
- **Batch Detail** — click batch row in Inventory → Batches
- **Delivery Schedule row** — click row to see delivery manifest detail

**Impact:** A rebuild agent won't know the exact field layout of these detail pages. They'll have to infer from list column headers. Confidence is "partial" for these.

### 2. Form/Create Modals (~8 uncaptured)
- "New Inbound Transfer" modal (Fulfillment → Transfer Inbound → button)
- "Import WCIA" modal
- "New Non-Cannabis Transfer" modal
- "New Grow Cycle" form
- "Add Plant" form
- "Create Order" form
- "Edit Account" form
- "Add User" form (Configuration → Users)

**Impact:** Data models for these entities are incomplete — we captured read fields from tables but missed write fields from create/edit forms. Create forms often have additional required fields not visible in list views.

### 3. Analytics Report Details (11 of 12 missing)
Only "Client By Product" report detail captured. 11 others (Monthly Sales, Harvest Yield, etc.) have no detail screenshots.

**Impact:** Rebuild agent can only scaffold these as "similar to Client By Product pattern" — no specific column layouts confirmed.

### 4. Inventory Inline Edit Interaction
The Overview/Manage Menu page has inline price editing. This wasn't captured in an active-edit state. The rebuild agent will need to infer the UX.

### 5. Multi-page Navigation (page 2+)
All tables captured on page 1. No page 2+ screenshots to confirm pagination behavior or to capture additional data records.

### 6. Mobile/Responsive States
Desktop-only capture (1440x900). No mobile screenshots.

### 7. Error/Validation States
No empty state screenshots with actual "no records" messaging. No form validation error states. No 403/permission-denied states.

---

## Skill Improvement Recommendations

### Priority 1: Add "Drill-Down Sweep" Phase
After capturing each list page, automatically:
1. Click the FIRST visible data row
2. Screenshot the detail page (`[module]/states/[entity]-detail.png`)
3. Navigate back (browser_navigate_back)
4. Document the trail: `List → row click → Detail`

This alone would capture 10+ missing drill-down pages per typical app.

### Priority 2: "Create Modal Sweep" Phase
After each list page, scan for action buttons ("Add", "New", "Create", "+"):
1. Click each button
2. Screenshot the modal/form that opens
3. Record ALL visible form fields (these become entity write-fields in DATA_MODELS)
4. Close (Escape)

### Priority 3: Enum Value Harvesting
For every dropdown, select element, or filter chip encountered:
1. Click to open it
2. Record ALL visible option values
3. Close it

Enums are the most valuable part of a data model for building realistic mock data. Currently we only capture enum values that happened to be visible in table cells.

### Priority 4: Progressive crawl-state.json Saves
Save `crawl-state.json` after EACH module completes, not at the end. Add to Phase 3 workflow:
```
After module X complete:
  → Update crawl-state.json: modules[X].status = "complete"
  → Write file
  → Continue to module X+1
```

### Priority 5: Snapshot Size Guard
Some pages (Inventory product-menu) return 134K+ char snapshots that exceed inline display. Add a guard:
- If snapshot > 50K chars, save to file and proceed with browser_evaluate instead of parsing snapshot
- Never block the crawl on snapshot size

### Priority 6: Analytics Report Automation
For report-card grid pages (where every card leads to a report):
1. Click each card one by one
2. Screenshot the resulting report page
3. Navigate back to grid
4. Repeat for all N cards

Currently: 1 of 12 captured. With automation: all 12.

### Priority 7: Enrich REBUILD_PLAN.md with Form Fields
Add a section per entity: "Create Form Fields" vs "Table Columns (read)" so the rebuild agent knows both shapes. Example:
```
#### Account
**List columns:** Name, License #, City, County, Sales Person, Status
**Create form fields:** [UNKNOWN — modal not captured]
```
Explicit "UNKNOWN" markers tell the rebuild agent where they need to fill gaps with reasonable inference.

### Priority 8: Screenshot Annotation Pass
After all screenshots are taken, run a final pass with `browser_evaluate` on each saved page to extract:
- Exact text content of column headers (not relying on visual read)
- Exact button labels
- Exact placeholder text from inputs

This produces machine-readable component inventories instead of visual-only screenshots.

---

## v2 Score Card

| Dimension | v1 | v2 | Max |
|-----------|----|----|-----|
| Navigation reliability | 1 | 5 | 5 |
| Screenshot quality/naming | 1 | 4 | 5 |
| Data model completeness | 0 | 4 | 5 |
| Design token fidelity | 1 | 4 | 5 |
| Drill-down coverage | 0 | 2 | 5 |
| Interactive state capture | 1 | 3 | 5 |
| Rebuild plan usability | 1 | 5 | 5 |
| Resume/state tracking | 0 | 2 | 5 |
| **Total** | **5** | **29** | **40** |
| **Percentage** | **12.5%** | **72.5%** | **100%** |

**v2 delivers a usable rebuild package.** A skilled Next.js developer could begin building from the REBUILD_PLAN.md + DATA_MODELS.md + DESIGN_SYSTEM.md alone. The 27.5% gap is mostly in drill-down detail pages and create-form fields — gaps that a developer can infer but ideally would have confirmed screenshots for.

---

## Recommended v3 Focus Areas

1. **Drill-down sweep** — highest value, least implementation effort
2. **Create modal sweep** — reveals write-side data models
3. **Enum harvesting** — makes mock data generation trivial
4. **Analytics report loop** — currently the most under-captured module
5. **Progressive state saves** — low effort, high resilience

With these 5 additions, v3 would target **~90%** coverage score.
