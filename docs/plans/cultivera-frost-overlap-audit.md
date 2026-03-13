# Cultivera Pro vs Frost — Sales / CRM / Analytics Gap Analysis

> Generated: 2026-03-12
> Scope: Sales, CRM, Analytics modules only (excludes Grow, Inventory Management, Fulfillment, Configuration)
> Source data: Cultivera Pro scrape (2026-03-11T22-33-21) + Frost app source code

---

## 1. Executive Summary

**Cultivera Pro Sales module** has **9 sidebar pages** (Dashboard, Accounts, Account Groups, Carts, Inventory, Catalogs, Orders, Sales Person Report, Order Summary) plus a separate **Analytics** top-level module with a dashboard and 11+ report types.

**Frost** covers all 9 Sales sidebar routes + Analytics as routed pages. Additionally, Frost has 4 "extra" modules in the Sales category that have no Cultivera equivalent: **CRM** (6-tab mega-module), **Pipeline** (A/I/R matrix), **Competitor Intel**, and **Cultivera Bridge**.

| Metric | Count |
|--------|-------|
| Cultivera Sales pages | 9 |
| Cultivera Analytics pages | 1 (dashboard with 11 report tabs) |
| Total Cultivera pages in scope | 10 |
| Frost matching routes | 10/10 (100% route coverage) |
| Frost extra modules (no Cultivera equivalent) | 4 |
| Overall feature parity (weighted) | ~55% |

The 55% parity reflects that while every Cultivera route exists in Frost, several are **scaffolds** (Analytics is empty-state with tab stubs) and others lack specific Cultivera features (filter suites, export, batch allocation detail). However, Frost's CRM adds substantial new IP that Cultivera never had.

---

## 2. Module-by-Module Comparison Table

### Cultivera Sales Sidebar (9 pages)

| Cultivera Page | Cultivera Route | Frost Route | Frost Module | Build Status | Parity % | Missing Features |
|---|---|---|---|---|---|---|
| Dashboard | `crm#/dashboard` | `/sales-dashboard` | `sales-dashboard` | **FULL** | **75%** | Missing: "Top Accounts Up for Reorder" table, "Recent Orders by Status" donut chart. Has: SalesMetrics (5 KPI cards), WeeklySalesChart, ActiveCartsPanel, RecentOrdersPanel, RecentClientsPanel, My/All toggle |
| Accounts | `crm#/accounts` | `/accounts` | `accounts` | **FULL** | **85%** | Has: AccountsTable (Active/Inactive/All tabs), AccountDetail (5 tabs: Analytics, Orders, Notes, Recommendations, Discounts), 7 modals (Invite, AssignSalesperson, AddContact, UpdateClientInfo, UpdateNotes, DeliveryPrefs, InventoryPrefs), QuickFiltersModal, AddNonCannabisAccount. Missing: Cultivera column-level sort on all 15+ columns, "Market Connections" sidebar |
| Account Groups | `crm#/account-groups` | `/account-groups` | `account-groups` | **FULL** | **80%** | Has: AccountGroupsTable, AccountGroupDetail, CreateGroupModal. Types: territory/rep/custom groups. Missing: drag-to-reorder groups, bulk account assignment modal |
| Carts | `crm#/open-carts` | `/carts` | `carts` | **FULL** | **75%** | Has: CartsTable, CartDetail, CartLineItems, CartActions, AutoAllocateModal, ConversionSettingModal, MarkTradeSamplesModal. Missing: batch-level allocation detail view (Cultivera shows DOH, DOM, barcode, room per batch), portal order badge count |
| Inventory (VMI) | `crm#/products` | `/vmi` | (route exists, page scaffold) | **SCAFFOLD** | **30%** | Missing: Product-Line / Sub Product-Line / Product-Tag filter dropdowns, cannabinoid filters (THC/THCA/CBD ranges), price editing grid, "Save Price Changes" bulk action, "Share Menu" export. Types defined in `SalesInventoryItem` but no full page component |
| Catalogs | `crm#/product-catalogs` | `/catalogs` | `catalogs` | **FULL** | **70%** | Has: CatalogList, CatalogDetail, AddToCartModal. Missing: catalog sharing/export, catalog preview mode, permission-gated catalog visibility per account |
| Orders | `crm#/orders` | `/orders` | `orders` | **FULL** | **80%** | Has: OrdersPage (Dashboard + Queue tabs), OrdersDashboard (6 KPI cards, volume chart, revenue-by-category pie, top accounts), OrdersQueue (DataTable with status tabs, OrderDrawer, OrderPipeline 8-stage flow). 9 hooks. Missing: Cultivera's "Quick Filters" bar (status toggles: Submitted/Partially Sublotted/Sublotted/Ready For Manifest/Manifested/Quarantined/Invoiced), export to CSV |
| Sales Person Report | `crm#/sales-person-report` | `/sales-person-report` | `sales-person-report` | **FULL** | **60%** | Has: SalesPersonReportPage, ReportFilters, ReportTable. Missing: Cultivera's full filter suite (date range picker, rep multi-select, territory filter, status filter), comparison mode (rep-vs-rep), export to PDF/CSV |
| Order Summary | `crm#/order-summary` | `/order-summary` | `order-summary` | **FULL** | **60%** | Has: OrderSummaryPage, SummaryFilters, SummaryTable. Missing: Cultivera's full filter suite (date range, status multi-select, client search, rep filter), subtotal/total aggregation row, export to CSV/PDF |

