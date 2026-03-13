# Sales Module Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild 8 Sales module pages to match Cultivera Pro's layout with Frost design tokens, plus reorder the sidebar.

**Architecture:** Phase 0 (foundation) creates shared types, mock data, and sidebar changes. Phase 1 swarms 8 parallel agents — one per page — each building a complete module folder (components, hooks, types). Phase 2 integrates and verifies the build.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod, Recharts, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-12-sales-module-rebuild-design.md`
**Cultivera Research:** `research/wa.cultiverapro.com/2026-03-12-v3/sales/` (screenshots + `page-analysis.md`)

---

## Critical Context for All Agents

### Project Conventions
- **Module pattern:** `src/modules/[name]/components/`, `hooks/`, `types/`
- **Page files:** `src/app/(modules)/[route]/page.tsx` — thin wrappers that import from modules
- **Shared components:** Import from `@/components` (SectionHeader, MetricCard, StatusBadge, AccentCard, EmptyState, LoadingSkeleton, etc.)
- **Design tokens:** All colors via CSS variables in `src/design/tokens.css`. Use Tailwind utility classes (`bg-card`, `text-default`, `border-default`, etc.)
- **Data hooks:** TanStack Query wrappers with `queryKey` arrays and simulated delays via `setTimeout`
- **Accent color for Sales:** `#F59E0B`
- **No `any`** in public component props. No business logic in `page.tsx`.

### Reference Files to Read Before Building
- `src/modules/cultivation/` — complete module example (components, hooks, types, store)
- `src/modules/manufacturing/` — another complete module example
- `src/components/index.ts` — barrel export of all shared components
- `src/design/tokens.css` — all CSS custom properties
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/page-analysis.md` — Cultivera data models and page specs

### File Ownership Rules
No Phase 1 agent touches these files (Phase 0 only):
- `apps/app/src/components/AppShell/nav-data.ts`
- `apps/app/src/components/AppShell/Sidebar.tsx`
- `apps/app/src/modules/sales/types/index.ts`
- `apps/app/src/mocks/sales.ts`

---

## Chunk 1: Phase 0 — Foundation

### Task 0.1: Sidebar Reorder — nav-data.ts

**Files:**
- Modify: `apps/app/src/components/AppShell/nav-data.ts`

- [ ] **Step 1: Read current nav-data.ts** to understand the NavCategory/NavItem types and the Sales category structure.

- [ ] **Step 2: Add `extraItems` to the type**

Add `extraItems?: NavItem[]` to the `NavCategory` interface (or type — match whatever the file uses).

- [ ] **Step 3: Reorder Sales category items**

Reorder `items` array to match Cultivera order:
1. Dashboard (`/sales-dashboard`, LayoutDashboard)
2. Accounts (`/accounts`, Users)
3. Account Groups (`/account-groups`, UsersRound)
4. Carts (`/carts`, ShoppingBag)
5. Inventory (`/vmi`, BarChart3) — keep current icon
6. Catalogs (`/catalogs`, BookOpen)
7. Orders (`/orders`, ClipboardList)
8. Sales Person Report (`/sales-person-report`, PieChart)
9. Order Summary (`/order-summary`, FileText)

Move these to `extraItems`:
10. CRM (`/crm`, Users)
11. Pipeline (`/pipeline`, GitBranch)
12. Competitor Intel (`/competitors`, Target)
13. Cultivera (`/cultivera`, Leaf)

- [ ] **Step 4: Verify build** — `npx tsc --noEmit` passes.

---

### Task 0.2: Sidebar Separator — Sidebar.tsx

**Files:**
- Modify: `apps/app/src/components/AppShell/Sidebar.tsx`

- [ ] **Step 1: Read current Sidebar.tsx** to understand the rendering logic for route-based items (the `filteredItems.map(...)` section).

- [ ] **Step 2: Add extraItems filtering**

After the existing `filteredItems` memo, add a new memo:
```tsx
const filteredExtraItems = useMemo(() => {
  if (!activeCategory?.extraItems) return [];
  return activeCategory.extraItems.filter((item) => allowedModules.has(item.slug));
}, [activeCategory, allowedModules]);
```

- [ ] **Step 3: Render separator + extra items**

After the `filteredItems.map(...)` block and before `</nav>`, add:

```tsx
{/* Separator between core and Frost-extra items */}
{filteredExtraItems.length > 0 && filteredItems.length > 0 && !collapsed && (
  <div className="my-2 mx-3 h-px bg-border-default" />
)}

