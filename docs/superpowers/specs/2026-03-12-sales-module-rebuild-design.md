# Sales Module Rebuild — Design Spec

**Date:** 2026-03-12
**Status:** Reviewed
**Scope:** Rebuild all Sales sidebar pages to match Cultivera Pro's layout, with Frost design tokens and enhancements preserved.

---

## Overview

Reorganize the Sales category sidebar to match Cultivera Pro's navigation order, then rebuild 8 of 9 pages (excluding VMI) to match Cultivera's UI layout with full depth (all modals, drill-downs, filters). Each page retains Frost's dark theme, accent colors, SectionHeader, and shared component library. The existing Orders dashboard tab and VMI page are preserved as Frost enhancements.

## Decisions

- **Sidebar order:** Match Cultivera's 9-item order, then Frost extras below a separator
- **VMI untouched:** `/vmi` page stays as-is — too important to rush through a swarm
- **Orders preserved:** Existing Frost Orders dashboard/metrics tab kept; Cultivera's order list view added as second tab
- **Full depth:** Every modal, drill-down, filter, and detail view from the screenshots gets built
- **Market Connections deferred:** Cultivera has a Market Connections page (407 B2B connections, 3 tabs: All/Active/Revoked). This is a Cultivera marketplace feature not relevant to Frost's sales workflow — deferred to a future phase.
- **Execution:** 8 parallel agents (one per page) + 1 foundation task (sidebar + shared types)
- **Shared types namespace:** Sales-specific types live in `src/modules/sales/types/index.ts` as a shared container. The Cultivera-derived order status is named `SalesOrderStatus` to avoid collision with the existing Frost `OrderStatus` in `src/modules/orders/types/`.
- **Mock data ownership:** Phase 0 creates `src/mocks/sales.ts` with all factory functions. Phase 1 agents import from it but never modify it. If an agent needs page-specific mock helpers, they create them in their own module's hooks file.
- **File ownership:** No Phase 1 agent touches `nav-data.ts`, `Sidebar.tsx`, `src/modules/sales/types/`, or `src/mocks/sales.ts`. These are Phase 0-only files.

---

## Part 1: Sidebar Reorder

### Current Order (nav-data.ts)
Mixed order with Frost extras interspersed.

### Target Order
**Cultivera items (1-9):**
1. Dashboard — `/sales-dashboard` — LayoutDashboard
2. Accounts — `/accounts` — Users
3. Account Groups — `/account-groups` — UsersRound
4. Carts — `/carts` — ShoppingBag
5. Inventory — `/vmi` — BarChart3 (unchanged route, icon, VMI page untouched)
6. Catalogs — `/catalogs` — BookOpen
7. Orders — `/orders` — ClipboardList
8. Sales Person Report — `/sales-person-report` — PieChart
9. Order Summary — `/order-summary` — FileText

**Separator line**

**Frost extras (10-13):**
10. CRM — `/crm` — Users (keep current icon)
11. Pipeline — `/pipeline` — GitBranch
12. Competitor Intel — `/competitors` — Target
13. Cultivera — `/cultivera` — Leaf

### Implementation
Split the Sales category's `items` array into `items` (Cultivera core, positions 1-9) and `extraItems` (Frost extras, positions 10-13). This mirrors the existing `tabs`/`extraTabs` pattern already used for tab-based categories.

- Add `extraItems?: NavItem[]` to the `NavCategory` type in `nav-data.ts`
- Move CRM, Pipeline, Competitor Intel, Cultivera into `extraItems`
- In `Sidebar.tsx`, after rendering `filteredItems`, render a separator div then render `extraItems` (also filtered by permissions). This is resilient to permission filtering — the separator always appears between the two groups regardless of which items are visible.
- Separator markup: `<div className="my-2 mx-3 h-px bg-border-default" />`
- Each `extraItem` gets `isFrostExtra: true` flag for potential future styling differentiation

---

## Part 2: Shared Types & Mock Data