### Cultivera Analytics Module

| Cultivera Page | Cultivera Route | Frost Route | Frost Module | Build Status | Parity % | Missing Features |
|---|---|---|---|---|---|---|
| Analytics Dashboard | `/app-analytics` | `/analytics` | `analytics` | **EMPTY** | **5%** | Has: AnalyticsLayout with 11 tab stubs and EmptyState placeholders. All 11 report types show "coming soon". Zero functional reports. Cultivera had 12 cards, 2 charts, date filters, and drill-downs on its analytics dashboard |

---

## 3. Overlap Items

### 3a. Accounts Overlap

| Surface | Location | Components | Scope |
|---------|----------|------------|-------|
| **Cultivera-parity Accounts** | `/accounts` | AccountsPage, AccountsTable, AccountDetail (5 tabs), 7 modals, QuickFiltersModal | Cultivera-faithful: SalesAccount type (clientName, licenseUBI, deliveryDays, fulfillmentPriority). 14 components total |
| **CRM Accounts** | `/crm?tab=accounts` | AccountsList, AccountsFilterBar, Segments (3 sub-components), TerritoryMap (3 sub-components) | Frost CRM: rich Account type (healthScore, pipelineStatus, categoryMix, contacts[], vmiEnrolled). 9 components |
| **CRM Account Detail** | `/crm?tab=accounts&account=...` | AccountDetail, AccountDetailHeader, AccountDetailTabs, 10 tab panels | 10-tab deep view: Profile, Purchases, Health, VMI, Interactions, Opportunities, Payments, Deliveries, Files, Notes |

**Decision:** Keep separate. `/accounts` serves as the Cultivera-parity "simple" account manager (matches the legacy workflow salespeople know). `/crm?tab=accounts` is the "power" view with health scores, pipeline, segments, territory map, and the 10-tab deep drill-down. Data types are separate (`SalesAccount` vs CRM `Account`).

### 3b. Dashboard Overlap

| Surface | Location | Components |
|---------|----------|------------|
| **Sales Dashboard** | `/sales-dashboard` | SalesDashboardPage: SalesMetrics (5 KPI cards), WeeklySalesChart, ActiveCartsPanel, RecentOrdersPanel, RecentClientsPanel. 6 components |
| **CRM Dashboard** | `/crm?tab=overview&sub=dashboard` | CRMDashboard: AIBriefingCard, MetricsRow, ChartsSection (5 chart types), ActivityFeed. 12+ components |

**Decision:** Keep separate. Sales Dashboard mirrors Cultivera's "quick glance" (orders, carts, weekly chart). CRM Dashboard is the AI-powered intelligence hub (briefing, health distribution, pipeline distribution, payment compliance, category coverage heat map).

### 3c. Analytics Overlap

| Surface | Location | Components |
|---------|----------|------------|
| **Analytics (Cultivera-parity)** | `/analytics` | AnalyticsLayout — 11 tab stubs, all empty |
| **CRM Intelligence > Analytics** | `/crm?tab=intelligence&sub=analytics` | Analytics.tsx + RevenueCharts, HealthModelView, ForecastView — functional revenue analytics, health model, forecast |

**Overlap:** CRM Intelligence Analytics covers ~4 of the 11 Cultivera report types (revenue by category, revenue by rep, health model, forecast). The remaining 7 reports (Client By Product, Product By Client, Expected Days of Inventory, Harvest Yield, Last Ordered By Account, Production Run I/O, Sales Recommendations) have no implementation anywhere.

### 3d. Orders Overlap

| Surface | Location | Components |
|---------|----------|------------|
| **Orders (Cultivera-parity)** | `/orders` | OrdersPage (Dashboard + Queue), OrdersDashboard, OrdersQueue, OrderDrawer, OrderPipeline, OrderStatusTabs, OrderQuickFiltersModal. 8 components, 9 hooks |
| **CRM Account Detail > Purchases** | `/crm?tab=accounts&account=X` → PurchasesTab | Order history per-account (AccountOrder type), inline table |
| **Cultivera Bridge > Order Intake** | `/cultivera?view=order-intake` | OrderIntake — bot-imported Cultivera marketplace orders, CultiveraOrderDrawer, push-to-orders action |

**Decision:** Three distinct views serving different workflows. `/orders` is the global order queue. CRM PurchasesTab is per-account history. Cultivera Order Intake is the inbound marketplace pipeline.

---

## 4. Cultivera-Only Gaps

Features present in Cultivera Pro that Frost currently lacks or has incomplete.

### P0 — Critical (blocks daily sales workflow)