{/* Frost-extra route items */}
{filteredExtraItems.map((item) => {
  // Same rendering logic as filteredItems — copy the Link block
})}
```

Use the exact same `<Link>` rendering as the existing route items.

- [ ] **Step 4: Verify build** — `npx tsc --noEmit` passes. Check localhost — Sales sidebar should show 9 items, separator, then 4 extras.

- [ ] **Step 5: Commit**
```bash
git add apps/app/src/components/AppShell/nav-data.ts apps/app/src/components/AppShell/Sidebar.tsx
git commit -m "feat: reorder Sales sidebar to match Cultivera, add separator for Frost extras"
```

---

### Task 0.3: Shared Sales Types

**Files:**
- Create: `apps/app/src/modules/sales/types/index.ts`

- [ ] **Step 1: Create the file** with all exported types from the spec (Part 2). Key types:

```typescript
export type SalesOrderStatus = 'submitted' | 'sublotted' | 'manifested' | 'quarantined' | 'invoiced' | 'paid' | 'partially-sublotted';
export type AccountStatus = 'active' | 'inactive';
export type FulfillmentPriority = 'fifo' | 'newest-first' | 'highest-qa' | 'lowest-qa';
export type AllocationMode = 'combine' | 'generate-multiple';

export interface SalesAccount { /* see spec */ }
export interface SalesContact { /* see spec */ }
export interface SalesOrder { /* see spec */ }
export interface Cart { /* see spec */ }
export interface CartLineItem { /* see spec */ }
export interface BatchAllocation { /* see spec */ }
export interface Catalog { /* see spec */ }
export interface CatalogProduct { /* see spec */ }
export interface SalesInventoryItem { /* see spec */ }
export interface AccountGroup { /* see spec */ }
export interface SalesRepReport { /* see spec */ }
export type OrderSummaryRow = SalesOrder & { tradeName: string };
```

Copy the full interface definitions from `docs/superpowers/specs/2026-03-12-sales-module-rebuild-design.md` Part 2.

- [ ] **Step 2: Verify** — `npx tsc --noEmit`

---

### Task 0.4: Mock Data Factories

**Files:**
- Create: `apps/app/src/mocks/sales.ts`

- [ ] **Step 1: Read existing mock files** (`src/mocks/inventory.ts`, `src/mocks/manufacturing.ts`) to match the factory function pattern.

- [ ] **Step 2: Create `sales.ts`** with factory functions for all entities:

```typescript
import { SalesAccount, SalesOrder, Cart, /* ... */ } from '@/modules/sales/types';

// Cannabis dispensary account names
const ACCOUNT_NAMES = ['Green Leaf Collective', 'Emerald City Cannabis', 'Puget Sound Provisions', 'Cascade Wellness', 'Olympic Gardens', /* 15-20 more */];

// Sales rep names from Cultivera
const SALES_REPS = ['Michael Perkins', 'Nichole Cluff', 'Richard Maloney', 'Stacia Hartwell', 'Support Cultivera'];

export function generateAccounts(count = 30): SalesAccount[] { /* ... */ }
export function generateOrders(count = 50, accounts: SalesAccount[]): SalesOrder[] { /* ... */ }
export function generateCarts(count = 15, accounts: SalesAccount[]): Cart[] { /* ... */ }
export function generateCatalogs(count = 5): Catalog[] { /* ... */ }
export function generateAccountGroups(count = 8): AccountGroup[] { /* ... */ }
export function generateSalesRepReports(reps = SALES_REPS): SalesRepReport[] { /* ... */ }
export function generateOrderSummary(count = 100): OrderSummaryRow[] { /* ... */ }
export function generateContacts(count = 40, accounts: SalesAccount[]): SalesContact[] { /* ... */ }
export function generateBatchAllocations(count = 10): BatchAllocation[] { /* ... */ }
```

Generate 20-50 records per entity. Use realistic WA state addresses, license numbers (format: `######`), consistent cross-references.