### File: `src/modules/sales/types/index.ts`

All interfaces derived from Cultivera's page-analysis.md:

```typescript
// Enums
// Named SalesOrderStatus to avoid collision with existing Frost OrderStatus in src/modules/orders/types/
type SalesOrderStatus = 'submitted' | 'sublotted' | 'manifested' | 'quarantined' | 'invoiced' | 'paid' | 'partially-sublotted';
type AccountStatus = 'active' | 'inactive';
type FulfillmentPriority = 'fifo' | 'newest-first' | 'highest-qa' | 'lowest-qa';
type AllocationMode = 'combine' | 'generate-multiple';

// Entities
interface SalesAccount {
  id: string;
  clientName: string;
  address: string;
  city: string;
  licenseUBI: string;
  email: string;
  status: AccountStatus;
  deliveryDays: string[];
  amPm: 'am' | 'pm';
  specialInstructions: string;
  labelBarcodePreference: string;
  fulfillmentPriority: FulfillmentPriority;
  assignedSalesRep: string;
  contactCount: number;
  orderCount: number;
}

interface SalesContact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  phone: string;
  phoneType: string;
  note: string;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  submittedBy: string;
  submittedDate: string;
  clientName: string;
  city: string;
  status: SalesOrderStatus;
  manifestedDate?: string;
  estDeliveryDate?: string;
  releasedDate?: string;
  orderTotal: number;
}

interface Cart {
  id: string;
  name: string;
  clientName: string;
  itemCount: number;
  total: number;
  status: 'open' | 'submitted' | 'allocated';
  lineItems: CartLineItem[];
}

interface CartLineItem {
  id: string;
  productName: string;
  strain: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface BatchAllocation {
  batchId: string;
  batchDate: string;
  doh: number;
  dom: string;
  use: string;
  barcode: string;
  room: string;
  available: number;
  allocated: number;
  needed: number;
  remaining: number;
}

interface Catalog {
  id: string;
  name: string;
  productCount: number;
  products: CatalogProduct[];
}

interface CatalogProduct {
  id: string;
  name: string;
  strain: string;
  category: string;
  price: number;
  available: number;
}

interface SalesInventoryItem {
  id: string;
  name: string;
  strain: string;
  productLine: string;
  subProductLine: string;
  thca: number;
  thc: number;
  cbd: number;
  total: number;
  available: number;
  price: number;
}

interface AccountGroup {
  id: string;
  name: string;
  type: 'territory' | 'rep' | 'custom';
  accountCount: number;
  assignedRep?: string;
}

interface SalesRepReport {
  repName: string;
  totalSales: number;
  orderCount: number;
  accountCount: number;
  avgOrderValue: number;
  topAccount: string;
}

// OrderSummaryRow extends SalesOrder with tradeName for the summary report view
type OrderSummaryRow = SalesOrder & {
  tradeName: string;
};
```

### File: `src/mocks/sales.ts`
Factory functions generating 20-50 realistic records per entity. Cannabis dispensary personas (Green Leaf Collective, Emerald City Cannabis, Puget Sound Provisions, etc.). Consistent cross-references (orders reference real account names, carts reference real products). Sales rep names from Cultivera's enum: Michael Perkins, Nichole Cluff, Richard Maloney, Stacia Hartwell, Support Cultivera.

---

## Part 3: Per-Page Specs

### Agent 1 — Sales Dashboard (`/sales-dashboard`)

**Reference:** `research/.../sales/dashboard.png`, `states/dashboard-my-accounts-toggle.png`