| Gap | Detail | Impact |
|-----|--------|--------|
| **VMI / Sales Inventory page** | Cultivera's Sales > Inventory page has Product-Line, Sub Product-Line, Product-Tag dropdowns, cannabinoid range filters (THCA, THC, CBD), inline price editing grid, "Save Price Changes" bulk action, "Share Menu" export. Frost has `SalesInventoryItem` type but no functional page. | Salespeople cannot browse/filter available inventory for carts |
| **Batch-level allocation in Carts** | Cultivera shows per-batch detail (DOH days-on-hand, DOM date-of-manufacture, barcode, room, available/allocated/needed/remaining). Frost has `BatchAllocation` type but the AutoAllocateModal is simplified. | Reps can't verify exact batch allocation before submitting orders |

### P1 — High (significant workflow gap)

| Gap | Detail | Priority |
|-----|--------|----------|
| **Analytics — all 11 report types** | All empty-state stubs. The 11 Cultivera report types are: | P1 |
| | 1. Client By Product — which products each client buys | |
| | 2. Product By Client — which clients buy each product | |
| | 3. Expected Days of Inventory — sell-through forecast per SKU | |
| | 4. Harvest Yield — yield metrics by grow cycle/strain | |
| | 5. Last Ordered By Account — days since last order per account | |
| | 6. Monthly Sales (12mo) — rolling 12-month revenue chart | |
| | 7. Monthly Sales Comparison — month-over-month comparison | |
| | 8. Sales By Person — rep performance breakdown | |
| | 9. Production Run I/O — input/output ratio per production run | |
| | 10. Product-Line Sales by Account — revenue by product line per account | |
| | 11. Sales Recommendations — AI/rule-based reorder suggestions | |
| **Sales Person Report — filter suite** | Missing: date range picker, rep multi-select, territory filter, status filter, comparison mode, export | P1 |
| **Order Summary — filter/export suite** | Missing: date range picker, status multi-select, client search, rep filter, subtotal row, CSV/PDF export | P1 |
| **Quick status filters on Orders** | Cultivera has togglable status pills (Submitted, Partially Sublotted, Sublotted, Ready For Manifest, Manifested, Quarantined, Invoiced). Frost has OrderStatusTabs and OrderQuickFiltersModal but uses different status model (8-stage pipeline) | P1 |

### P2 — Medium (nice-to-have for parity)

| Gap | Detail | Priority |
|-----|--------|----------|
| **Market Connections** | Cultivera had a sidebar showing marketplace connections/invitations. No Frost equivalent except Cultivera bridge module | P2 |
| **"Top Accounts Up for Reorder" table** | On Cultivera Dashboard — shows Account, # Orders, Last Order. Frost Sales Dashboard has RecentClientsPanel but not this specific reorder-focused table | P2 |
| **Portal order badge** | Cultivera topbar shows portal order count badge (e.g., "2" linking to open carts from portal). No equivalent | P2 |
| **Catalog sharing/permissions** | Cultivera catalogs could be shared with specific accounts and had visibility controls | P2 |
| **Account drag-reorder in Groups** | Cultivera allowed reordering accounts within groups via drag | P2 |

### P3 — Low (cosmetic/minor)

| Gap | Detail | Priority |
|-----|--------|----------|
| **Kendo-style column sorting** | Cultivera used Kendo UI grids with per-column sort on all 15+ account columns | P3 |
| **CSV/PDF export across all tables** | Cultivera had export on most data tables | P3 |
| **Help video sidebar** | Cultivera had contextual help videos (Client Note Attributes, Start New Cart, Building an Order) | P3 |

---

## 5. Frost-Only Features (New IP)

Features in Frost that have **zero Cultivera equivalent**:

### CRM Module (6 tabs, 60+ components)