- [ ] **Step 3: Verify** — `npx tsc --noEmit`

- [ ] **Step 4: Commit**
```bash
git add apps/app/src/modules/sales/ apps/app/src/mocks/sales.ts
git commit -m "feat: add shared Sales types and mock data factories"
```

---

## Chunk 2: Phase 1 — Parallel Page Builds (8 Agents)

Each task below is assigned to ONE parallel agent. All 8 run simultaneously. Each agent follows this pattern:

1. Read the Cultivera screenshot(s) for their page (image files)
2. Read `page-analysis.md` for data models
3. Read an existing complete module (e.g., `src/modules/cultivation/`) for architecture patterns
4. Read `src/components/index.ts` for available shared components
5. Build module folder: `components/`, `hooks/`, `types/`
6. Replace existing page.tsx stub
7. Run `npx tsc --noEmit` to verify

---

### Task 1: Sales Dashboard (`/sales-dashboard`)

**Agent prompt context:** "You are building the Sales Dashboard page for the Frost cannabis operations app."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/dashboard.png`
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/states/dashboard-my-accounts-toggle.png`

**Files:**
- Create: `apps/app/src/modules/sales-dashboard/components/SalesDashboardPage.tsx`
- Create: `apps/app/src/modules/sales-dashboard/components/SalesMetrics.tsx`
- Create: `apps/app/src/modules/sales-dashboard/components/WeeklySalesChart.tsx`
- Create: `apps/app/src/modules/sales-dashboard/components/ActiveCartsPanel.tsx`
- Create: `apps/app/src/modules/sales-dashboard/components/RecentOrdersPanel.tsx`
- Create: `apps/app/src/modules/sales-dashboard/components/RecentClientsPanel.tsx`
- Create: `apps/app/src/modules/sales-dashboard/hooks/index.ts`
- Create: `apps/app/src/modules/sales-dashboard/types/index.ts`
- Modify: `apps/app/src/app/(modules)/sales-dashboard/page.tsx`

- [ ] **Step 1: Read reference files** — Read the screenshots, `page-analysis.md`, `src/modules/cultivation/` for patterns, `src/components/index.ts` for shared components.

- [ ] **Step 2: Create types** — `types/index.ts` importing from `@/modules/sales/types` plus any dashboard-specific types (e.g., `SalesDashboardMetrics`, `WeeklySalesData`).

- [ ] **Step 3: Create hooks** — `hooks/index.ts` with TanStack Query hooks: `useSalesDashboardMetrics`, `useWeeklySales`, `useActiveCartsSummary`, `useRecentOrders`, `useRecentClients`. Import mock factories from `@/mocks/sales`.

- [ ] **Step 4: Create SalesMetrics.tsx** — 4 MetricCards in a row (Total Accounts, Active Carts, Sales YTD, Revenue YTD). Use `MetricCard` from `@/components`.

- [ ] **Step 5: Create WeeklySalesChart.tsx** — Recharts `BarChart` with 7-day data. Match Cultivera's chart layout from screenshot.

- [ ] **Step 6: Create panels** — `ActiveCartsPanel.tsx`, `RecentOrdersPanel.tsx`, `RecentClientsPanel.tsx`. Each in an `AccentCard` with a data list.

- [ ] **Step 7: Create SalesDashboardPage.tsx** — Compose all components. Add "My Accounts" toggle (`useState`) that filters all panels to current user's accounts.

- [ ] **Step 8: Update page.tsx** — Replace `EmptyState` stub with `<SalesDashboardPage />` import.

- [ ] **Step 9: Verify** — `npx tsc --noEmit`

---

### Task 2: Accounts (`/accounts`)

