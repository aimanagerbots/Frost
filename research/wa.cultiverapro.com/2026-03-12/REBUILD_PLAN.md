# Rebuild Plan — Cultivera Pro Clone
**Source:** wa.cultiverapro.com | **Scraped:** 2026-03-12
**Tenant:** G&S GREENERY | **For:** Frost Cannabis Operations Platform

---

## Architecture Overview

Build a **Next.js App Router** replacement for this AngularJS 1.x SPA. The original is 6 separate apps; rebuild as a single unified app with module-based routing.

```
Original (AngularJS):              Rebuild (Next.js):
/app-grow    → #/               → /grow/[page]
/app-analytics → #/             → /analytics/[page]
/crm         → #/               → /sales/[page]
/inventory/  → #/               → /inventory/[page]
/fulfillment → #/               → /fulfillment/[page]
/configuration → #/             → /configuration/[page]
```

**Stack:** Next.js + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + Zustand

---

## Phase 1: Design Foundation

### 1.1 Design Tokens
```css
/* tokens.css */
--color-primary: #00B9B4;
--color-primary-dark: #003940;
--color-primary-alt: #05AFAA;
--color-background: #16191C;
--color-surface: #212121;
--color-sidebar: #515967;
--color-text-primary: #212121;
--color-text-muted: #707070;
--color-success: #3C763D;
--color-danger: #A94442;
--color-info: #03A9F4;
--color-border: #CECED2;
--color-row-bg: #FDFDFF;
font-family: "Open Sans", sans-serif;
```

### 1.2 Shared Component Library
Build in this order (most reused first):

| Component | Description | Confidence |
|-----------|-------------|-----------|
| `StatusBadge` | Colored pill badge for pipeline statuses | full |
| `DataTable` | Sortable, paginated table with column headers | full |
| `FilterTabBar` | Horizontal status filter tabs | full |
| `PageHeader` | Breadcrumb + H1 + optional action buttons | full |
| `SearchBar` | Text input + Search button | full |
| `DateRangePicker` | From/To date pair | full |
| `ExportButton` | "Export to Excel" green button | full |
| `PaginationBar` | First/Prev/Pages/Next/Last + items-per-page | full |
| `StatCard` | Icon + label + number stat card | full |
| `EmptyState` | "No items to display" with optional CTA | full |
| `ConfirmModal` | Accept/Cancel confirmation dialog | full |
| `MultiSelectTable` | Table with checkbox column + bulk actions | full |

---

## Phase 2: App Shell

### 2.1 Top Bar
- Background: `#003940` (very dark teal), height ~48px
- Left: Cultivera Pro logo (white)
- Center: Module switcher dropdown (6 modules, teal text, chevron)
- Right: "Find Order..." search input, notification bell with badge, user avatar + name + chevron

### 2.2 Sidebar
- Background: `#515967`, width ~130px
- Company name + dropdown at top
- Nav items: icon + label, 12.6px/600 weight
- Active: left border `#00B9B4` + teal bg tint
- Sub-apps each have their own sidebar links

### 2.3 Layout
```tsx
<AppShell>
  <TopBar />
  <div className="flex">
    <Sidebar links={moduleLinks} />
    <main>{children}</main>
  </div>
</AppShell>
```

---

## Phase 3: Grow Module
**Priority:** Medium | **Confidence:** Full

### Pages to Build:

#### 3.1 Overview — Kanban Board
- Columns: Propagation, Vegetative, Flower, Harvest, Drying/Curing
- Cards: strain name, cycle info, plant count, quick stats
- Source: `grow/overview.png`

#### 3.2 Dashboard
- Stats/metrics for grow operations
- Source: `grow/dashboard.png`

#### 3.3 Grow Cycles
- Filterable list of grow cycles
- Table columns: Cycle Name, Stage, Room, Plant Count, Start Date, Harvest Date, Strain
- Source: `grow/grow-cycles.png`

#### 3.4 Plants
- Table: TSID, Strain, Room, Stage, Source
- Source: `grow/plants.png`

#### 3.5 Rooms / Grow Rooms
- Room cards with colorful stat indicators
- 13 rooms, 2811 total plants
- Source: `grow/rooms.png`

#### 3.6 Harvest
- Table: Harvest ID, Strain, Wet Weight, Dry Weight, Room, Date
- Source: `grow/harvest.png`

#### 3.7 QA Lot + QA Sample
- QA lot management, sample submission
- Source: `grow/qa-lot.png`, `grow/qa-sample.png`