| Feature | Location | Components |
|---------|----------|------------|
| **Overview — AI Copilot** | `/crm?tab=overview&sub=copilot` | AICopilot, ChatInput, ChatMessage, ConversationSidebar, TypingIndicator. Natural-language CRM queries with suggested actions |
| **CRM Dashboard** | `/crm?tab=overview&sub=dashboard` | AIBriefingCard (AI daily briefing), MetricsRow (8 KPIs), ChartsSection (5 chart types: RevenueConcentrationDonut, ReorderCadenceHistogram, PaymentComplianceTrafficLight, CategoryCoverageHeatMap, InteractionOrderOverlay), ActivityFeed |
| **Accounts — Segments** | `/crm?tab=accounts&sub=segments` | SegmentBuilder (field/operator/value criteria), SegmentCard, SegmentPreview. Dynamic audience segmentation |
| **Accounts — Territory Map** | `/crm?tab=accounts&sub=territory` | WashingtonMap (SVG), TerritoryPanel, MapTooltip. Geographic account visualization by rep territory |
| **Accounts — Filter Bar** | `/crm?tab=accounts&sub=accounts` | AccountsFilterBar — region, rep, health tier, VMI, payment reliability, category filters |
| **Account Detail — 10 tabs** | `/crm?tab=accounts&account=X` | Profile, Purchases, Health (score + factors + recommendations + history chart), VMI (sell-through, inventory levels, days on hand), Interactions (timeline), Opportunities, Payments (reliability), Deliveries, Files, Notes |
| **Sales — Reorder Center** | `/crm?tab=sales&sub=reorder` | ReorderCenter, ReorderProposalDrawer. AI-generated reorder proposals with confidence scores, draft emails, product recommendations |
| **Sales — Leaderboard** | `/crm?tab=sales&sub=leaderboard` | Leaderboard — rep ranking by revenue, orders, health improvement, proposal accept rate, streak days, goal progress |
| **Sales — Price Book** | `/crm?tab=sales&sub=pricebook` | PriceBook — tiered pricing (Tier 1/2/3), cost, margin, per product |
| **Sales — Opportunities Pipeline** | `/crm?tab=sales&sub=opportunities` | OpportunitiesPipeline, OpportunityCard, OpportunityDrawer. Visual deal pipeline |
| **Outreach — Campaigns** | `/crm?tab=outreach&sub=campaigns` | CampaignsList, CampaignDrawer. Email/SMS campaigns with open/response rates, revenue attribution |
| **Outreach — Interactions Hub** | `/crm?tab=outreach&sub=interactions` | InteractionsHub, InteractionComposer. Cross-channel interaction logging (phone, email, sms, whatsapp, meeting, note, agent) |
| **Outreach — Vendor Days** | `/crm?tab=outreach&sub=vendor-days` | VendorDays, VendorDayCalendar, VendorDayDrawer. In-store event scheduling with pre/post revenue impact analysis |
| **Intelligence — Analytics** | `/crm?tab=intelligence&sub=analytics` | Analytics, RevenueCharts, HealthModelView, ForecastView. Revenue breakdown, health model factors/correlations, revenue forecasting |
| **Intelligence — Compliance Monitor** | `/crm?tab=intelligence&sub=compliance` | ComplianceMonitor — license expiration tracking, payment compliance (72-hour rule) |
| **Intelligence — Product Recommendations** | `/crm?tab=intelligence&sub=recommendations` | ProductRecommendations — AI product recs with competitor context, estimated revenue, confidence |
| **Intelligence — Win/Loss Log** | `/crm?tab=intelligence&sub=win-loss` | WinLossLog, WinLossDrawer — outcome tracking by reason category (pricing, quality, delivery, competitor, relationship, compliance) |
| **Tools — Playbooks** | `/crm?tab=tools&sub=playbooks` | Playbooks, PlaybookDetail, PlaybookExecution. Templated multi-step sales plays (new-account, win-back, category-expansion, product-launch, payment-issue, competitive-response) |

### Pipeline Module (11 components, 6 hooks)

| Feature | Location | Description |
|---------|----------|-------------|
| **A/I/R Matrix** | `/pipeline` | PipelineMatrix — 3x5 clickable grid (Active/Inactive/Recovery x Phase 1-5), PipelineMatrixCell with count + revenue |
| **Velocity Metrics** | `/pipeline` | 5 KPI cards: I1→I5, I5→A2, A2→A5, Recovery Rate, Churn Rate |
| **Movement Chart** | `/pipeline` | Grouped bar chart: advances vs declines by week |
| **Rep Performance** | `/pipeline` | Per-rep pipeline stats: active/inactive/recovery counts, advances/declines this month |
| **Transition Log** | `/pipeline` | Color-coded status transition history |

### Competitor Intel Module (3 components, 3 hooks)

| Feature | Location | Description |
|---------|----------|-------------|
| **Competitor Intel** | `/competitors` | CompetitorIntelPage, CompetitorDrawer. Competitor tracking with product comparison, alerts |

### Cultivera Bridge Module (10+ components)

| Feature | Location | Description |
|---------|----------|-------------|
| **Menu Sync** | `/cultivera?view=menu-sync` | Daily CSV sync to Cultivera marketplace, sync history, error detail |
| **Order Intake** | `/cultivera?view=order-intake` | Bot-automated order import from Cultivera, review queue, push-to-orders |
| **Marketing** | `/cultivera?view=marketing` | Cultivera ad campaign management (banner/brand ads, budget, stats) |
| **Marketplace** | `/cultivera?view=marketplace` | WA market intelligence, integration status, retailer notes |

### Other Frost-Only Features

| Feature | Description |
|---------|-------------|
| **Platform Dashboard** | `/dashboard` — cross-module alerts, KPIs, charts, quick actions |
| **Task Management** | `/tasks` — Kanban board with drag-and-drop, agent/meeting/work-order sources |
| **Calendar** | `/calendar` — unified scheduling across modules |
| **AI Agent Hub** | `/agents` — AI agent management |
| **Approvals** | `/approvals` — AI action approval queue |
| **Council** | `/council` — multi-agent deliberation |
| **Insights** | `/insights` — AI-generated operational insights |
| **Memory** | `/memory` — organizational knowledge base |

---

## 6. V2 Enhancement Opportunities