**Agent prompt context:** "You are building the Accounts page — the most complex page with 7 modals and 5-tab detail view."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/accounts-all.png`
- All `states/account-*.png` files (12 screenshots)
- `states/accounts-*.png` files (3 screenshots)
- `states/add-non-cannabis-account-modal.png`

**Files:**
- Create: `apps/app/src/modules/accounts/components/AccountsPage.tsx`
- Create: `apps/app/src/modules/accounts/components/AccountsTable.tsx`
- Create: `apps/app/src/modules/accounts/components/AccountDetail.tsx`
- Create: `apps/app/src/modules/accounts/components/AccountDetailTabs.tsx`
- Create: `apps/app/src/modules/accounts/components/QuickFiltersModal.tsx`
- Create: `apps/app/src/modules/accounts/components/InviteModal.tsx`
- Create: `apps/app/src/modules/accounts/components/AssignSalespersonModal.tsx`
- Create: `apps/app/src/modules/accounts/components/AddContactModal.tsx`
- Create: `apps/app/src/modules/accounts/components/UpdateClientInfoModal.tsx`
- Create: `apps/app/src/modules/accounts/components/UpdateNotesModal.tsx`
- Create: `apps/app/src/modules/accounts/components/UpdateDeliveryPrefsModal.tsx`
- Create: `apps/app/src/modules/accounts/components/UpdateInventoryPrefsModal.tsx`
- Create: `apps/app/src/modules/accounts/components/AddNonCannabisAccountModal.tsx`
- Create: `apps/app/src/modules/accounts/hooks/index.ts`
- Create: `apps/app/src/modules/accounts/types/index.ts`
- Modify: `apps/app/src/app/(modules)/accounts/page.tsx`

- [ ] **Step 1: Read all reference files** — all 16 screenshots + page-analysis.md + existing module patterns.

- [ ] **Step 2: Create types** — Import from `@/modules/sales/types`. Add component-specific types (filter state, tab enum).

- [ ] **Step 3: Create hooks** — `useAccounts` (list with tab filter: Active/Inactive/All), `useAccount` (single detail), `useAccountOrders`, `useAccountContacts`, `useAccountDiscounts`.

- [ ] **Step 4: Create AccountsTable.tsx** — Data table with columns: Client Name, Address, License/UBI, Email, Status (StatusBadge), Assigned Rep. 3 tab buttons above table. Row click navigates to detail.

- [ ] **Step 5: Create QuickFiltersModal.tsx** — Multi-field filter form with React Hook Form + Zod.

- [ ] **Step 6: Create AccountDetail.tsx** — Back button, account header with name/address/license/status badge. Tab navigation for 5 sub-views.

- [ ] **Step 7: Create AccountDetailTabs.tsx** — 5 tabs: Analytics (charts), Orders (data table), Notes (text display), Recommendations (list), Discounts (data table).

- [ ] **Step 8: Create all 7 modals** — Each modal uses React Hook Form + Zod validation, focus trap, Escape to close, ARIA attributes. Match the field layouts from screenshots:
  - InviteModal: readonly fields + email + message
  - AssignSalespersonModal: radio group of sales reps
  - AddContactModal: 7 fields (firstName, lastName, email, title dropdown, phone, phoneType, note)
  - UpdateClientInfoModal: full account form
  - UpdateNotesModal: textarea
  - UpdateDeliveryPrefsModal: delivery days checkboxes, AM/PM, special instructions, fulfillment priority (FIFO/Newest/Highest QA/Lowest QA)
  - UpdateInventoryPrefsModal: inventory settings

- [ ] **Step 9: Create AddNonCannabisAccountModal.tsx** — Simpler account creation form.

- [ ] **Step 10: Create AccountsPage.tsx** — Compose list view + detail view with state management (selectedAccountId). Action buttons trigger modals. Export dropdown (CSV/Excel).

- [ ] **Step 11: Update page.tsx** — Replace stub.

- [ ] **Step 12: Verify** — `npx tsc --noEmit`

---

### Task 3: Account Groups (`/account-groups`)

**Agent prompt context:** "You are building Account Groups — a simple data table with create/detail views. No Cultivera screenshot exists, so build from the data model."

**Files:**
- Create: `apps/app/src/modules/account-groups/components/AccountGroupsPage.tsx`
- Create: `apps/app/src/modules/account-groups/components/AccountGroupsTable.tsx`
- Create: `apps/app/src/modules/account-groups/components/AccountGroupDetail.tsx`
- Create: `apps/app/src/modules/account-groups/components/CreateGroupModal.tsx`
- Create: `apps/app/src/modules/account-groups/hooks/index.ts`
- Create: `apps/app/src/modules/account-groups/types/index.ts`
- Modify: `apps/app/src/app/(modules)/account-groups/page.tsx`

- [ ] **Step 1: Read reference files** — existing module patterns, shared components.

- [ ] **Step 2: Create types + hooks** — `useAccountGroups`, `useAccountGroup`. Import `AccountGroup` from `@/modules/sales/types`.

- [ ] **Step 3: Create AccountGroupsTable.tsx** — Columns: Group Name, Type (territory/rep/custom), Account Count, Assigned Rep. Row click drills into detail.

- [ ] **Step 4: Create CreateGroupModal.tsx** — Name input, Type dropdown, multi-select accounts. RHF + Zod.

- [ ] **Step 5: Create AccountGroupDetail.tsx** — Back button, group header, member accounts list table.

- [ ] **Step 6: Create AccountGroupsPage.tsx** — Compose with "Create Group" button.

- [ ] **Step 7: Update page.tsx** — Replace stub.

- [ ] **Step 8: Verify** — `npx tsc --noEmit`

---

### Task 4: Carts (`/carts`)

**Agent prompt context:** "You are building Carts with a detail view and 3 complex modals (Conversion Setting with batch allocation table)."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/carts.png`
- `states/cart-detail.png`, `states/cart-detail-full-buttons.png`
- `states/cart-conversion-setting-modal.png`
- `states/cart-mark-trade-samples-modal.png`
- `states/cart-auto-allocate-modal.png`

