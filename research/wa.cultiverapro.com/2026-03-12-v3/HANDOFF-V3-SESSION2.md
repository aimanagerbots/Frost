# Cultivera Pro v3 Scrape — Session 2 Handoff

## Status: Sales ~70% done. Grow, Analytics, Inventory, Fulfillment, Configuration not started.

---

## Credentials
- URL: https://wa.cultiverapro.com
- Login: seattlepg@hotmail.com / cultivera1
- Tenant: G&S GREENERY
- **Session is likely still active** — try navigating directly before re-logging in.

---

## What Session 1 Completed

### Chrome / App Shell
- ✅ `chrome/post-login-v3.png` — Sales dashboard, authenticated
- ✅ `chrome/module-switcher-open.png` — All 6 modules listed
- ✅ `chrome/user-menu-open.png` — Profile, Company Profile, Notifications, Settings, Lock, Logout
- ✅ `chrome/user-profile-page.png` — Fields: First/Last Name, Primary/Other Phone, Email/Username, Change Password
- ✅ `chrome/company-profile-page.png` — G&S GREENERY, address, phone
- ✅ `chrome/topbar-icon-dropdown.png` — Notification bell: 0 notifications
- ✅ `chrome/invitations-market-connections.png` — Requests tab columns

### Sales Module (`/sales#/...`)
- ✅ `sales/accounts-all.png` — Accounts list (All Accounts mode)
- ✅ `sales/states/account-detail.png` — ZOOBEES DOOBEES detail, Analytics tab
- ✅ `sales/states/account-detail-orders-tab.png`
- ✅ `sales/states/account-detail-notes-tab.png`
- ✅ `sales/states/account-detail-recommendations-tab.png`
- ✅ `sales/states/account-detail-discounts-tab.png` — 63 items, columns: Product Name, Price, Discount Price, Quantity
- ✅ `sales/states/account-detail-invite-modal.png` — Fields: Client Name (ro), Address (ro), License-UBI (ro), Email*, Message
- ✅ `sales/states/account-detail-assign-salesperson-modal.png` — Radio: Support Cultivera, Nichole Cluff, Stacia Hartwell, Richard Maloney, Michael Perkins
- ✅ `sales/states/account-update-client-info-tab.png` — Full edit form + Google Maps
- ✅ `sales/states/account-update-notes-tab.png` — Note textarea + checkboxes
- ✅ `sales/states/account-update-delivery-prefs-tab.png` — Delivery days, AM/PM, Special Instructions, Label Barcode Preference
- ✅ `sales/states/account-update-inventory-prefs-tab.png` — Fulfillment Priority (FIFO/Newest/Highest QA/Lowest QA)
- ✅ `sales/states/account-add-contact-modal.png` — Fields: First/Last Name, Email, Title (dropdown), Phone, Phone Type (dropdown), Note
- ✅ `sales/states/orders-filter-tabs.png`
- ✅ `sales/states/accounts-quick-filters-modal.png`
- ✅ `sales/states/add-non-cannabis-account-modal.png`
- ✅ `sales/states/accounts-export-dropdown.png` — Contact details, Accounts
- ✅ `sales/states/market-connections-all.png` — 407 connections
- ✅ `sales/states/market-connections-active-users.png`
- ✅ `sales/states/market-connections-revoked-users.png` — 0 items
- ✅ `sales/carts.png` — 2 open carts
- ✅ `sales/states/cart-detail.png` — Full cart with line items, totals, action buttons
- ✅ `sales/inventory.png` — 63 products, search panel
- ✅ `sales/states/inventory-search-qa-expanded.png` — THCA/THC/CBD/Total range sliders

### Still TODO in Sales
- ❌ `sales/states/inventory-strain-dropdown.png` — open Strain listbox, capture all options
- ❌ `sales/states/inventory-product-line-dropdown.png` — open Product Line listbox
- ❌ Catalogs page + any buttons/modals
- ❌ Orders page + status filter tabs + row drill-down detail
- ❌ Sales Person Report page
- ❌ Order Summary page
- ❌ Sales Dashboard drill-downs (widgets/charts on dashboard)

---

## Modules NOT YET STARTED