| Cultivera View | Frost Feature to Inject | Benefit |
|---|---|---|
| **Sales Dashboard** | Pipeline Distribution widget from CRM Dashboard | See A/I/R account distribution at a glance |
| **Sales Dashboard** | AI Briefing Card from CRM Dashboard | Morning briefing: reorders due, health drops, competitive alerts |
| **Sales Dashboard** | "Top Accounts Up for Reorder" from CRM Reorder Center | Show accounts with stale order cadence |
| **Accounts** | Health Score badge on each account row | Quick visual on account health without leaving the list |
| **Accounts** | Pipeline Badge (A3, I1, R2) on each account row | See pipeline state inline |
| **Account Detail** | CRM Health Tab data (factors, recommendations, history) | Deep health view within Cultivera-parity layout |
| **Carts** | AI Reorder Proposal integration | Pre-populate cart from AI recommendation |
| **Carts** | Batch allocation detail from `BatchAllocation` type | Show DOH, DOM, barcode per batch in allocation modal |
| **Orders** | Payment Compliance traffic light from CRM Intelligence | Flag orders approaching 72-hour payment window |
| **Orders** | CRM Interaction quick-log | Log a call/note directly from order context |
| **Sales Person Report** | Leaderboard metrics from CRM | Rank, streak, goal progress alongside Cultivera's volume metrics |
| **Sales Person Report** | Pipeline performance (advances/declines) | How each rep is moving accounts through A/I/R |
| **Order Summary** | Revenue forecast from CRM Intelligence | Projected revenue overlay on summary data |
| **Analytics** | CRM Analytics views as starting point | Port RevenueCharts, HealthModelView, ForecastView to fill empty tabs |
| **Analytics** | Competitor pricing overlay | Show competitor pricing alongside sales data |
| **Catalogs** | VMI sell-through data per product | Show which catalog items are moving fastest at each account |
| **VMI / Inventory** | Cannabinoid range filters | Filter by THC/THCA/CBD range as Cultivera did |

---

## 7. Salesperson Journey Analysis

### Daily Workflow Use Cases

#### Morning: Dashboard → Accounts → Carts → Orders → Alerts

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| Check dashboard KPIs | Sales Dashboard | **BUILT** | `sales-dashboard/components/SalesMetrics.tsx` — 5 KPI cards |
| Review AI briefing | CRM Dashboard | **BUILT** | `crm/components/dashboard/AIBriefingCard.tsx` |
| Check platform alerts | Platform Dashboard | **BUILT** | `dashboard/components/AlertsRow.tsx` |
| Check open carts | Carts page | **BUILT** | `carts/components/CartsTable.tsx` |
| Review pending orders | Orders Queue | **BUILT** | `orders/components/OrdersQueue.tsx` with status tabs |
| Check reorder-due accounts | Reorder Center | **BUILT** | `crm/components/sales/ReorderCenter.tsx` — AI proposals |
| Coverage: **85%** | Missing: "Top Accounts Up for Reorder" in Sales Dashboard, portal order badge |

#### Prospecting: Territory Map → Accounts → Health/Sentiment → Plan Visits

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| View territory map | CRM Territory Map | **BUILT** | `crm/components/accounts/TerritoryMap.tsx`, `territory/WashingtonMap.tsx` |
| Filter by region/health | CRM Accounts Filter | **BUILT** | `crm/components/accounts/AccountsFilterBar.tsx` |
| Check account health score | CRM Account Detail > Health | **BUILT** | `crm/components/account-detail/tabs/HealthTab.tsx` |
| View segments | CRM Segments | **BUILT** | `crm/components/accounts/Segments.tsx`, `segments/SegmentBuilder.tsx` |
| Plan route / visits | — | **MISSING** | No route optimization or visit planning tool |
| Coverage: **80%** | Missing: route planner, visit scheduling integration |

#### Account Visit: Detail → Order History → Notes → Interactions → Cart

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| Review account profile | CRM Account Detail > Profile | **BUILT** | `crm/components/account-detail/tabs/ProfileTab.tsx` |
| Check order history | CRM Account Detail > Purchases | **BUILT** | `crm/components/account-detail/tabs/PurchasesTab.tsx` |
| Review notes | CRM Account Detail > Notes | **BUILT** | `crm/components/account-detail/tabs/NotesTab.tsx` |
| Review interactions | CRM Account Detail > Interactions | **BUILT** | `crm/components/account-detail/tabs/InteractionsTab.tsx` |
| Check VMI data | CRM Account Detail > VMI | **BUILT** | `crm/components/account-detail/tabs/VMITab.tsx` |
| Check health factors | CRM Account Detail > Health | **BUILT** | `crm/components/account-detail/tabs/HealthTab.tsx` |
| Start cart for account | Carts page | **BUILT** | `carts/components/CartsPage.tsx` |
| Coverage: **95%** | Missing: deep link from account detail to pre-populated cart |

#### Post-Visit: Log Interaction → Notes → Follow-up → Nurture Nudge

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| Log interaction | CRM Interactions Hub | **BUILT** | `crm/components/outreach/InteractionsHub.tsx`, `InteractionComposer.tsx` |
| Add notes | CRM Account Detail > Notes | **BUILT** | `crm/components/account-detail/tabs/NotesTab.tsx` |
| Create follow-up task | Tasks module | **PARTIAL** | `tasks/components/TaskBoard.tsx` — manual task creation, no auto-generation from interactions |
| Nurture nudge alert | — | **MISSING** | No automated "going cold" alerts or nurture tracking |
| Coverage: **60%** | Missing: auto-generated follow-up tasks, nurture nudge system |