#### 3.8 Disposal
- Tabs: Active Disposal / Destroyed
- Destroyed tab table: Source TSID, Disposal TSID, Strain, Quantity/Count, Quarantine Period, Date Destroyed, Destroyed By
- **261 destroyed records** visible
- Source: `grow/disposal.png`, `grow/states/disposal-destroyed-tab.png`

---

## Phase 4: Analytics Module
**Priority:** Medium | **Confidence:** Full (overview) + Partial (report details)

#### 4.1 Overview — Report Card Grid
- 3-column grid of 12 report cards
- Each card: icon + title + "View Report" button
- Source: `analytics/overview.png`

#### 4.2 Individual Report: Client By Product
- Filter tabs: Submitted / Partially Sublotted / Sublotted / Ready For Manifest / Manifested / Quarantined / Invoiced
- Table columns: Client, Units Sum, Avg Unit Price, Avg Discount, Sum Line Total
- Date range filter
- Export to Excel
- Source: `analytics/states/client-by-product-report.png`

#### 4.3 Other Reports (11 more)
- Similar pattern: filter → tabular results
- Monthly Sales: bar/line chart + data table
- Harvest Yield: grouped by strain
- **Note:** Only 1 report detail was fully captured — other report details are **partial confidence**

---

## Phase 5: Sales Module
**Priority:** High | **Confidence:** Full

#### 5.1 Dashboard
- Sales metrics, pending carts notification badge
- Source: `sales/dashboard.png`

#### 5.2 Accounts
- Table: Account Name, License #, City, County, Sales Person, Status
- Click row → Account detail
- Filters: status, territory, sales person
- Source: `sales/accounts.png`

#### 5.3 Account Groups
- Table: Group Name, Member Count
- Add modal: create group form
- Source: `sales/account-groups.png`, `sales/states/add-account-group-modal.png`

#### 5.4 Carts (Open Orders from Portal)
- Table: Started Date, PO Number, Client, Contact (name/email/phone), Item Count, Order Total
- Actions: Accept / Cancel per row
- Toggle: "All Carts" / "My Carts"
- "Show Only Portal Orders" filter
- Source: `sales/carts.png`

#### 5.4.1 Cart Detail (DRILL-DOWN)
- **Trail:** Carts list → click date link in row
- Header: PO number, client name, status
- Line item table: SKU, product name, strain, batch, qty, unit price, discount, line total
- 16 line items for PRC Conway, $621.60 total
- Actions: Accept All, Accept Selected, Cancel
- Source: `sales/states/cart-detail-prc-conway.png`

#### 5.5 Orders
- Table: Partner Name, Order #, Manifest Date, Delivery Date, Status
- Status filter tabs: Submitted / Partially Sublotted / Sublotted / Ready For Manifest / Manifested / Quarantined / Invoiced
- Source: `sales/orders.png`

#### 5.6 Sales Person Report + Order Summary
- Tabular reports filtered by date/rep
- Source: `sales/sales-person-report.png`, `sales/order-summary.png`

---

## Phase 6: Inventory Management Module
**Priority:** High | **Confidence:** Full (most pages have data)

#### 6.1 Overview / Manage Menu
- Product table with price and availability toggles
- Columns: Product Name, SKU, Price, Available
- Inline edit for price/availability
- Source: `inventory/overview.png`

#### 6.2 Products
- Card grid view of products
- Each card: product name, strain, package size, price
- Source: `inventory/products.png`

#### 6.3 Product Lines
- 8 lines: System Default, Bulk, Concentrate, Flower, Grow Sources, Infused Prerolls, Non-Cannabis Inventory, Uninfused Prerolls
- Source: `inventory/product-lines.png`

#### 6.4 Catalog Groups
- 4 groups: Frost Flower 3.5g-28g, Frost Prerolls, Frost Vapes, Frost Hydrocarbon Concentrates
- Source: `inventory/catalog-groups.png`

#### 6.5 Strains
- 173 strains with numeric IDs
- Table: Strain ID, Strain Name
- Source: `inventory/strains.png`

#### 6.6 Inventory Rooms
- 13 rooms, 2811 total plants
- Colorful stat cards per room
- Source: `inventory/inventory-rooms.png`

#### 6.7 Production (Bills of Materials)
- 8 BOMs showing input → output transformations
- Source: `inventory/production.png`

