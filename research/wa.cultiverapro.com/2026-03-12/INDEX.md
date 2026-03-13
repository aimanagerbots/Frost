# Site Index — Cultivera Pro (wa.cultiverapro.com)
**Scraped:** 2026-03-12 | **Tenant:** G&S GREENERY (License #415986)
**Crawl Method:** Click-based SPA navigation (never URL construction)

---

## App Architecture

| Property | Value |
|----------|-------|
| Framework | AngularJS 1.x (legacy SPA) |
| Routing | Hash routing (`#/`) |
| Sub-apps | 6 separate sub-applications |
| UI Library | Custom Bootstrap-derived (not Material/Tailwind) |
| Font | Open Sans (Google Fonts) |
| Icons | Font Awesome + custom SVG icons |
| State Sync | Leaf Data (WCIA) API — Washington cannabis traceability |
| Accounting | QuickBooks Online OAuth integration |
| Maps | Google Maps JavaScript API |
| Platform | Σbolt Solutions ™ |
| Auth | Username/password, session-based |
| Version | 6.0.26 |

### Sub-App Structure
```
https://wa.cultiverapro.com/
├── /app-grow       → Grow module
├── /app-analytics  → Analytics module
├── /crm            → Sales module
├── /inventory/     → Inventory Management module
├── /fulfillment    → Fulfillment module
└── /configuration  → Configuration module
```

---

## Module 1: Grow
**Path:** `/app-grow` | **Screenshot:** `grow/overview.png`
**Description:** Track cannabis plants through entire cultivation lifecycle

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Overview | `#/` | `grow/overview.png` | Kanban board — plants by stage |
| Dashboard | `#/dashboard` | `grow/dashboard.png` | Stats/metrics |
| Grow Cycles | `#/grow-cycles` | `grow/grow-cycles.png` | Cycle management |
| Plants | `#/plants` | `grow/plants.png` | Individual plant tracking |
| Grow Sources | `#/grow-sources` | `grow/grow-sources.png` | Mother plants / clones |
| Rooms | `#/rooms` | `grow/rooms.png` | Grow room management |
| Harvest | `#/harvest` | `grow/harvest.png` | Harvest records |
| QA Lot | `#/qa-lot` | `grow/qa-lot.png` | QA lot management |
| QA Sample | `#/qa-sample` | `grow/qa-sample.png` | Sample testing |
| Disposal | `#/disposal` | `grow/disposal.png` | Plant disposal tracking |

### Grow Interactive States
| State | Screenshot | Trail |
|-------|-----------|-------|
| Disposal — Destroyed tab | `grow/states/disposal-destroyed-tab.png` | Disposal → click "Destroyed" tab |

---

## Module 2: Analytics
**Path:** `/app-analytics` | **Screenshot:** `analytics/overview.png`
**Description:** 12 report cards for sales and production analytics

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Overview | `#/` | `analytics/overview.png` | 12 report card grid |

### Analytics Reports (12)
1. Customer Sales Client By Product
2. Product By Client
3. Expected Days of Inventory
4. Harvest Yield
5. Last Ordered By Account
6. Monthly Sales 12mo
7. Monthly Sales Comparison
8. Monthly Sales by Sales Person
9. Production Run Input/Output
10. Product-Line Sales by Account
11. Sales Recommendations

### Analytics Interactive States
| State | Screenshot | Trail |
|-------|-----------|-------|
| Client By Product Report | `analytics/states/client-by-product-report.png` | Overview → click report card |

---

## Module 3: Sales
**Path:** `/crm` | **Screenshot:** `sales/dashboard.png`
**Description:** CRM, order management, cart-based B2B ordering

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Dashboard | `#/dashboard` | `sales/dashboard.png` | Sales metrics |
| Accounts | `#/accounts` | `sales/accounts.png` | Retailer accounts list |
| Account Groups | `#/account-groups` | `sales/account-groups.png` | Territory groupings |
| Carts | `#/open-carts` | `sales/carts.png` | Open orders from portal |
| Inventory | `#/products` | `sales/inventory.png` | Product availability view |
| Catalogs | `#/product-catalogs` | `sales/catalogs.png` | Product catalogs |
| Orders | `#/orders` | `sales/orders.png` | Order history |
| Sales Person Report | `#/sales-person-report` | `sales/sales-person-report.png` | Per-rep performance |
| Order Summary | `#/order-summary` | `sales/order-summary.png` | Order summary report |

### Sales Interactive States
| State | Screenshot | Trail |
|-------|-----------|-------|
| Cart Detail — PRC Conway | `sales/states/cart-detail-prc-conway.png` | Carts → click date in row |
| Add Account Group Modal | `sales/states/add-account-group-modal.png` | Account Groups → Add button |

---

## Module 4: Inventory Management
**Path:** `/inventory/` | **Screenshot:** `inventory/overview.png`
**Description:** Full inventory lifecycle — products, batches, QA, BOMs, strains

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Overview / Manage Menu | `#/product-menu` | `inventory/overview.png` | Price/availability management grid |
| Batches | `#/batches` | `inventory/batches.png` | Batch lot management |
| Non-Cannabis Inventory | `#/non-cannabis-inventory` | `inventory/non-cannabis-inventory.png` | Packaging/supplies |
| Production (BOMs) | `#/production` | `inventory/production.png` | 8 Bills of Materials |
| Categories | `#/categories` | `inventory/categories.png` | Product categorization |
| Product Lines | `#/product-lines` | `inventory/product-lines.png` | 8 product lines |
| Products | `#/products` | `inventory/products.png` | Card grid view |
| Catalog Groups | `#/catalog-groups` | `inventory/catalog-groups.png` | 4 catalog groups |
| Strains | `#/strains` | `inventory/strains.png` | 173 strains |
| Inventory Rooms | `#/inventory-rooms` | `inventory/inventory-rooms.png` | 13 rooms, 2811 plants |
| Discount & Promotion | `#/discount-promotion` | `inventory/discount-promotion.png` | Pricing rules |
| Backorders | `#/backorders` | `inventory/backorders.png` | Presales/backorder tracking |
| QA Result (COA) | `#/qa-result` | `inventory/qa-result.png` | Lab results with cannabinoid %s |
| Conversions for Orders | `#/conversions-for-orders` | `inventory/conversions-for-orders.png` | Unit conversions |
| Product Tag | `#/product-tag` | `inventory/product-tag.png` | Label/tag management |
| QA Lot | `#/qa-lot` | `inventory/qa-lot.png` | QA lot tracking |
| QA Sample | `#/qa-sample` | `inventory/qa-sample.png` | 3 tabs: QA Sample/Manifest/QA Labs |
| Employee Sample | `#/employee-sample` | `inventory/employee-sample.png` | Internal samples |
| Disposal | `#/disposal` | `inventory/disposal.png` | Inventory disposal |

---

## Module 5: Fulfillment
**Path:** `/fulfillment` | **Screenshot:** `fulfillment/overview.png`
**Description:** Order fulfillment, manifests, delivery, and transfers

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Orders | `#/orders` | `fulfillment/overview.png` | Order list with status filters |
| Vehicles | `#/vehicles` | `fulfillment/vehicles.png` | Delivery/pickup vehicles |
| Drivers | `#/drivers` | `fulfillment/drivers.png` | Delivery/pickup drivers |
| Delivery Agents | `#/delivery-agents` | `fulfillment/delivery-agents.png` | 46 3rd-party agents |
| Quarantine Schedule | `#/fulfillment/quarantine-release-schedule` | `fulfillment/quarantine-schedule.png` | Quarantine release dates |
| Delivery Schedule | `#/fulfillment/delivery-schedule` | `fulfillment/delivery-schedule.png` | Manifested/unmanifested orders |
| Transfer Inbound | `#/inbound` | `fulfillment/transfer-inbound.png` | Incoming transfers (TSID) |
| Transfer Outbound | `#/outbound` | `fulfillment/transfer-outbound.png` | Outgoing transfers |

### Fulfillment Interactive States
| State | Screenshot | Trail |
|-------|-----------|-------|
| Transfer Inbound Detail | `fulfillment/states/transfer-inbound-detail.png` | Transfer Inbound → click TSID row |

---

## Module 6: Configuration
**Path:** `/configuration` | **Screenshot:** `configuration/overview.png`
**Description:** System settings, users, roles, integrations

| Sub-Page | Route | Screenshot | Notes |
|----------|-------|-----------|-------|
| Account Management | `#/account-management` | `configuration/overview.png` | Sales person → assigned clients |
| Marketplace Settings | `#/market-settings` | `configuration/marketplace-settings.png` | Two market profiles with FROST logo |
| Client Note Attributes | `#/client-note-attributes` | `configuration/client-note-attributes.png` | 4 attributes |
| Statuses | `#/statuses` | `configuration/statuses.png` | 7 client statuses |
| Notifications | `#/exteranlNotfication` | `configuration/notifications.png` | Email subscribers |
| Routes | `#/routes` | `configuration/routes.png` | Delivery routes |
| Users | `#/users` | `configuration/users.png` | 5 system users |
| Roles | `#/roles` | `configuration/roles.png` | 4 roles |
| Audit | `#/audit` | `configuration/audit.png` | 2073 audit log entries |
| Sync Settings | `#/setting/sync-setting` | `configuration/sync-settings.png` | Leaf Data API key |
| Locations | `#/setting/locations-setting` | `configuration/locations.png` | 1 location (415986) |
| Chart of Accounts | `#/chart-of-accounts` | `configuration/chart-of-accounts.png` | 51 sub-product-lines |
| QuickBooks Setting | `#/quickBook-setting` | `configuration/quickbooks-setting.png` | QB Online OAuth + discount setting |
| Cultivera API Key | `#/cultivera-api-key` | `configuration/cultivera-api-key.png` | LCB Manifest Browser Extension key |

---

## Chrome Elements (Captured Once)
| Element | Screenshot |
|---------|-----------|
| Post-login state | `chrome/post-login.png` |
| Module switcher open | `chrome/module-switcher-open.png` |

---

## Component Census

| Component Type | Count | Found On |
|---------------|-------|---------|
| Data table (sortable, paginated) | ~35 | All modules |
| Filter tab bar (status tabs) | ~8 | Sales orders, Fulfillment orders, Analytics, QA |
| Search input + button | ~20 | All list pages |
| Date range picker pair | ~6 | Quarantine, Delivery, Audit, Transfers |
| Stat cards (icon + label + number) | ~15 | Fulfillment orders, Inventory rooms, Grow |
| Kanban board | 1 | Grow overview |
| Report card grid | 1 | Analytics overview |
| Form (create/edit entity) | ~15 | All modules |
| Modal (inline over table) | ~8 | Account groups, Add forms |
| Tab switcher (within page) | ~5 | Vehicles/Drivers, Disposal, QA Sample |
| Breadcrumb navigation | All pages | All modules |
| Multi-select checkbox table | ~6 | Chart of Accounts, Transfers, Audit |
| Export to Excel button | ~10 | Most list pages |
| Import from State System | 3 | Vehicles, Drivers, Transfers |
| Pagination (prev/next/page) | All tables | All modules |
| Logo upload (file chooser) | 2 | Marketplace Settings |
| OAuth connect button | 1 | QuickBooks Setting |

---

## Tenant Context (G&S GREENERY)
- **License:** 415986
- **Address:** 19321 63RD AVE NE STE A, Arlington, WA 98223
- **Markets:** G&S GREENERY + G&S Greenery Wholesale
- **Brand Logo:** FROST (snowflake + wordmark) — appears in Marketplace Settings
- **Market URL:** `https://wa.cultiveramarket.com/bm/market/g&s-greenery/menu`
- **Contact:** nicholecluff@gmail.com, 425-512-7267
- **Active Users:** 5 (Michael Perkins, Nichole Cluff, Richard Maloney, Stacia Hartwell, Support Cultivera)
- **Plants:** 2,811 across 13 rooms
- **Strains:** 173
- **Delivery Agents:** 46 third-party agents
- **Products in Audit:** Blue Nerdz, Lizard Burger, Apple Banana Flambe (recent additions)