#### Weekly: Pipeline → Leaderboard → Sales Person Report

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| Review pipeline matrix | Pipeline page | **BUILT** | `pipeline/components/PipelinePage.tsx`, `PipelineMatrix.tsx` |
| Check leaderboard | CRM Sales > Leaderboard | **BUILT** | `crm/components/sales/Leaderboard.tsx` |
| Sales person report | Sales Person Report | **BUILT** | `sales-person-report/components/SalesPersonReportPage.tsx` |
| Review movements | Pipeline Movement Chart | **BUILT** | `pipeline/components/PipelineMovementChart.tsx` |
| Coverage: **90%** | Missing: filter suite on Sales Person Report |

#### Monthly: Analytics → Win/Loss → Compliance → Forecast

| Step | Tool | Status | Component / File |
|------|------|--------|------------------|
| Revenue analytics | CRM Intelligence > Analytics | **BUILT** | `crm/components/intelligence/Analytics.tsx`, `analytics/RevenueCharts.tsx` |
| Win/loss analysis | CRM Intelligence > Win/Loss | **BUILT** | `crm/components/intelligence/WinLossLog.tsx`, `WinLossDrawer.tsx` |
| Compliance monitoring | CRM Intelligence > Compliance | **BUILT** | `crm/components/intelligence/ComplianceMonitor.tsx` |
| Revenue forecast | CRM Intelligence > Forecast | **BUILT** | `crm/components/intelligence/analytics/ForecastView.tsx` |
| Cultivera analytics reports | Analytics module | **MISSING** | All 11 report tabs are empty stubs |
| Coverage: **70%** | Missing: all 11 Cultivera-specific analytics reports |

### Intelligence Feature Evaluation

| Intelligence Feature | Status | Component / File | Notes |
|---|---|---|---|
| **Sentiment Score Tracking** | **PARTIAL** | `crm/types/index.ts` — `Interaction.sentiment: 'positive' \| 'neutral' \| 'negative'`. `InteractionsTab.tsx` displays per-interaction sentiment | Per-interaction sentiment exists. Missing: aggregate account-level sentiment score, sentiment-over-time chart, trend tracking |
| **Nurture Tracker / Nurture Nudge** | **MISSING** | No component | No touchpoint frequency tracking. No "going cold" alerts. No nurture cadence management. Closest: `AIBriefingCard.tsx` has reorder-type briefing items |
| **Order Frequency Intelligence** | **PARTIAL** | `crm/components/dashboard/charts/ReorderCadenceHistogram.tsx` — histogram of days between orders. `ReorderCenter.tsx` — `daysSinceLastOrder` field on proposals | Reorder cadence histogram exists. Reorder proposals track days since last order. Missing: per-account reorder pattern analysis, declining frequency alerts |
| **Communication Timeline** | **BUILT** | `crm/components/account-detail/tabs/InteractionsTab.tsx` — unified cross-channel view (phone, email, sms, whatsapp, meeting, note, agent) | Full implementation. 7 channels tracked with direction, timestamps, sentiment |
| **Proactive Alerts** | **PARTIAL** | `crm/components/dashboard/AIBriefingCard.tsx` — briefing items typed as: reorder, payment, health, competitive, opportunity, pipeline. `dashboard/components/AlertsRow.tsx` — platform-level alerts | AI Briefing covers health/reorder/competitive/payment/pipeline alerts. Missing: automated trigger rules (health below threshold → alert, reorder overdue → alert, sentiment drop → alert). Currently mock data, no event system |

---

## 8. Pipeline-Driven Workflow Analysis

### Pipeline Dashboard Visibility

| Surface | Pipeline Visible? | How |
|---------|-------------------|-----|
| `/pipeline` | **YES** | Full A/I/R matrix, velocity metrics, movement chart, rep performance, transition log |
| `/crm?tab=overview&sub=dashboard` | **YES** | `pipelineDistribution` in CRM Dashboard data, `recoveryFunnel` chart |
| `/crm?tab=accounts` | **YES** | `Account.pipelineStatus` + `Account.pipelinePhase` on each account row |
| `/crm?tab=accounts&account=X` | **YES** | `Account.pipeline` (PipelineInfo) shown in account detail header |
| `/sales-dashboard` | **NO** | No pipeline data surfaced |
| `/accounts` | **NO** | Uses `SalesAccount` type (no pipeline fields) |
| `/orders` | **NO** | Orders don't reference pipeline state |
| `/tasks` | **NO** | Tasks have no `pipelineCode` field |

**Where pipeline SHOULD surface (V2):**
- `/sales-dashboard` — pipeline distribution widget, at-risk accounts by pipeline state
- `/accounts` — pipeline badge on each row (even in Cultivera-parity view)
- `/orders` — show account's pipeline state on order details
- `/tasks` — filter tasks by pipeline context

### A5 as North Star — Per-Phase Tool Coverage

#### Active Track (A1–A5)