### Grow Module (`/app-grow`) — navigate via module switcher
Pages to hit (click each sidebar item):
1. Grow Cycles — list + row drill-down + "New Cycle" modal
2. Plants — list + row drill-down + "Add Plant" modal
3. Harvest — list + row drill-down
4. QA Lot — list + row drill-down
5. Rooms — list + "Add Room" modal
6. Disposal — list + filter/form for disposal_reason enum
7. Grow Sources — list + form for plant_source_type enum
8. Strains — list
9. Mother Plants — list
10. Nutrients / any other sidebar items

### Analytics Module (`/app-analytics`) — navigate via module switcher
All 12 report cards — click each one, screenshot, record columns/filters/chart type, back.
Report 1 (Client By Product) already captured in v2 — still screenshot it.

### Inventory Module (`/inventory/`) — navigate via module switcher
Pages: Batches, Products, Strains, QA Results, Discounts & Promotions, Transfer History
- Batch detail drill-down
- Product detail drill-down
- QA Result detail drill-down
- Add Product modal
- Add Strain modal
- inventory_type enum (QA Result filter)
- discount_type enum (Discounts form)

### Fulfillment Module (`/fulfillment`) — navigate via module switcher
Pages: Delivery Schedule, Vehicles, Drivers, Transfer Inbound
- Delivery detail drill-down
- Add Vehicle modal
- Add Driver modal
- New Inbound Transfer modal
- delivery_route enum (Delivery Schedule filter)

### Configuration Module (`https://wa.cultiverapro.com/configuration#/[route]`) — supports direct URL nav
Routes: `/users`, `/account-management`, `/audit`, `/roles` (if exists), `/license`
- Account Management row drill-down (sales person detail)
- Add User modal + role dropdown (captures user_role enum)
- Audit row (if drillable)

---

## Output Documents Still To Create

After all modules done:
1. `DATA_MODELS_V3.md` — all entities with create form fields added
2. `DRILL_DOWN_TRAILS.md` — every detail page navigation trail
3. `ENUM_REGISTRY.md` — all enum values by entity
4. `ANALYTICS_REPORTS.md` — all 12 reports
5. Update `crawl-state-v3.json` to "complete"

---

## Critical Navigation Rules

- **NEVER construct URLs** for Grow, Analytics, Sales, Inventory, Fulfillment — AngularJS breaks
- **ALWAYS** click module switcher to change modules, click sidebar to navigate within
- **Configuration is the exception** — supports direct `browser_navigate` to `https://wa.cultiverapro.com/configuration#/[route]`
- After every click: `browser_wait_for` 3-5s + `browser_snapshot` to confirm content loaded
- If snapshot >50K chars: use `browser_evaluate` instead of parsing inline
- If ref expires: take fresh `browser_snapshot` before retrying

## User Instructions (MUST FOLLOW)
The user explicitly requested exhaustive capture:
- Screenshot ALL dropdowns (open each one)
- Click ALL buttons and screenshot
- Scrape every modal
- Screenshot everything in header and footer
- Go through EVERY page on the sitemap
- Activate every clickable element on each page

## Enum Targets Still Needed
| Enum | Where | Status |
|------|-------|--------|
| disposal_reason | Grow → Disposal → filter/form | ❌ |
| plant_source_type | Grow → Grow Sources → form | ❌ |
| inventory_type | Inventory → QA Result → filter | ❌ |
| discount_type | Inventory → Discounts → form | ❌ |
| user_role | Configuration → Users → Add User modal | ❌ |
| delivery_route | Fulfillment → Delivery Schedule → route filter | ❌ |

## Already-Known Enums (from v2 + Session 1)
- Sales rep names: Support Cultivera, Nichole Cluff, Stacia Hartwell, Richard Maloney, Michael Perkins
- Fulfillment Priority: FIFO, Newest First, Highest QA, Lowest QA
- Contact Title: (captured in add-contact modal — check screenshot)
- Account status tabs: Active, Inactive, All
- Order status tabs: (see orders-filter-tabs.png)

---

## Output Directory
`research/wa.cultiverapro.com/2026-03-12-v3/`

Subdirectories already created:
- `grow/states/`
- `analytics/states/`
- `sales/states/`
- `inventory/states/`
- `fulfillment/states/`
- `configuration/states/`
- `chrome/`