#### 6.8 QA Result (COA)
- **Rich data** — lab results
- Columns: QA Lot, Status, Inventory Type, Strain, Farm Information, CBD, THC, THCA, CBDA, Total
- Source: `inventory/qa-result.png`

#### 6.9 Backorders
- Flower Presales & Backorder
- Columns: Strain, Package Size, Total Units, Strain Total lb, Package Size Total lb, Total Price
- Source: `inventory/backorders.png`

#### 6.10 Disposal, QA Lot, QA Sample, Employee Sample, Conversions, Product Tag
- Standard table views
- Source: respective `inventory/*.png` files

---

## Phase 7: Fulfillment Module
**Priority:** Medium | **Confidence:** Partial (most tables empty in demo)

#### 7.1 Orders
- Status tabs: Submitted / Partially Sublotted / Sublotted / Ready For Manifest / Manifested / Quarantined / Invoiced
- Table: Partner Name, Order #, Manifest Date, Delivery Date, Status
- Summary stat cards: Submitted (0), Manifested (0), Quarantined (0), Invoiced (0)
- Source: `fulfillment/overview.png`

#### 7.2 Vehicles + Drivers
- Two-tab layout: Delivery / Pickup
- Table: Nickname/Name, Make/DoB, Year/Hired Date, Plate/Active, VIN, Hide For Fulfillment
- Source: `fulfillment/vehicles.png`, `fulfillment/drivers.png`

#### 7.3 Delivery Agents
- **Has real data**: 46 agents
- Table: Name, Address, City, Phone, County, Hide For Fulfillment
- Source: `fulfillment/delivery-agents.png`

#### 7.4 Quarantine Schedule
- Filter: Partner Name, Order #, Date ranges, Cities, Sales Person
- Table: Partner Name, Order #, Manifest, Address, Release Date, Est. Delivery Date, Sales Person
- Source: `fulfillment/quarantine-schedule.png`

#### 7.5 Delivery Schedule
- Tabs: All / Manifested / Unmanifested
- Table: Order #, Retailer, License #, Est. Delivery From Sales, Manifest Ref #, Manifested Date, Day Phone, Route, City, Street Address, Driver, Driver External ID, Vehicle/Driver
- Export to Excel
- Source: `fulfillment/delivery-schedule.png`

#### 7.6 Transfer Inbound
- **Has real data**: 1 item (Richards Packaging Inc, Non-Cannabis, In Transit)
- Table: Select, TSID, Client Name, Location, Transfer Status, Date Transferred, Source
- Actions: New Inbound Transfer, Import WCIA, New Non-Cannabis Transfer, Reject Selected, Export

#### 7.6.1 Transfer Inbound Detail (DRILL-DOWN)
- **Trail:** Transfer Inbound → click TSID link
- Header: Transfer #, type badge (NON-CANNABIS), Client, Location, Status, Date
- Warning banner: "Please make sure line items have expected lab results before accepting"
- Line items table: Line Item, Room, Product, Strain, Lab Result ID, Qty, Accepted Qty, Qty To Accept, Total Price, Status
- Actions: Accept All, Mark as Return, Accept Selected, Reject Manifest, Remove Selected, Update Selected, Generate Printout, Export
- Excel import: "Product SKU, Batch ID, Product Name, Quantity, Total price columns"
- Source: `fulfillment/states/transfer-inbound-detail.png`

#### 7.7 Transfer Outbound
- Table: TSID, Client Name, Order No, Status, Date Transferred
- Actions: Mark Accepted/Rejected/Finalized/Not Finalized
- Source: `fulfillment/transfer-outbound.png`

---

## Phase 8: Configuration Module
**Priority:** Low (admin only) | **Confidence:** Full

#### 8.1 Account Management
- Table: Sales Person Name, Assigned Client Count
- Clickable rows → sales person detail with client list
- Source: `configuration/overview.png`

#### 8.2 Marketplace Settings
- Two market profile forms: G&S GREENERY + G&S Greenery Wholesale
- Fields: Market Name, Email, Phone, Website, Address, City, State, Zip
- Minimum Order restriction toggle
- Public visibility toggle
- Logo upload
- Source: `configuration/marketplace-settings.png`

#### 8.3 Users
- Table: Name, Email, Phone, Other Phone, Username, Activated, Last Seen
- Source: `configuration/users.png`

#### 8.4 Roles
- Table: Role, Description, IsActive
- 4 roles: Admin, Grow, Inventory, Management
- Source: `configuration/roles.png`