| Phase | Label | Available Tools | Missing Tools |
|-------|-------|-----------------|---------------|
| **A1** — New Buyer | Onboarding, first order | Playbooks (new-account type) `crm/components/tools/Playbooks.tsx`, Interaction Composer, Cart creation | First-order nudge automation, onboarding checklist auto-task, "welcome kit" workflow |
| **A2** — Established | Reorder cadence, product expansion | Reorder Center (cadence analysis) `crm/components/sales/ReorderCenter.tsx`, Product Recommendations `crm/components/intelligence/ProductRecommendations.tsx`, Purchase history | Category expansion playbook trigger, reorder reminder automation |
| **A3** — Growing | VMI enrollment push, volume growth | VMI Tab (sell-through, inventory levels) `crm/components/account-detail/tabs/VMITab.tsx`, Opportunities Pipeline | VMI enrollment workflow, volume milestone alerts, growth trajectory chart |
| **A4** — Premium | Auto-reorder activation, vendor days | Vendor Days `crm/components/outreach/VendorDays.tsx` + impact analysis, Campaigns `crm/components/outreach/CampaignsList.tsx` | Auto-reorder activation workflow, premium account playbook, exclusive product access |
| **A5** — Strategic Partner | Maintenance, health monitoring, competitive defense | Health Tab `crm/components/account-detail/tabs/HealthTab.tsx`, Compliance Monitor `crm/components/intelligence/ComplianceMonitor.tsx`, Win/Loss Log, Competitor Intel | Competitive defense playbook auto-trigger, strategic review scheduling, relationship health dashboard |

#### Inactive Track (I1–I5)

| Phase | Label | Available Tools | Missing Tools |
|-------|-------|-----------------|---------------|
| **I1** — Cold Lead | Initial outreach | Interaction Composer, Campaigns (win-back type) | Lead scoring, cold outreach sequence automation |
| **I2** — Contacted | Follow-up, qualification | Interactions Hub (history), Playbooks | Auto follow-up scheduling, qualification scorecard |
| **I3** — Engaged | Sampling, demos | Vendor Days, Account Notes | Sample tracking workflow, engagement scoring |
| **I4** — Sampling | Product trials | Product Recommendations, Opportunities | Sample-to-order conversion tracking, trial feedback capture |
| **I5** — Converting | Close deal | Opportunities Pipeline, Carts, Price Book | Conversion milestone alerts, deal closing playbook |

#### Recovery Track (R1–R5)

| Phase | Label | Available Tools | Missing Tools |
|-------|-------|-----------------|---------------|
| **R1** — Signal Detected | Identify decline | AI Briefing (health-type alerts), Health Tab | Automated signal detection rules, decline notification |
| **R2** — Confirmed Decline | Investigate cause | Win/Loss Log, Interactions history, Health factors | Root cause analysis template, competitive intelligence overlay |
| **R3** — Active Recovery | Execute recovery plan | Playbooks (win-back, competitive-response), Campaigns | Recovery playbook auto-assignment, progress tracking |
| **R4** — Re-engaging | Rebuild relationship | Vendor Days, Interaction Composer, Reorder Center | Re-engagement scoring, sentiment trend monitoring |
| **R5** — Recovered | Confirm recovery | Health Tab trend, Purchase history | Recovery confirmation criteria, A-track re-entry workflow |

### Pipeline → Tasks Bridge

| Trigger Event | Auto-generates Task? | Status |
|---|---|---|
| Account drops to Inactive (any phase) | **NO** | Not implemented. No event listener between pipeline state changes and task creation |
| Health score below threshold | **NO** | `Account.healthScore` exists but no threshold watcher |
| VMI velocity reorder trigger | **NO** | VMI data exists (`AccountVMIData`) but no velocity-to-task automation |
| Stale phase (account in same phase > X days) | **NO** | `PipelineInfo.enteredDate` tracks phase entry but no staleness check |
| Recovery signal detected | **NO** | AI Briefing has recovery items but no task auto-creation |
| Playbook step due | **NO** | `PlaybookExecution.currentStep` exists but no task integration |
| License expiring | **NO** | `ComplianceLicense.daysRemaining` exists but no auto-task |
| Payment overdue | **NO** | `CompliancePayment.status === 'overdue'` exists but no auto-task |

**Summary: 0/8 pipeline events auto-generate tasks.** The `Task` type in `apps/app/src/modules/tasks/types/index.ts` has `linkedAccountId` and `linkedOrderId` fields but no `pipelineCode` field. Tasks and pipeline are completely disconnected.

### Pipeline → AI Proposals

| Question | Answer |
|----------|--------|
| Does Reorder Center reference pipeline state? | **PARTIAL** — `ReorderProposal.source` includes 'vmi-velocity' and 'cadence-analysis' but doesn't reference pipeline phase. The proposal doesn't know if an account is A2 vs A4 |
| Does AI Copilot know pipeline state? | **PARTIAL** — `Account.pipeline` exists on the data model, but Copilot is mock/UI-only. No actual AI integration |
| Does Product Recommendations consider pipeline? | **NO** — `ProductRecommendation` has `accountId` but no pipeline context |
| Are proposals different for A1 vs A5 accounts? | **NO** — Same proposal format regardless of pipeline phase |

### Tasks as Pipeline Execution