**Files:**
- Create: `apps/app/src/modules/carts/components/CartsPage.tsx`
- Create: `apps/app/src/modules/carts/components/CartsTable.tsx`
- Create: `apps/app/src/modules/carts/components/CartDetail.tsx`
- Create: `apps/app/src/modules/carts/components/CartLineItems.tsx`
- Create: `apps/app/src/modules/carts/components/CartActions.tsx`
- Create: `apps/app/src/modules/carts/components/ConversionSettingModal.tsx`
- Create: `apps/app/src/modules/carts/components/MarkTradeSamplesModal.tsx`
- Create: `apps/app/src/modules/carts/components/AutoAllocateModal.tsx`
- Create: `apps/app/src/modules/carts/hooks/index.ts`
- Create: `apps/app/src/modules/carts/types/index.ts`
- Modify: `apps/app/src/app/(modules)/carts/page.tsx`

- [ ] **Step 1: Read all screenshots** — especially `cart-conversion-setting-modal.png` for the batch allocation table layout.

- [ ] **Step 2: Create types + hooks** — `useCarts`, `useCart`, `useCartAllocation`. Import from `@/modules/sales/types`.

- [ ] **Step 3: Create CartsTable.tsx** — Columns: Cart Name, Client, Items, Total, Status. Row click drills in.

- [ ] **Step 4: Create CartDetail.tsx + CartLineItems.tsx** — Back button, cart header, line items table (Product, Strain, Qty, Unit Price, Line Total).

- [ ] **Step 5: Create CartActions.tsx** — 6 buttons: Submit, Duplicate, Delete, Mark Trade Samples, Conversion Setting, Auto Allocate.

- [ ] **Step 6: Create ConversionSettingModal.tsx** — Batch allocation table with columns: Needed, Allocated, Remaining, Batch Date, DOH, DOM, Use, Barcode, Room, Available, Allocated. Radio: Combine vs Generate Multiple Batches.

- [ ] **Step 7: Create MarkTradeSamplesModal.tsx + AutoAllocateModal.tsx** — Match screenshots.

- [ ] **Step 8: Create CartsPage.tsx** — Compose list + detail views.

- [ ] **Step 9: Update page.tsx** — Replace stub.

- [ ] **Step 10: Verify** — `npx tsc --noEmit`

---

### Task 5: Catalogs (`/catalogs`)

