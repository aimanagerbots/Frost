# Cultivera Pro v3 — Swarm Runbook

## How It Works

Each terminal = one Claude Code session = one independent Playwright browser.
No port configuration needed — the Playwright plugin spawns a fresh browser per session.
All agents write to separate subdirectories, so there are no file conflicts.

## ✅ Terminal 1 — Sales — COMPLETE (51 screenshots, 2026-03-12)

Sales is fully captured. Launch Terminals 2–5 simultaneously.

---

## Terminal 2 — Grow Module

**When to run:** After Terminal 1 finishes Sales, launch this in a new Claude Code session.

```
I am scraping the Grow module of Cultivera Pro as a parallel swarm agent.
This is a single-module focused crawl — Grow only.

Credentials: seattlepg@hotmail.com / cultivera1
Output dir: research/wa.cultiverapro.com/2026-03-12-v3/grow/
States dir: research/wa.cultiverapro.com/2026-03-12-v3/grow/states/

AUTHENTICATION: Navigate to https://wa.cultiverapro.com, log in, then switch to the Grow module via the module switcher (top bar).

NAVIGATION RULE: Always click sidebar items — never construct URLs. After each click, wait 3-5s and take a browser_snapshot to confirm content loaded.

PAGES TO CAPTURE (click each sidebar item):
1. Grow Cycles — overview screenshot, drill into first row → detail screenshot, back
   - Click "New Cycle" button → screenshot modal → record all form fields → Escape
2. Plants — overview screenshot, drill into first row → detail screenshot, back
   - Click "Add Plant" button → screenshot modal → record all form fields → Escape
3. Harvest — overview screenshot, drill into first row → detail screenshot, back
4. QA Lot — overview screenshot, drill into first row → detail screenshot, back
5. Rooms — overview screenshot
   - Click "Add Room" button → screenshot modal → record all form fields → Escape
6. Disposal — overview screenshot
   - Open the disposal_reason dropdown/select → screenshot ALL options open → save as grow/states/disposal-reason-dropdown.png
7. Grow Sources — overview screenshot
   - Open the plant_source_type dropdown/select → screenshot ALL options open → save as grow/states/plant-source-type-dropdown.png
8. Strains — overview screenshot
9. Mother Plants — overview screenshot (if exists)
10. Any other sidebar items not listed above

DESIGN TOKENS: Run the color + typography JS extraction on 2 different Grow pages.

After completing all items:
- Write grow/page-analysis.md with all entities, fields, and enum values found
- Update crawl-state-v3.json: set swarmAgents.grow.status to "complete"
- Report: "Grow module complete — N screenshots captured."
```

---

## Terminal 3 — Analytics Module

**When to run:** Same time as Terminal 2 (parallel).

```
I am scraping the Analytics module of Cultivera Pro as a parallel swarm agent.
This is a single-module focused crawl — Analytics only.

Credentials: seattlepg@hotmail.com / cultivera1
Output dir: research/wa.cultiverapro.com/2026-03-12-v3/analytics/
States dir: research/wa.cultiverapro.com/2026-03-12-v3/analytics/states/

AUTHENTICATION: Navigate to https://wa.cultiverapro.com, log in, then switch to the Analytics module via the module switcher (top bar).

NAVIGATION RULE: Always click — never construct URLs. Wait 3-5s after each click.

WHAT THIS MODULE IS: A grid of report cards. Each card opens a full report with charts and/or tables.

TASK: Click every report card. For each:
1. Screenshot the report detail page
2. Record: report title, chart type (bar/line/table/etc.), column headers if table, filter options visible
3. Click Back to return to the report grid
4. Move to the next card

THE 12 REPORTS (click each one):
1. Client By Product (already captured in v2 — still screenshot it for v3 consistency)
2. Product By Client
3. Expected Days of Inventory
4. Harvest Yield
5. Last Ordered By Account
6. Monthly Sales (12mo)
7. Monthly Sales Comparison
8. Monthly Sales By Rep
9. Production Run I/O
10. Product Line By Account
11. Sales Recommendations
12. Report 12 (unknown name — screenshot and record the actual title)

For each report, save as: analytics/states/[report-slug].png
Example: analytics/states/client-by-product.png

DESIGN TOKENS: Run color + typography JS extraction on the analytics overview page.

After completing all items:
- Write analytics/page-analysis.md listing each report with title, chart type, and columns
- Update crawl-state-v3.json: set swarmAgents.analytics.status to "complete"
- Report: "Analytics module complete — 12 reports captured."
```

---

## Terminal 4 — Inventory Module

**When to run:** Same time as Terminals 2 and 3 (parallel).