**Layout:**
- SectionHeader with accent color #F59E0B, title "Sales Dashboard"
- 4 MetricCards in a row: Total Accounts, Active Carts, Sales YTD ($), Revenue YTD ($)
- Weekly Sales bar chart (Recharts BarChart, 7-day view)
- 3-column grid below: Active Carts panel, Recent Orders panel, Recent Clients panel
- "My Accounts" toggle (filters all data to current user's assigned accounts)

**Module structure:**
```
src/modules/sales-dashboard/
  components/
    SalesDashboardPage.tsx
    SalesMetrics.tsx
    WeeklySalesChart.tsx
    ActiveCartsPanel.tsx
    RecentOrdersPanel.tsx
    RecentClientsPanel.tsx
  hooks/
    index.ts (useSalesDashboardMetrics, useWeeklySales, useActiveCartsSummary, useRecentOrders, useRecentClients)
  types/
    index.ts (imports from sales/types)
```

---

### Agent 2 — Accounts (`/accounts`)

**Reference:** `accounts-all.png` + 15 state screenshots in `states/`

**Layout — List View:**
- SectionHeader with accent #F59E0B, title "Accounts"
- 3 tabs: Active, Inactive, All
- Data table with columns: Client Name, Address, License/UBI, Email, Status, Assigned Rep
- Quick Filters modal (multi-field filter form)
- Export dropdown (CSV, Excel)
- "Add Non-Cannabis Account" button + modal

**Layout — Account Detail (drill-down on row click):**
- Back button to list
- Account header: name, address, license, status badge
- 5 tabs: Analytics, Orders (data table, 63+ items), Notes, Recommendations, Discounts (data table)
- 7 modals accessible from detail view:
  1. Invite Modal — client name/address/license (readonly) + email + message
  2. Assign Salesperson Modal — radio selection from sales reps
  3. Add Contact Modal — firstName, lastName, email, title (dropdown), phone, phoneType, note
  4. Update Client Info Modal — full account editing form
  5. Update Notes Modal — textarea
  6. Update Delivery Prefs Modal — delivery days checkboxes, AM/PM toggle, special instructions, label/barcode preference, fulfillment priority (FIFO/Newest/Highest QA/Lowest QA)
  7. Update Inventory Prefs Modal — inventory preference settings

**Module structure:**
```
src/modules/accounts/
  components/
    AccountsPage.tsx
    AccountsTable.tsx
    AccountDetail.tsx
    AccountDetailTabs.tsx (Analytics, Orders, Notes, Recommendations, Discounts)
    QuickFiltersModal.tsx
    InviteModal.tsx
    AssignSalespersonModal.tsx
    AddContactModal.tsx
    UpdateClientInfoModal.tsx
    UpdateNotesModal.tsx
    UpdateDeliveryPrefsModal.tsx
    UpdateInventoryPrefsModal.tsx
    AddNonCannabisAccountModal.tsx
  hooks/
    index.ts (useAccounts, useAccount, useAccountOrders, useAccountContacts, useAccountDiscounts)
  types/
    index.ts
```

---

### Agent 3 — Account Groups (`/account-groups`)

**Reference:** No Cultivera screenshot — build from data model inference.

**Layout:**
- SectionHeader with accent #F59E0B, title "Account Groups"
- Data table: Group Name, Type (territory/rep/custom), Account Count, Assigned Rep
- "Create Group" button + modal (name, type dropdown, multi-select accounts)
- Row click drills into group detail showing member accounts list

**Module structure:**
```
src/modules/account-groups/
  components/
    AccountGroupsPage.tsx
    AccountGroupsTable.tsx
    AccountGroupDetail.tsx
    CreateGroupModal.tsx
  hooks/
    index.ts (useAccountGroups, useAccountGroup)
  types/
    index.ts
```

---

### Agent 4 — Carts (`/carts`)

**Reference:** `carts.png` + 5 cart state screenshots

**Layout — List View:**
- SectionHeader with accent #F59E0B, title "Carts"
- Data table: Cart Name, Client, Items, Total, Status
- Row click drills into cart detail

**Layout — Cart Detail:**
- Back button
- Cart header: client name, status, total
- Line items table: Product, Strain, Qty, Unit Price, Line Total
- 6 action buttons: Submit, Duplicate, Delete, Mark Trade Samples, Conversion Setting, Auto Allocate
- Conversion Setting Modal: batch allocation table (Needed/Allocated/Remaining columns + Batch Date/DOH/DOM/Use/Barcode/Room/Available/Allocated), radio: Combine vs Generate Multiple Batches
- Mark Trade Samples Modal
- Auto Allocate Modal

**Module structure:**
```
src/modules/carts/
  components/
    CartsPage.tsx
    CartsTable.tsx
    CartDetail.tsx
    CartLineItems.tsx
    CartActions.tsx
    ConversionSettingModal.tsx
    MarkTradeSamplesModal.tsx
    AutoAllocateModal.tsx
  hooks/
    index.ts (useCarts, useCart, useCartAllocation)
  types/
    index.ts
```

---

### Agent 5 — Catalogs (`/catalogs`)

**Reference:** `catalogs.png`, `states/catalog-add-to-cart-modal.png`

**Layout:**
- SectionHeader with accent #F59E0B, title "Catalogs"
- Catalog list/grid showing available product catalogs with name and product count
- Click into catalog shows product list table
- "Add to Cart" modal per product: Product name (readonly), Price, Qty input, Line Total (calculated)

**Module structure:**
```
src/modules/catalogs/
  components/
    CatalogsPage.tsx
    CatalogList.tsx
    CatalogDetail.tsx
    AddToCartModal.tsx
  hooks/
    index.ts (useCatalogs, useCatalog)
  types/
    index.ts
```

---

### Agent 6 — Orders (`/orders`) — Rebuild with Frost enhancements

**Reference:** `orders.png` + 3 order state screenshots + existing `src/modules/orders/`

**Layout:**
- SectionHeader with accent #F59E0B, title "Orders"
- **Tab 1: Dashboard** (KEEP existing Frost implementation — metrics, pipeline chart, revenue by category, top accounts)
- **Tab 2: Order Queue** (REBUILD to match Cultivera):
  - 5 status sub-tabs: All, Submitted, Manifested, Invoiced, Released
  - Data table: Order #, Submitted By, Submitted Date, Client, City, Status, Manifested Date, Est Delivery, Released Date, Total
  - Quick Filters modal
- Row click on order drills into order detail

**Implementation notes:**
- Preserve existing `src/modules/orders/` hooks and dashboard components (OrdersDashboard.tsx, OrdersPage.tsx)
- The existing `OrdersQueue.tsx` should be **replaced** with a new implementation matching Cultivera's layout (status sub-tabs + 10-column table + quick filters)
- Import `SalesOrderStatus` from `sales/types` for the Cultivera status values; keep existing Frost `OrderStatus` for the dashboard tab
- Do NOT modify existing hooks (useOrders, useOrderMetrics, etc.) — create new hooks alongside them (e.g., `useSalesOrders`, `useSalesOrderFilters`)
- Add `OrderStatusTabs.tsx`, `OrderQuickFiltersModal.tsx` as new files

**Module structure:** Extend existing `src/modules/orders/` — do NOT recreate. New files only, no deletions.

---

### Agent 7 — Sales Person Report (`/sales-person-report`)

**Reference:** `sales-person-report.png`, `states/sales-person-report-filters.png`

**Layout:**
- SectionHeader with accent #F59E0B, title "Sales Person Report"
- Filter bar:
  - Date range picker (start/end) with quick-link buttons: All, Today, Yesterday, Last 7/10/15 Days, Week/Month/Year To Date
  - Search by Sales Persons multi-select listbox
  - Client Status dropdown (Active/Inactive)
  - Min Total, Max Total inputs
  - Show Cancelled toggle
- Data table columns (Cultivera core): Sales Person, Number of Orders, Total Sales
- Data table columns (Frost enhancements): Account Count, Avg Order Value, Top Account
- Export to Excel button
- Pagination

**Module structure:**
```
src/modules/sales-person-report/
  components/
    SalesPersonReportPage.tsx
    ReportFilters.tsx
    ReportTable.tsx
  hooks/
    index.ts (useSalesRepReport)
  types/
    index.ts
```

---

### Agent 8 — Order Summary (`/order-summary`)

**Reference:** `order-summary.png` + 5 order-summary state screenshots

**Layout:**
- SectionHeader with accent #F59E0B, title "Order Summary"
- Filters (3 date-range pairs + 3 dropdowns + 3 toggles):
  - From/To Submitted Date (date pickers)
  - From/To Est. Delivery Date (date pickers)
  - From/To Released Date (date pickers)
  - Trade Name search input
  - Status dropdown (Submitted/Sublotted/Manifested/Quarantined/Invoiced/Paid/PartiallySublotted)
  - Submitted By dropdown (sales reps: Michael Perkins, Nichole Cluff, Richard Maloney, Stacia Hartwell, Support Cultivera)
  - Items Per Page dropdown (10/25/50/100/250/500/1000)
  - "Show Cancelled Orders" toggle
  - "Hide 'Samples Only'" toggle (default checked)
  - "Hide Non 'Samples Only'" toggle
- Data table with 10 columns: Order #, Trade Name, Submitted By, Submitted Date, Client, City, Status, Manifested Date, Delivery Date, Total
- 2 export options (CSV, Excel)
- Pagination controls

**Module structure:**
```
src/modules/order-summary/
  components/
    OrderSummaryPage.tsx
    SummaryFilters.tsx
    SummaryTable.tsx
  hooks/
    index.ts (useOrderSummary)
  types/
    index.ts
```

---

## Part 4: Execution Plan

### Phase 0 — Foundation (single agent, runs first)
1. Reorder Sales sidebar items in `nav-data.ts`
2. Add separator support to Sidebar.tsx
3. Create `src/modules/sales/types/index.ts` with all shared interfaces
4. Create `src/mocks/sales.ts` with factory functions for all entities
5. Verify build passes

### Phase 1 — Parallel Swarm (8 agents, run simultaneously)
Each agent:
1. Reads their assigned Cultivera screenshots (image files in `research/wa.cultiverapro.com/2026-03-12-v3/sales/`)
2. Reads `page-analysis.md` for data model reference
3. Reads existing Frost patterns (existing modules like cultivation, manufacturing for architecture reference)
4. Creates module folder with components/, hooks/, types/
5. Replaces existing page.tsx stub (all 8 pages currently have `EmptyState` placeholders) to import from new module
6. Verifies their page builds without errors
7. Does NOT touch: `nav-data.ts`, `Sidebar.tsx`, `src/modules/sales/types/`, `src/mocks/sales.ts`

**Agent assignments:**
| Agent | Page | Complexity | Est. Files |
|-------|------|-----------|-----------|
| 1 | Sales Dashboard | Medium | 8 |
| 2 | Accounts | High (7 modals, 5 tabs) | 16 |
| 3 | Account Groups | Low | 6 |
| 4 | Carts | High (3 modals, detail) | 10 |
| 5 | Catalogs | Low | 6 |
| 6 | Orders (extend) | Medium | 4 new files |
| 7 | Sales Person Report | Low | 5 |
| 8 | Order Summary | Medium | 5 |

### Phase 2 — Integration & Build Verification
1. Run `npm run build` across full app
2. Fix any import conflicts or type collisions between agents
3. Run `npm run lint`
4. Visual review of all 8 pages on localhost

---

## Design Constraints

- All pages use Frost design tokens (CSS variables from `tokens.css`) — no hardcoded colors
- All pages use shared components: SectionHeader, MetricCard, StatusBadge, CategoryChip, DataTable, AccentCard, EmptyState, LoadingSkeleton
- All data hooks use TanStack Query with simulated delays
- Forms use React Hook Form + Zod validation
- Modals: focus trap, Escape to close, ARIA attributes
- No `any` in public component props
- No business logic in page.tsx files
- Mock data uses realistic cannabis dispensary personas consistent with existing mocks