**Agent prompt context:** "You are building Catalogs — a catalog list with drill-down and Add to Cart modal."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/catalogs.png`
- `states/catalog-add-to-cart-modal.png`

**Files:**
- Create: `apps/app/src/modules/catalogs/components/CatalogsPage.tsx`
- Create: `apps/app/src/modules/catalogs/components/CatalogList.tsx`
- Create: `apps/app/src/modules/catalogs/components/CatalogDetail.tsx`
- Create: `apps/app/src/modules/catalogs/components/AddToCartModal.tsx`
- Create: `apps/app/src/modules/catalogs/hooks/index.ts`
- Create: `apps/app/src/modules/catalogs/types/index.ts`
- Modify: `apps/app/src/app/(modules)/catalogs/page.tsx`

- [ ] **Step 1: Read screenshots + patterns.**

- [ ] **Step 2: Create types + hooks** — `useCatalogs`, `useCatalog`.

- [ ] **Step 3: Create CatalogList.tsx** — Cards/list showing catalog name + product count.

- [ ] **Step 4: Create CatalogDetail.tsx** — Product table within selected catalog.

- [ ] **Step 5: Create AddToCartModal.tsx** — Product name (readonly), Price (readonly), Qty input, Line Total (auto-calculated). RHF + Zod.

- [ ] **Step 6: Create CatalogsPage.tsx** — Compose list + detail.

- [ ] **Step 7: Update page.tsx** — Replace stub.

- [ ] **Step 8: Verify** — `npx tsc --noEmit`

---

### Task 6: Orders Rebuild (`/orders`)

**Agent prompt context:** "You are EXTENDING the existing Orders module — do NOT delete or recreate existing files. Add Cultivera-style order queue as a new tab."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/orders.png`
- `states/orders-filter-tabs.png`, `states/orders-quick-filters-modal.png`, `states/orders-status-tabs.png`

**Files:**
- Read (do NOT modify): `apps/app/src/modules/orders/components/OrdersPage.tsx`
- Read (do NOT modify): `apps/app/src/modules/orders/components/OrdersDashboard.tsx`
- Read (do NOT modify): `apps/app/src/modules/orders/hooks/index.ts`
- Read (do NOT modify): `apps/app/src/modules/orders/types/index.ts`
- Replace: `apps/app/src/modules/orders/components/OrdersQueue.tsx` (new implementation)
- Create: `apps/app/src/modules/orders/components/OrderStatusTabs.tsx`
- Create: `apps/app/src/modules/orders/components/OrderQuickFiltersModal.tsx`
- Create: `apps/app/src/modules/orders/hooks/useSalesOrders.ts`

- [ ] **Step 1: Read ALL existing files** in `src/modules/orders/` to understand the current structure, tab system, and types.

- [ ] **Step 2: Create useSalesOrders.ts** — New TanStack Query hook importing `SalesOrderStatus` from `@/modules/sales/types` and mock data from `@/mocks/sales`. Separate from existing `useOrders`.

- [ ] **Step 3: Create OrderStatusTabs.tsx** — 5 tabs: All, Submitted, Manifested, Invoiced, Released. Filter the sales orders list.

- [ ] **Step 4: Create OrderQuickFiltersModal.tsx** — Multi-field filter form matching Cultivera screenshot.