| Question | Answer |
|----------|--------|
| Can reps filter tasks by pipeline context? | **NO** — `TaskFilter` has status, priority, assignee, module, source fields. No pipeline filter |
| Does Task type have `pipelineCode` field? | **NO** — Checked `apps/app/src/modules/tasks/types/index.ts`. Fields: id, title, description, status, priority, assignee, dueDate, module, moduleRoute, linkedAccountId, linkedOrderId, tags, source. No pipelineCode |
| Can tasks be grouped by pipeline phase? | **NO** — `useTaskBoardStore` in `apps/app/src/modules/tasks/store.ts` has columns: To Do, In Progress, Done, Blocked. No pipeline-based grouping |
| Do agent-generated tasks reference pipeline? | **NO** — Mock tasks in `apps/app/src/mocks/tasks.ts` have `source: 'agent'` but no pipeline reference |

---

## 9. Recommended Gap-Fill Sequence

### Phase 1: Pipeline Visibility (1-2 days)
**Goal:** Make pipeline state visible everywhere, not just `/pipeline`

| Task | Priority | Effort |
|------|----------|--------|
| Add PipelineBadge to Sales Dashboard (account list panels) | P0 | S |
| Add pipeline distribution widget to Sales Dashboard | P0 | M |
| Add PipelineBadge to Cultivera-parity Accounts table rows | P1 | S |
| Add pipeline state to Order Drawer (account context) | P1 | S |
| Add `pipelineCode` field to Task type | P1 | S |
| Add pipeline filter to TaskFilter | P1 | S |

### Phase 2: Pipeline → Task Auto-Generation (2-3 days)
**Goal:** Pipeline events create actionable tasks automatically

| Task | Priority | Effort |
|------|----------|--------|
| Build pipeline event watcher (threshold-based triggers) | P0 | L |
| Auto-task: account enters Inactive → "Win-back outreach" task | P0 | M |
| Auto-task: health below 40 → "Health review" task with account link | P0 | M |
| Auto-task: phase stale > 30 days → "Phase review" task | P1 | M |
| Auto-task: license expiring < 30 days → "License renewal" task | P1 | S |
| Auto-task: payment overdue > 3 days → "Payment follow-up" task | P1 | S |
| Auto-task: playbook step due → "Execute playbook step" task | P2 | M |

### Phase 3: Salesperson Intelligence Features (3-4 days)
**Goal:** Build the missing intelligence layer for proactive selling

| Task | Priority | Effort |
|------|----------|--------|
| **Nurture Tracker** — track touchpoint frequency per account, "going cold" alerts when interaction gap exceeds cadence | P0 | L |
| **Account Sentiment Score** — aggregate per-interaction sentiment into account-level score with trend chart | P0 | M |
| **Order Frequency Intelligence** — detect declining order frequency, surface in AI Briefing | P1 | M |
| **Proactive Alert Rules Engine** — configurable threshold triggers (health, sentiment, reorder, compliance) that create briefing items and tasks | P1 | L |
| **Visit Route Planner** — sequence account visits by geography and priority | P2 | L |

### Phase 4: Cultivera Parity Gaps (4-5 days)
**Goal:** Fill remaining Cultivera-specific feature gaps

| Task | Priority | Effort |
|------|----------|--------|
| **VMI/Sales Inventory page** — build full page with Product-Line/Sub/Tag filters, cannabinoid range filters, price editing grid | P0 | L |
| **Analytics — implement 4 core reports** — Monthly Sales (12mo), Sales By Person, Client By Product, Product By Client | P1 | L |
| **Analytics — implement 4 secondary reports** — Last Ordered By Account, Monthly Sales Comparison, Product-Line Sales by Account, Expected Days of Inventory | P1 | L |
| **Analytics — implement 3 operational reports** — Harvest Yield, Production Run I/O, Sales Recommendations | P2 | L |
| **Sales Person Report filter suite** — date range, rep multi-select, territory, status, comparison mode, export | P1 | M |
| **Order Summary filter/export suite** — date range, status multi-select, client search, rep filter, subtotal row, CSV/PDF | P1 | M |
| **Batch allocation detail in Carts** — DOH, DOM, barcode, room per batch | P1 | M |
| **CSV/PDF export on all data tables** — shared utility | P2 | M |

### Phase 5: V2 AI Enhancements into Cultivera Views (3-4 days)
**Goal:** Inject Frost's AI intelligence into the familiar Cultivera-layout pages

| Task | Priority | Effort |
|------|----------|--------|
| AI Briefing Card on Sales Dashboard | P1 | S |
| Health Score badge on Accounts table | P1 | S |
| Reorder proposal integration in Cart creation flow | P1 | M |
| Payment Compliance traffic light on Orders | P2 | S |
| Competitive pricing overlay in Analytics reports | P2 | M |
| Pipeline-aware Reorder Proposals (different recommendations for A1 vs A4) | P2 | M |
| AI Copilot context awareness of pipeline state | P2 | M |

---

### Effort Key
- **S** = Small (< 2 hours)
- **M** = Medium (2-6 hours)
- **L** = Large (6+ hours)

### Total Estimated Effort
- Phase 1: 1-2 days
- Phase 2: 2-3 days
- Phase 3: 3-4 days
- Phase 4: 4-5 days
- Phase 5: 3-4 days
- **Total: ~15-18 working days** to achieve full parity + intelligence layer