```
I am scraping the Inventory module of Cultivera Pro as a parallel swarm agent.
This is a single-module focused crawl — Inventory only.

Credentials: seattlepg@hotmail.com / cultivera1
Output dir: research/wa.cultiverapro.com/2026-03-12-v3/inventory/
States dir: research/wa.cultiverapro.com/2026-03-12-v3/inventory/states/

AUTHENTICATION: Navigate to https://wa.cultiverapro.com, log in, then switch to Inventory Management via the module switcher.

NAVIGATION RULE: Always click sidebar items — never construct URLs. Wait 3-5s after each click.

PAGES TO CAPTURE:
1. Batches — overview screenshot, drill into first row → batch detail screenshot, back
2. Products — overview screenshot, drill into first row → product detail screenshot, back
   - Click "Add Product" button → screenshot modal → record ALL form fields → Escape
3. Strains — overview screenshot
   - Click "Add Strain" button → screenshot modal → record ALL form fields → Escape
4. QA Results — overview screenshot, drill into first row → QA detail screenshot, back
   - Open the inventory_type filter/dropdown → screenshot ALL options → save as inventory/states/inventory-type-dropdown.png
5. Discounts & Promotions — overview screenshot
   - Open the discount_type dropdown/select → screenshot ALL options → save as inventory/states/discount-type-dropdown.png
   - Click "Add Discount" button if present → screenshot modal → record fields → Escape
6. Transfer History — overview screenshot, drill into first row if available

DESIGN TOKENS: Run color + typography JS extraction on 2 different Inventory pages.

After completing all items:
- Write inventory/page-analysis.md with all entities, fields, and enum values found
- Update crawl-state-v3.json: set swarmAgents.inventory.status to "complete"
- Report: "Inventory module complete — N screenshots captured."
```

---

## Terminal 5 — Fulfillment + Configuration

**When to run:** Same time as Terminals 2, 3, and 4 (parallel).
These two modules are smaller — combine them into one agent.

```
I am scraping the Fulfillment and Configuration modules of Cultivera Pro as a parallel swarm agent.

Credentials: seattlepg@hotmail.com / cultivera1
Output dirs:
  research/wa.cultiverapro.com/2026-03-12-v3/fulfillment/
  research/wa.cultiverapro.com/2026-03-12-v3/fulfillment/states/
  research/wa.cultiverapro.com/2026-03-12-v3/configuration/
  research/wa.cultiverapro.com/2026-03-12-v3/configuration/states/

AUTHENTICATION: Navigate to https://wa.cultiverapro.com, log in.

---
PART 1: FULFILLMENT MODULE

Switch to Fulfillment via module switcher. Always click sidebar — never construct URLs.

PAGES TO CAPTURE:
1. Delivery Schedule — overview screenshot
   - Open the delivery_route filter/dropdown → screenshot ALL options → save as fulfillment/states/delivery-route-dropdown.png
   - Drill into first delivery row → screenshot delivery detail → back
2. Vehicles — overview screenshot
   - Click "Add Vehicle" button → screenshot modal → record all form fields → Escape
3. Drivers — overview screenshot
   - Click "Add Driver" button → screenshot modal → record all form fields → Escape
4. Transfer Inbound — overview screenshot
   - Click "New Inbound Transfer" button → screenshot modal → record all form fields → Escape

---
PART 2: CONFIGURATION MODULE

Configuration supports direct URL navigation. Use browser_navigate for each route:

1. https://wa.cultiverapro.com/configuration#/users
   - Screenshot the user list
   - Click "Add User" button → screenshot modal → open the role dropdown → screenshot ALL role options → save as configuration/states/user-role-dropdown.png → record all role values → Escape
2. https://wa.cultiverapro.com/configuration#/account-management
   - Screenshot the list
   - Drill into first row → screenshot salesperson detail page → back
3. https://wa.cultiverapro.com/configuration#/audit
   - Screenshot audit log list
   - Drill into first row if drillable
4. https://wa.cultiverapro.com/configuration#/license (try this URL)
   - Screenshot if it loads

DESIGN TOKENS: Run color + typography JS extraction on 1 Fulfillment page and 1 Configuration page.

After completing both modules:
- Write fulfillment/page-analysis.md with entities, fields, enums found
- Write configuration/page-analysis.md with entities, fields, enums found
- Update crawl-state-v3.json: set swarmAgents.fulfillment.status and swarmAgents.configuration.status to "complete"
- Report: "Fulfillment + Configuration complete — N screenshots captured."
```

---

## Terminal 6 — Merge Agent (run AFTER all 5 complete)

Once Terminals 1–5 are all done, open one final Claude Code session and paste:

```
All 5 Cultivera Pro swarm agents have completed. Now generate the consolidated output documents.

Read all of these files:
- research/wa.cultiverapro.com/2026-03-12-v3/sales/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/grow/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/analytics/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/inventory/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/fulfillment/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/configuration/page-analysis.md
- research/wa.cultiverapro.com/2026-03-12-v3/crawl-state-v3.json

Also review screenshots in each module directory for additional context.

Then generate:
1. DATA_MODELS.md — all entities with fields, types, enum values, and relationships
2. DESIGN_SYSTEM.md — aggregated color palette with roles, typography scale, spacing scale
3. INDEX.md — complete site tree: every module, sub-page, interactive state, screenshot paths, component census
4. REBUILD_PLAN.md — task-by-task rebuild guide: architecture, build order, per-page tasks, confidence scores

Save all four files to: research/wa.cultiverapro.com/2026-03-12-v3/

Update crawl-state-v3.json status to "complete".
```

---

## Status Tracking

After each agent finishes, manually update `crawl-state-v3.json`:

```json
"swarmAgents": {
  "sales": { "status": "complete", "screenshots": N },
  "grow": { "status": "complete", "screenshots": N },
  "analytics": { "status": "complete", "screenshots": N },
  "inventory": { "status": "complete", "screenshots": N },
  "fulfillment": { "status": "complete", "screenshots": N },
  "configuration": { "status": "complete", "screenshots": N }
}
```