- [ ] **Step 5: Replace OrdersQueue.tsx** — New implementation with OrderStatusTabs + 10-column data table (Order #, Submitted By, Submitted Date, Client, City, Status, Manifested Date, Est Delivery, Released Date, Total) + quick filters button. Match Cultivera layout.

- [ ] **Step 6: Verify existing tabs still work** — The OrdersPage.tsx should still render Dashboard tab (unchanged) and the new Queue tab. Read OrdersPage.tsx to confirm the tab system still references OrdersQueue correctly.

- [ ] **Step 7: Verify** — `npx tsc --noEmit`

---

### Task 7: Sales Person Report (`/sales-person-report`)

**Agent prompt context:** "You are building the Sales Person Report with comprehensive filters and a data table."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/sales-person-report.png`
- `states/sales-person-report-filters.png`

**Files:**
- Create: `apps/app/src/modules/sales-person-report/components/SalesPersonReportPage.tsx`
- Create: `apps/app/src/modules/sales-person-report/components/ReportFilters.tsx`
- Create: `apps/app/src/modules/sales-person-report/components/ReportTable.tsx`
- Create: `apps/app/src/modules/sales-person-report/hooks/index.ts`
- Create: `apps/app/src/modules/sales-person-report/types/index.ts`
- Modify: `apps/app/src/app/(modules)/sales-person-report/page.tsx`

- [ ] **Step 1: Read screenshots + patterns.**

- [ ] **Step 2: Create types + hooks** — `useSalesRepReport` with filter parameters.

- [ ] **Step 3: Create ReportFilters.tsx** — Comprehensive filter bar:
  - Date range (start/end) with quick-link buttons (All, Today, Yesterday, Last 7/10/15 Days, Week/Month/Year To Date)
  - Search by Sales Persons multi-select listbox
  - Client Status dropdown (Active/Inactive)
  - Min Total / Max Total inputs
  - Show Cancelled toggle

- [ ] **Step 4: Create ReportTable.tsx** — Columns: Sales Person, Number of Orders, Total Sales (Cultivera core), Account Count, Avg Order Value, Top Account (Frost enhancements). Pagination. Export to Excel button.

- [ ] **Step 5: Create SalesPersonReportPage.tsx** — Compose filters + table.

- [ ] **Step 6: Update page.tsx** — Replace stub.

- [ ] **Step 7: Verify** — `npx tsc --noEmit`

---

### Task 8: Order Summary (`/order-summary`)

**Agent prompt context:** "You are building Order Summary — a comprehensive report with 3 date-range pairs and 10-column table."

**Screenshots to read:**
- `research/wa.cultiverapro.com/2026-03-12-v3/sales/order-summary.png`
- `states/order-summary-date-picker.png`
- `states/order-summary-items-per-page-dropdown.png`
- `states/order-summary-show-cancelled.png`
- `states/order-summary-status-dropdown.png`
- `states/order-summary-submitted-by-dropdown.png`

**Files:**
- Create: `apps/app/src/modules/order-summary/components/OrderSummaryPage.tsx`
- Create: `apps/app/src/modules/order-summary/components/SummaryFilters.tsx`
- Create: `apps/app/src/modules/order-summary/components/SummaryTable.tsx`
- Create: `apps/app/src/modules/order-summary/hooks/index.ts`
- Create: `apps/app/src/modules/order-summary/types/index.ts`
- Modify: `apps/app/src/app/(modules)/order-summary/page.tsx`

- [ ] **Step 1: Read all 6 screenshots** — especially the filter dropdowns.

- [ ] **Step 2: Create types + hooks** — `useOrderSummary` with all filter parameters.

- [ ] **Step 3: Create SummaryFilters.tsx** — 3 date-range pairs + dropdowns + toggles:
  - From/To Submitted Date
  - From/To Est. Delivery Date
  - From/To Released Date
  - Trade Name search input
  - Status dropdown (all SalesOrderStatus values)
  - Submitted By dropdown (5 sales reps)
  - Items Per Page (10/25/50/100/250/500/1000)
  - "Show Cancelled Orders" toggle
  - "Hide 'Samples Only'" toggle (default checked)
  - "Hide Non 'Samples Only'" toggle

- [ ] **Step 4: Create SummaryTable.tsx** — 10 columns: Order #, Trade Name, Submitted By, Submitted Date, Client, City, Status (StatusBadge), Manifested Date, Delivery Date, Total. Pagination. 2 export buttons (CSV, Excel).

- [ ] **Step 5: Create OrderSummaryPage.tsx** — Compose filters + table.

- [ ] **Step 6: Update page.tsx** — Replace stub.

- [ ] **Step 7: Verify** — `npx tsc --noEmit`

---

## Chunk 3: Phase 2 — Integration

### Task 9: Build Verification

- [ ] **Step 1: Run full build** — `npm run build` from monorepo root. Fix any errors.

- [ ] **Step 2: Run lint** — `npm run lint`. Fix any warnings.

- [ ] **Step 3: Type check** — `npx tsc --noEmit` in `apps/app/`.

- [ ] **Step 4: Visual review** — Check all 8 pages on localhost:3000. Navigate the Sales sidebar, click each item, verify layout matches Cultivera screenshots with Frost styling.

- [ ] **Step 5: Final commit**
```bash
git add -A
git commit -m "feat: complete Sales module rebuild — 8 pages matching Cultivera layout with Frost design"
```