#### 8.5 Audit Log
- 2073 entries, paginated 50/page
- Tree filter on left (All / action types)
- Table: ActionDateTime, Description, User
- Date range filter + User dropdown filter
- Source: `configuration/audit.png`

#### 8.6 Chart of Accounts
- 51 sub-product-lines mapped to accounting categories
- Table: Select, Sub-Product-Line, Assigned Account Type
- Source: `configuration/chart-of-accounts.png`

#### 8.7 Other Config Pages
- Client Note Attributes: 4 attributes (Sent Samples, Left Voicemail, Emailed, Called)
- Statuses: 7 client statuses
- Notifications: Email subscriber list
- Sync Settings: Leaf Data API key field
- Locations: Single location entry
- QuickBooks: OAuth connect + discount setting
- API Key: LCB Manifest Browser Extension key generation

---

## Data Models

See `DATA_MODELS.md` for full entity definitions. Key entities:

| Entity | Source Module | Key Fields |
|--------|-------------|-----------|
| Order | Sales/Fulfillment | partnerName, orderNumber, status (7 states) |
| Cart | Sales | portalOrderNumber, client, itemCount, orderTotal |
| CartLineItem | Sales | product, strain, qty, unitPrice, discount |
| Account | Sales | name, licenseNumber, city, county, salesPerson, status |
| InventoryProduct | Inventory | name, sku, productLine, strain, thc, cbd, price |
| Strain | Inventory | strainId, name, type (H/I/S) |
| QALot/Batch | Inventory | lotId, thc, cbd, thca, cbda, status |
| GrowCycle | Grow | stage, room, plantCount, strain |
| TransferInbound | Fulfillment | tsid, clientName, status, lineItems |
| DeliveryAgent | Fulfillment | name, address, city, county |
| User | Configuration | name, email, role, lastSeen |

---

## Asset Checklist

| Asset | Found | Source |
|-------|-------|-------|
| FROST logo (snowflake + wordmark) | Yes | `configuration/marketplace-settings.png` |
| Cultivera Pro logo | Yes | `chrome/post-login.png` |
| Module icons (6) | Yes | `chrome/module-switcher-open.png` |
| Sidebar nav icons | Yes | All module screenshots |
| QuickBooks logo | Yes | `configuration/quickbooks-setting.png` |
| Product category icons | Partial | `inventory/product-lines.png` |
| Font: Open Sans | Yes | Google Fonts |

---

## Confidence Scores

| Module | Confidence | Reason |
|--------|-----------|-------|
| Grow | Full | All 10 pages captured, 1 state |
| Analytics | Partial | Only 1 of 12 report details captured |
| Sales | Full | All 9 pages + 2 states + drill-down |
| Inventory | Full | All 19 pages captured, QA result has real data |
| Fulfillment | Partial | 8 pages captured; most tables empty in demo, 1 drill-down |
| Configuration | Full | All 14 pages captured, audit has 2073 real entries |

---

## Build Order Recommendation

```
1. Design tokens + CSS variables
2. Open Sans font setup
3. App shell (TopBar + Sidebar + layout)
4. Shared components (DataTable, StatusBadge, FilterTabBar, etc.)
5. Sales module (most complete data, core business flow)
6. Inventory module (rich data, many pages)
7. Grow module (cultivation lifecycle)
8. Fulfillment module (order execution)
9. Analytics module (reporting layer)
10. Configuration module (admin, low priority)
```

---

## Pages NOT to Build (blank/structural only)

None — all pages have structure even if demo data is empty. Mark low-data pages as "scaffold with empty state" rather than skipping.

---

## Key Domain Notes for Rebuild

1. **TSID** = State Tracking System ID — every cannabis item has a TSID from Washington's Leaf Data system
2. **Manifest** = Legal cannabis transport document — required before any delivery
3. **Quarantine** = Mandatory hold period after harvest before sale
4. **RTM** = Ready To Manufacture (bulk inputs)
5. **RTP** = Ready To Package (processed, pre-packaged)
6. **Cart** = Portal B2B order from retailer (not checkout cart)
7. **COA** = Certificate of Analysis (lab test results)
8. **WCIA** = Washington Cannabis Information Architecture (state traceability system)
9. **Leaf Data** = State system API for TSID sync
10. **G&S GREENERY** = Cannabis producer/processor, not retailer — sells wholesale to dispensaries
